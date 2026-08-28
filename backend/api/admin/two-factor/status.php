<?php

/**
 * GET /api/admin/two-factor/status.php
 *
 * Estado do 2FA do admin logado — o front usa para renderizar o toggle e saber
 * quantos códigos de recuperação ainda restam.
 *   enabled   → segredo existente E confirmado (2FA valendo no login)
 *   pending   → segredo gerado mas ainda não confirmado
 */

require_once __DIR__.'/../guard.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$stmt = $pdo->prepare('SELECT two_factor_secret, two_factor_confirmed_at, two_factor_recovery_codes FROM users WHERE id = ?');
$stmt->execute([(int) $_SESSION['user_id']]);
$user = $stmt->fetch();

$hasSecret = $user && $user['two_factor_secret'] !== null;
$confirmed = $user && $user['two_factor_confirmed_at'] !== null;
$recovery = $user && $user['two_factor_recovery_codes'] ? json_decode($user['two_factor_recovery_codes'], true) : [];

json_out([
    'enabled' => $confirmed,
    'pending' => $hasSecret && ! $confirmed,
    'recovery_codes_remaining' => is_array($recovery) ? count($recovery) : 0,
]);
