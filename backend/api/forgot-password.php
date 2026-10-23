<?php

require_once __DIR__ . '/cors.php';

require_once __DIR__ . '/db.php';

require_once __DIR__ . '/config/mail.php';

require_once __DIR__ . '/lib/login-throttle.php';

// Pedidos de código por e-mail e por IP na janela do throttle (15 min). Sem isso
// dava para trocar o código sem parar (cada pedido traz 5 tentativas novas) e
// lotar a caixa de entrada da vítima.
const RESET_MAX_PER_EMAIL = 3;
const RESET_MAX_PER_IP    = 10;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);

    exit;
}

$body  = json_decode(file_get_contents('php://input'), true);
$email = trim($body['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(['errors' => ['Email inválido']], 422);

    exit;
}

$chave = 'reset:' . mb_strtolower($email);
$ip    = client_ip();

if (throttle_excedido($pdo, $chave, $ip, RESET_MAX_PER_EMAIL, RESET_MAX_PER_IP, 'reset:')) {
    json_out(['errors' => ['Muitos pedidos de código. Aguarde alguns minutos e tente de novo.']], 429);

    exit;
}

throttle_registrar($pdo, $chave, $ip);

try {
    $stmt = $pdo->prepare('SELECT id, name FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Só gera/envia se a conta existir — mas a RESPOSTA é sempre a mesma (abaixo),
    // pra não revelar quais e-mails têm cadastro (evita enumeração de usuários).
    if ($user) {
        $codigo     = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $codigoHash = password_hash($codigo, PASSWORD_DEFAULT);
        $expiraEm   = date('Y-m-d H:i:s', strtotime('+15 minutes'));

        $stmt = $pdo->prepare('UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0');
        $stmt->execute([$user['id']]);

        $stmt = $pdo->prepare(
            'INSERT INTO password_resets (user_id, code_hash, expires_at) VALUES (?, ?, ?)'
        );
        $stmt->execute([$user['id'], $codigoHash, $expiraEm]);

        $enviado = enviarEmail(
            $email,
            'Recuperação de senha — FluencyLab',
            templateEmailCodigo($user['name'], $codigo)
        );

        if (!$enviado) {
            error_log("Falha ao enviar código de recuperação para user_id={$user['id']}");
        }
    }

    // Resposta genérica idêntica exista ou não a conta.
    json_out(['success' => true, 'message' => 'Se existir uma conta com esse e-mail, enviamos um código.']);

} catch (PDOException $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Erro interno no servidor'], 500);
}
