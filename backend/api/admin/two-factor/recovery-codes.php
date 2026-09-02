<?php

/**
 * POST /api/admin/two-factor/recovery-codes.php   body: { password }
 *
 * Regera os códigos de recuperação (os antigos param de funcionar). Exige a
 * senha atual, como o disable. Só faz sentido com o 2FA já ativo.
 */

require_once __DIR__.'/../guard.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
require_once __DIR__.'/../../lib/twofactor.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$userId = (int) $_SESSION['user_id'];
$body = json_decode(file_get_contents('php://input'), true) ?? [];
$password = (string) ($body['password'] ?? '');

$stmt = $pdo->prepare('SELECT password_hash, two_factor_confirmed_at FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (! $user || ! password_verify($password, $user['password_hash'])) {
    json_out(['errors' => ['Senha incorreta']], 422);
    exit;
}
if ($user['two_factor_confirmed_at'] === null) {
    json_out(['error' => 'Ative o 2FA antes de gerar códigos de recuperação.'], 409);
    exit;
}

$codes = recovery_codes_generate();
$pdo->prepare('UPDATE users SET two_factor_recovery_codes = ? WHERE id = ?')
    ->execute([recovery_codes_hash($codes), $userId]);

json_out(['success' => true, 'recovery_codes' => $codes]);
