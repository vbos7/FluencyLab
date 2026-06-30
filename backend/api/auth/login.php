<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    json_out(['error' => 'Método não permitido']);
    exit;
}

$body     = json_decode(file_get_contents('php://input'), true);
$email    = trim($body['email']    ?? '');
$password = $body['password']      ?? '';

if (empty($email) || empty($password)) {
    http_response_code(422);
    json_out(['errors' => ['Email e senha são obrigatórios']]);
    exit;
}

// Busca o usuário pelo email
$stmt = $pdo->prepare("SELECT id, name, email, password_hash, role FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

// password_verify() compara a senha digitada com o hash salvo no banco
// Usamos a mesma mensagem para email ou senha errados — não revelamos qual dos dois falhou
if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    json_out(['errors' => ['Credenciais inválidas']]);
    exit;
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['name']    = $user['name'];
$_SESSION['role']    = $user['role'];

echo json_encode([
    'success' => true,
    'user' => [
        'id'    => $user['id'],
        'name'  => $user['name'],
        'email' => $user['email'],
        'role'  => $user['role'],
    ],
]);
