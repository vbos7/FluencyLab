<?php

/**
 * POST /api/auth/passkey/login.php
 * body: { id, clientDataJSON, authenticatorData, signature }   (base64url)
 *
 * Passo 2 do login próprio do painel. Identifica a credencial pelo id devolvido
 * pelo autenticador, valida a assinatura contra a chave pública guardada e o
 * desafio da sessão, confirma que o dono é ADMIN e então abre a sessão logada.
 */

require_once __DIR__.'/../../cors.php';
require_once __DIR__.'/../../db.php';
require_once __DIR__.'/../../lib/webauthn.php';

use lbuchs\WebAuthn\WebAuthnException;

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];
$rawId = b64u_decode((string) ($body['id'] ?? ''));
$clientDataJSON = b64u_decode((string) ($body['clientDataJSON'] ?? ''));
$authenticatorData = b64u_decode((string) ($body['authenticatorData'] ?? ''));
$signature = b64u_decode((string) ($body['signature'] ?? ''));

$challenge = webauthn_take_challenge();
if ($challenge === null || $rawId === '' || $clientDataJSON === '' || $authenticatorData === '' || $signature === '') {
    json_out(['errors' => ['Cerimônia de login inválida ou expirada.']], 401);
    exit;
}

// Localiza a credencial + o dono. Só admin pode entrar pelo painel.
$stmt = $pdo->prepare(
    'SELECT c.id, c.user_id, c.public_key, c.sign_count, u.name, u.email, u.role
     FROM webauthn_credentials c JOIN users u ON u.id = c.user_id
     WHERE c.credential_id = ?'
);
$stmt->execute([$rawId]);
$cred = $stmt->fetch();

if (! $cred || $cred['role'] !== 'admin') {
    json_out(['errors' => ['Passkey não reconhecido.']], 401);
    exit;
}

try {
    $wa = webauthn_server();
    $wa->processGet(
        $clientDataJSON,
        $authenticatorData,
        $signature,
        $cred['public_key'],
        $challenge,
        (int) $cred['sign_count'],
        true // requireUserVerification
    );
} catch (WebAuthnException $e) {
    json_out(['errors' => ['Falha na verificação do passkey.']], 401);
    exit;
}

// Atualiza o contador anti-clonagem e o "último uso".
$novoContador = $wa->getSignatureCounter();
$pdo->prepare('UPDATE webauthn_credentials SET sign_count = ?, last_used_at = NOW() WHERE id = ?')
    ->execute([(int) ($novoContador ?? $cred['sign_count']), $cred['id']]);

// Passkey já é forte (posse + verificação do usuário): loga direto, sem 2FA.
// O papel não vai na sessão: a autorização lê users.role do banco
// (admin/guard.php e /auth/me.php), fonte única de verdade.
$_SESSION['user_id'] = (int) $cred['user_id'];

json_out([
    'success' => true,
    'user' => [
        'id' => (int) $cred['user_id'],
        'name' => $cred['name'],
        'email' => $cred['email'],
        'role' => 'admin',
    ],
]);
