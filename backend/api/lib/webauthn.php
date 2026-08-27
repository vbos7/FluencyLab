<?php

/**
 * webauthn.php — passkeys (WebAuthn/FIDO2) para o login próprio do painel admin.
 *
 * O navegador faz a parte criptográfica (navigator.credentials); aqui só
 * emitimos os "argumentos" da cerimônia e VALIDAMOS a resposta com a
 * lbuchs/webauthn. O desafio (challenge) de cada cerimônia é guardado na sessão
 * PHP e conferido na volta — é isso que impede replay.
 *
 * RP ID = host da origem do front (localhost em dev). O browser exige que a
 * origem da página seja esse host (ou subdomínio dele) e, fora localhost, HTTPS.
 */

require_once __DIR__.'/../../vendor/autoload.php';
require_once __DIR__.'/../env.php';

use lbuchs\WebAuthn\WebAuthn;

const WEBAUTHN_RP_NAME = 'FluencyLab';

/** Host puro da origem do front (sem esquema nem porta): o Relying Party ID. */
function webauthn_rp_id(): string
{
    $host = parse_url(env('APP_ORIGIN', 'http://localhost:3000'), PHP_URL_HOST);

    return $host ?: 'localhost';
}

function webauthn_server(): WebAuthn
{
    // Sem restringir formatos (null) → aceita 'none' e os demais, cobrindo
    // passkeys de plataforma (Touch ID/Windows Hello) e chaves físicas.
    // useBase64UrlEncoding=true: os ByteBuffers dos "args" viram strings
    // base64url no JSON — o front decodifica direto para ArrayBuffer.
    return new WebAuthn(WEBAUTHN_RP_NAME, webauthn_rp_id(), null, true);
}

// ─── base64url ⇄ binário (o browser troca ArrayBuffers nesse formato) ─────────

function b64u_encode(string $bin): string
{
    return rtrim(strtr(base64_encode($bin), '+/', '-_'), '=');
}

function b64u_decode(string $s): string
{
    return (string) base64_decode(strtr($s, '-_', '+/'), true);
}

/** Guarda o desafio da cerimônia atual na sessão (base64). */
function webauthn_store_challenge(WebAuthn $wa): void
{
    $_SESSION['webauthn_challenge'] = base64_encode($wa->getChallenge()->getBinaryString());
}

/** Recupera (e apaga — uso único) o desafio da sessão como binário. */
function webauthn_take_challenge(): ?string
{
    if (empty($_SESSION['webauthn_challenge'])) {
        return null;
    }
    $challenge = base64_decode($_SESSION['webauthn_challenge'], true);
    unset($_SESSION['webauthn_challenge']);

    return $challenge ?: null;
}
