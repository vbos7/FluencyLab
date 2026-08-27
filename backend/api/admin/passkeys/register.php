<?php

/**
 * POST /api/admin/passkeys/register.php
 * body: { clientDataJSON, attestationObject, name? }   (base64url)
 *
 * Passo 2 do cadastro: valida a resposta do autenticador contra o desafio
 * guardado na sessão e grava a credencial (id + chave pública) para os próximos
 * logins do painel.
 */

require_once __DIR__.'/../guard.php';
require_once __DIR__.'/../../lib/webauthn.php';

use lbuchs\WebAuthn\WebAuthnException;

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$userId = (int) $_SESSION['user_id'];
$body = json_decode(file_get_contents('php://input'), true) ?? [];

$clientDataJSON = b64u_decode((string) ($body['clientDataJSON'] ?? ''));
$attestationObject = b64u_decode((string) ($body['attestationObject'] ?? ''));
$apelido = trim((string) ($body['name'] ?? '')) ?: null;

$challenge = webauthn_take_challenge();
if ($challenge === null || $clientDataJSON === '' || $attestationObject === '') {
    json_out(['errors' => ['Cerimônia de registro inválida ou expirada. Tente de novo.']], 422);
    exit;
}

try {
    $wa = webauthn_server();
    $data = $wa->processCreate($clientDataJSON, $attestationObject, $challenge, true);
} catch (WebAuthnException $e) {
    json_out(['errors' => ['Não foi possível registrar o passkey: '.$e->getMessage()]], 422);
    exit;
}

// credentialId é binário (VARBINARY); publicKey é o PEM usado na verificação.
$stmt = $pdo->prepare(
    'INSERT INTO webauthn_credentials (user_id, credential_id, public_key, sign_count, name)
     VALUES (?, ?, ?, ?, ?)'
);
$stmt->execute([
    $userId,
    $data->credentialId,
    $data->credentialPublicKey,
    (int) ($data->signatureCounter ?? 0),
    $apelido,
]);

json_out(['success' => true, 'id' => (int) $pdo->lastInsertId()]);
