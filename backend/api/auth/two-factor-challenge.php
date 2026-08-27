<?php

/**
 * two-factor-challenge.php — 2º passo do login de um admin com 2FA ativo.
 *
 * Só funciona logo após o login.php ter devolvido {two_factor:true} (que grava
 * $_SESSION['2fa_pending_user_id']). Aceita OU um código do autenticador
 * (campo "code") OU um código de recuperação (campo "recovery_code"). Em caso de
 * sucesso, promove a sessão a "logada" de verdade.
 */

require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../lib/twofactor.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$pendingId = $_SESSION['2fa_pending_user_id'] ?? null;
if (! $pendingId) {
    json_out(['errors' => ['Sessão de verificação expirada. Faça login novamente.']], 401);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true) ?? [];
$code = trim((string) ($body['code'] ?? ''));
$recovery = trim((string) ($body['recovery_code'] ?? ''));

$stmt = $pdo->prepare('SELECT id, name, email, role, two_factor_secret, two_factor_recovery_codes FROM users WHERE id = ?');
$stmt->execute([$pendingId]);
$user = $stmt->fetch();

// 2FA foi desativado nesse meio tempo, ou o usuário sumiu.
if (! $user || $user['two_factor_secret'] === null) {
    unset($_SESSION['2fa_pending_user_id']);
    json_out(['errors' => ['Não foi possível verificar. Faça login novamente.']], 401);
    exit;
}

$verified = false;

if ($code !== '') {
    $secret = app_decrypt($user['two_factor_secret']);
    $verified = $secret !== null && totp_verify($secret, $code);
} elseif ($recovery !== '') {
    // Código de recuperação é de uso único: se casar, gravamos a lista sem ele.
    $remaining = null;
    if (recovery_codes_consume($user['two_factor_recovery_codes'], $recovery, $remaining)) {
        $pdo->prepare('UPDATE users SET two_factor_recovery_codes = ? WHERE id = ?')
            ->execute([$remaining, $user['id']]);
        $verified = true;
    }
} else {
    json_out(['errors' => ['Informe o código do autenticador ou um código de recuperação.']], 422);
    exit;
}

if (! $verified) {
    json_out(['errors' => ['Código inválido']], 401);
    exit;
}

// Segundo fator OK → promove a sessão.
unset($_SESSION['2fa_pending_user_id']);
$_SESSION['user_id'] = (int) $user['id'];
$_SESSION['role'] = $user['role'];

json_out([
    'success' => true,
    'user' => [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
    ],
]);
