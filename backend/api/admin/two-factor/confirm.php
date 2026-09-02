<?php

/**
 * POST /api/admin/two-factor/confirm.php   body: { code }
 *
 * Passo 2 do 2FA: valida o primeiro código gerado pelo app e ATIVA o 2FA
 * (grava two_factor_confirmed_at) — a partir daqui o login do admin exige o 2º
 * fator. Devolve os códigos de recuperação UMA única vez (guardamos só o hash).
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
$code = trim((string) ($body['code'] ?? ''));

if ($code === '') {
    json_out(['errors' => ['Informe o código do aplicativo autenticador.']], 422);
    exit;
}

$stmt = $pdo->prepare('SELECT two_factor_secret, two_factor_confirmed_at FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (! $user || $user['two_factor_secret'] === null) {
    json_out(['error' => 'Gere o segredo em /two-factor/enable antes de confirmar.'], 409);
    exit;
}
if ($user['two_factor_confirmed_at'] !== null) {
    json_out(['error' => 'O 2FA já está ativo.'], 409);
    exit;
}

$secret = app_decrypt($user['two_factor_secret']);
if ($secret === null || ! totp_verify($secret, $code)) {
    json_out(['errors' => ['Código inválido. Verifique o horário do dispositivo e tente de novo.']], 422);
    exit;
}

$codes = recovery_codes_generate();

$pdo->prepare('UPDATE users SET two_factor_confirmed_at = NOW(), two_factor_recovery_codes = ? WHERE id = ?')
    ->execute([recovery_codes_hash($codes), $userId]);

json_out([
    'success' => true,
    'recovery_codes' => $codes, // mostre e peça para o admin guardar — não dá para ver de novo
]);
