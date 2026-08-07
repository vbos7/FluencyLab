<?php
require_once __DIR__ . '/../cors.php';

require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);

    exit;
}

$body     = json_decode(file_get_contents('php://input'), true);
$email    = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

if (empty($email) || empty($password)) {
    json_out(['errors' => ['Email e senha são obrigatórios']], 422);

    exit;
}

$stmt = $pdo->prepare("SELECT id, name, email, password_hash, role FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

// password_verify() compara a senha com o hash salvo
if (!$user || !password_verify($password, $user['password_hash'])) {
    json_out(['errors' => ['Credenciais inválidas']], 401);

    exit;
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['role']    = $user['role'];

json_out([
    'success' => true,
    'user'    => [
        'id'    => (int)$user['id'],
        'name'  => $user['name'],
        'email' => $user['email'],
        'role'  => $user['role'],
    ],
]);
