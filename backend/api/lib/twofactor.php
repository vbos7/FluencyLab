<?php

/**
 * twofactor.php — 2FA por TOTP (RFC 6238), o mesmo padrão do Google
 * Authenticator/Authy e do Laravel Fortify. Só admins usam.
 *
 * Fluxo: enable gera um segredo provisório e mostra o QR → o admin escaneia →
 * confirm valida um código e ATIVA (grava confirmed_at + códigos de recuperação).
 * A partir daí, o login comum de um admin passa a exigir o código.
 *
 * Segurança:
 *  - o segredo é cifrado em repouso (app_encrypt / crypto.php);
 *  - a verificação do código usa comparação em tempo constante (otphp);
 *  - códigos de recuperação são guardados como HASH (nunca em claro).
 */

require_once __DIR__.'/../../vendor/autoload.php';
require_once __DIR__.'/crypto.php';

use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use OTPHP\TOTP;

const TWO_FACTOR_ISSUER = 'FluencyLab';
// Tolerância de relógio, em segundos (< período de 30s). Cobre o autenticador do
// usuário adiantado/atrasado sem alargar demais a janela de aceitação.
const TWO_FACTOR_LEEWAY = 15;

/** Gera um novo segredo base32 aleatório. */
function totp_new_secret(): string
{
    return TOTP::generate()->getSecret();
}

function totp_instance(string $secret, string $email): TOTP
{
    $totp = TOTP::createFromSecret($secret);
    $totp->setLabel($email);
    $totp->setIssuer(TWO_FACTOR_ISSUER);

    return $totp;
}

/** otpauth:// URI que o app autenticador lê (via QR ou digitando o segredo). */
function totp_uri(string $secret, string $email): string
{
    return totp_instance($secret, $email)->getProvisioningUri();
}

/** Confere um código de 6 dígitos contra o segredo, com janela de tolerância. */
function totp_verify(string $secret, string $code): bool
{
    $code = preg_replace('/\s+/', '', $code);
    if ($code === '' || ! ctype_digit($code)) {
        return false;
    }

    return TOTP::createFromSecret($secret)->verify($code, null, TWO_FACTOR_LEEWAY);
}

/** SVG do QR code a partir do otpauth URI. */
function totp_qr_svg(string $uri): string
{
    $writer = new Writer(new ImageRenderer(new RendererStyle(220, 1), new SvgImageBackEnd));

    return $writer->writeString($uri);
}

/** Data URI (SVG) pronto para um <img src> no front. */
function totp_qr_data_uri(string $uri): string
{
    return 'data:image/svg+xml;base64,'.base64_encode(totp_qr_svg($uri));
}

/**
 * Gera N códigos de recuperação legíveis, ex.: "9F2A1B-7C4D0E".
 * Devolvidos em claro UMA vez (para o admin salvar); no banco vão só os hashes.
 *
 * @return string[]
 */
function recovery_codes_generate(int $n = 8): array
{
    $codes = [];
    for ($i = 0; $i < $n; $i++) {
        $codes[] = strtoupper(bin2hex(random_bytes(3)).'-'.bin2hex(random_bytes(3)));
    }

    return $codes;
}

/** Serializa a lista de códigos como JSON de hashes para gravar no banco. */
function recovery_codes_hash(array $codes): string
{
    return json_encode(array_map(
        static fn (string $c): string => password_hash($c, PASSWORD_DEFAULT),
        $codes
    ));
}

/**
 * Confere um código de recuperação contra a lista de hashes. Se casar, REMOVE o
 * hash usado (uso único) e devolve o JSON restante em $remainingJson.
 */
function recovery_codes_consume(?string $storedJson, string $code, ?string &$remainingJson): bool
{
    $code = strtoupper(trim($code));
    $hashes = $storedJson ? json_decode($storedJson, true) : [];
    if (! is_array($hashes) || $code === '') {
        return false;
    }

    foreach ($hashes as $i => $hash) {
        if (password_verify($code, $hash)) {
            unset($hashes[$i]);
            $remainingJson = json_encode(array_values($hashes));

            return true;
        }
    }

    return false;
}
