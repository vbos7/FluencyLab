<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/config/mail.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$email = trim($body['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_out(['errors' => ['Email inválido']], 422);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Agora informa explicitamente quando o email não está cadastrado
    if (!$user) {
        json_out(['errors' => ['Não encontramos uma conta com esse email.']], 404);
        exit;
    }

    $codigo = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $codigoHash = password_hash($codigo, PASSWORD_DEFAULT);
    $expiraEm = date('Y-m-d H:i:s', strtotime('+15 minutes'));

    $stmt = $pdo->prepare("UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0");
    $stmt->execute([$user['id']]);

    $stmt = $pdo->prepare(
        "INSERT INTO password_resets (user_id, code_hash, expires_at) VALUES (?, ?, ?)"
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

    json_out(['success' => true, 'message' => 'Código enviado! Confira seu email.']);

} catch (PDOException $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Erro interno no servidor'], 500);
}