<?php

/**
 * POST /api/admin/two-factor/enable.php
 *
 * Passo 1 do 2FA: gera um segredo TOTP PROVISÓRIO (cifrado em repouso) e devolve
 * o QR + segredo para o admin cadastrar no app autenticador. Ainda NÃO ativa —
 * ativação só em confirm.php, depois de o admin provar que escaneou certo.
 *
 * Regerar antes de confirmar simplesmente substitui o segredo provisório.
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

$stmt = $pdo->prepare('SELECT email, two_factor_confirmed_at FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

if ($user && $user['two_factor_confirmed_at'] !== null) {
    json_out(['error' => 'O 2FA já está ativo. Desative antes de gerar um novo segredo.'], 409);
    exit;
}

$secret = totp_new_secret();
$uri = totp_uri($secret, $user['email']);

// Guarda cifrado; confirmed_at continua NULL até o confirm.php.
$pdo->prepare('UPDATE users SET two_factor_secret = ?, two_factor_confirmed_at = NULL WHERE id = ?')
    ->execute([app_encrypt($secret), $userId]);

json_out([
    'secret' => $secret,        // para digitar manualmente no app
    'otpauth_uri' => $uri,      // caso o front queira gerar o próprio QR
    'qr' => totp_qr_data_uri($uri), // data URI SVG pronto para <img src>
]);
