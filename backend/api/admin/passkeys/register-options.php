<?php

/**
 * POST /api/admin/passkeys/register-options.php
 *
 * Passo 1 do cadastro de um passkey (admin já logado, a partir do perfil).
 * Devolve os "publicKey" args para o navigator.credentials.create() e guarda o
 * desafio na sessão. Pede residentKey + userVerification: assim o autenticador
 * guarda o handle do usuário e o login do painel pode ser SEM digitar email.
 */

require_once __DIR__.'/../guard.php';
require_once __DIR__.'/../../lib/webauthn.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$userId = (int) $_SESSION['user_id'];

$stmt = $pdo->prepare('SELECT name, email FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

// Não deixa registrar duas vezes o mesmo autenticador.
$stmt = $pdo->prepare('SELECT credential_id FROM webauthn_credentials WHERE user_id = ?');
$stmt->execute([$userId]);
$excludeIds = array_map(
    static fn (array $r): string => $r['credential_id'],
    $stmt->fetchAll()
);

$wa = webauthn_server();
$args = $wa->getCreateArgs(
    (string) $userId,   // user handle
    $user['email'],
    $user['name'],
    60,                 // timeout (s)
    true,               // requireResidentKey → habilita login sem email
    true,               // requireUserVerification (biometria/PIN)
    null,               // qualquer tipo de autenticador
    $excludeIds
);

webauthn_store_challenge($wa);

json_out($args);
