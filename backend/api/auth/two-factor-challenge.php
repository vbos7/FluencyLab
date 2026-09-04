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

// Máximo de tentativas por sessão pendente. O código TOTP tem só 6 dígitos
// (1 milhão de combinações); sem esse limite dá pra forçá-lo. Estourou → derruba
// a sessão pendente e obriga a refazer o login (senha de novo).
const MAX_2FA_ATTEMPTS = 5;

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$pendingId = $_SESSION['2fa_pending_user_id'] ?? null;
if (! $pendingId) {
    json_out(['errors' => ['Sessão de verificação expirada. Faça login novamente.']], 401);
    exit;
}

// Trava anti-força-bruta: se já esgotou as tentativas, encerra a sessão pendente.
if (($_SESSION['2fa_attempts'] ?? 0) >= MAX_2FA_ATTEMPTS) {
    unset($_SESSION['2fa_pending_user_id'], $_SESSION['2fa_attempts'], $_SESSION['remember_pref']);
    json_out(['errors' => ['Muitas tentativas. Faça login novamente.']], 429);
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
    // O código do app é sempre 6 dígitos: formato inválido já cai como falha,
    // sem nem chamar o verificador.
    if (preg_match('/^\d{6}$/', $code)) {
        $secret = app_decrypt($user['two_factor_secret']);
        $verified = $secret !== null && totp_verify($secret, $code);
    }
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
    $_SESSION['2fa_attempts'] = ($_SESSION['2fa_attempts'] ?? 0) + 1;
    $restantes = max(0, MAX_2FA_ATTEMPTS - $_SESSION['2fa_attempts']);
    json_out(['errors' => ['Código inválido'], 'attempts_left' => $restantes], 401);
    exit;
}

// Segundo fator OK → promove a sessão. O papel vem do banco na autorização
// (admin/guard.php), então não é guardado aqui.
$remember = ! empty($_SESSION['remember_pref']);
unset($_SESSION['2fa_pending_user_id'], $_SESSION['remember_pref'], $_SESSION['2fa_attempts']);
$_SESSION['user_id'] = (int) $user['id'];
aplicar_remember($remember);

json_out([
    'success' => true,
    'user' => [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
    ],
]);
