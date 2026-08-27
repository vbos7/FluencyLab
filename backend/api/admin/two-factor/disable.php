<?php

/**
 * DELETE /api/admin/two-factor/disable.php   body: { password }
 *
 * Desativa o 2FA. Por ser uma ação sensível, exige a senha atual do admin
 * (confirmação de senha) — assim uma sessão sequestrada não desliga a proteção
 * sozinha. Limpa segredo, códigos de recuperação e a marca de ativação.
 */

require_once __DIR__.'/../guard.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$userId = (int) $_SESSION['user_id'];
$body = json_decode(file_get_contents('php://input'), true) ?? [];
$password = (string) ($body['password'] ?? '');

$stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (! $user || ! password_verify($password, $user['password_hash'])) {
    json_out(['errors' => ['Senha incorreta']], 422);
    exit;
}

$pdo->prepare(
    'UPDATE users SET two_factor_secret = NULL, two_factor_recovery_codes = NULL, two_factor_confirmed_at = NULL WHERE id = ?'
)->execute([$userId]);

json_out(['success' => true]);
