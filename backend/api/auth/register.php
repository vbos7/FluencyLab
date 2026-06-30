<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    json_out(['error' => 'Método não permitido']);
    exit;
}

// Lê o corpo da requisição (o Next.js manda JSON, não form-data)
$body = json_decode(file_get_contents('php://input'), true);

$name     = trim($body['name']     ?? '');
$email    = trim($body['email']    ?? '');
$password = $body['password']      ?? '';
$confirm  = $body['password_confirmation'] ?? '';

// Validação básica
$errors = [];
if (empty($name))                         $errors[] = 'Nome é obrigatório';
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email inválido';
if (strlen($password) < 6)                $errors[] = 'Senha precisa ter pelo menos 6 caracteres';
if ($password !== $confirm)               $errors[] = 'As senhas não coincidem';

if (!empty($errors)) {
    http_response_code(422);
    json_out(['errors' => $errors]);
    exit;
}

// Verifica se email já existe
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(422);
    json_out(['errors' => ['Este email já está cadastrado']]);
    exit;
}

// password_hash() gera um hash seguro (bcrypt) — nunca salve senha em texto puro!
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
$stmt->execute([$name, $email, $hash]);

$userId = $pdo->lastInsertId();

// Inicia a sessão com o ID do novo usuário
$_SESSION['user_id'] = $userId;
$_SESSION['name']    = $name;
$_SESSION['role']    = 'student';

http_response_code(201);
echo json_encode([
    'success' => true,
    'user' => [
        'id'    => $userId,
        'name'  => $name,
        'email' => $email,
        'role'  => 'student',
    ],
]);
