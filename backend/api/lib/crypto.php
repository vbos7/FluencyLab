<?php

/**
 * crypto.php — cifra simétrica autenticada para guardar segredos em repouso.
 *
 * Usa libsodium (XSalsa20-Poly1305 via secretbox): cifra E autentica, então um
 * valor adulterado no banco é rejeitado em vez de decifrar lixo. Hoje protege o
 * segredo TOTP do 2FA. A chave vem de APP_KEY (.env) — 32 bytes em base64.
 *
 * Gere a chave uma vez com:
 *   php -r "echo base64_encode(random_bytes(32)).PHP_EOL;"
 * e cole em APP_KEY no .env da raiz.
 *
 * Depende de json_out() (cors.php) e env() (env.php) — ambos já carregados pelos
 * endpoints antes de incluir este arquivo.
 */
function app_key(): string
{
    static $key = null;
    if ($key !== null) {
        return $key;
    }

    $raw = env('APP_KEY');
    if ($raw === '') {
        json_out(['error' => 'APP_KEY ausente. Gere com: php -r "echo base64_encode(random_bytes(32));" e coloque no .env'], 500);
        exit;
    }

    $decoded = base64_decode($raw, true);
    if ($decoded === false || strlen($decoded) !== SODIUM_CRYPTO_SECRETBOX_KEYBYTES) {
        json_out(['error' => 'APP_KEY inválida — precisa ser 32 bytes codificados em base64'], 500);
        exit;
    }

    return $key = $decoded;
}

/** Cifra um texto e devolve base64(nonce || ciphertext). */
function app_encrypt(string $plain): string
{
    $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    $cipher = sodium_crypto_secretbox($plain, $nonce, app_key());

    return base64_encode($nonce.$cipher);
}

/** Decifra o que app_encrypt() gerou. Devolve null se adulterado/ilegível. */
function app_decrypt(string $encoded): ?string
{
    $raw = base64_decode($encoded, true);
    if ($raw === false || strlen($raw) <= SODIUM_CRYPTO_SECRETBOX_NONCEBYTES) {
        return null;
    }

    $nonce = substr($raw, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    $cipher = substr($raw, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    $plain = sodium_crypto_secretbox_open($cipher, $nonce, app_key());

    return $plain === false ? null : $plain;
}
