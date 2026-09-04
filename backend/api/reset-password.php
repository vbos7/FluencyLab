<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$email = trim($body['email'] ?? '');
$codigo = trim($body['code'] ?? '');
$novaSenha = $body['new_password'] ?? '';
$confirmacao = $body['new_password_confirmation'] ?? '';

$errors = [];
if (empty($email) || empty($codigo)) {
    $errors[] = 'Email e código são obrigatórios';
}
if (strlen($novaSenha) < 6) {
    $errors[] = 'A nova senha precisa ter pelo menos 6 caracteres';
}
if ($novaSenha !== $confirmacao) {
    $errors[] = 'A confirmação da senha não coincide';
}

if (!empty($errors)) {
    json_out(['errors' => $errors], 422);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        json_out(['errors' => ['Código inválido ou expirado']], 422);
        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT id, code_hash FROM password_resets
         WHERE user_id = ? AND used = 0 AND expires_at > NOW()
         ORDER BY created_at DESC LIMIT 1"
    );
    $stmt->execute([$user['id']]);
    $reset = $stmt->fetch();

    if (!$reset || !password_verify($codigo, $reset['code_hash'])) {
        json_out(['errors' => ['Código inválido ou expirado']], 422);
        exit;
    }

    $pdo->beginTransaction();

    $novoHash = password_hash($novaSenha, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
    $stmt->execute([$novoHash, $user['id']]);

    $stmt = $pdo->prepare("UPDATE password_resets SET used = 1 WHERE id = ?");
    $stmt->execute([$reset['id']]);

    $pdo->commit();

    json_out(['success' => true, 'message' => 'Senha atualizada com sucesso.']);

} catch (PDOException $e) {
    $pdo->rollBack();
    error_log($e->getMessage());
    json_out(['error' => 'Erro interno no servidor'], 500);
}