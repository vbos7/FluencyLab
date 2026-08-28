<?php

require_once __DIR__.'/../cors.php';

require_once __DIR__.'/../db.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);

    exit;
}

// O Next.js manda JSON no corpo da requisição, não $_POST
$body = json_decode(file_get_contents('php://input'), true);

$name = trim($body['name'] ?? '');
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';
$confirm = $body['password_confirmation'] ?? '';

// Validação manual
$errors = [];

if (empty($name)) {
    $errors[] = 'Nome é obrigatório';
}

if (empty($email) || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email inválido';
}

if (strlen($password) < 6) {
    $errors[] = 'Senha precisa ter pelo menos 6 caracteres';
}

if ($password !== $confirm) {
    $errors[] = 'As senhas não coincidem';
}

if (! empty($errors)) {
    json_out(['errors' => $errors], 422);

    exit;
}

// Verifica se email já existe
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);

if ($stmt->fetch()) {
    json_out(['errors' => ['Este email já está cadastrado']], 422);

    exit;
}

// password_hash() gera um hash seguro — nunca salve senha em texto puro!
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
$stmt->execute([$name, $email, $hash]);
$userId = $pdo->lastInsertId();

// Inicia a sessão. O papel não vai na sessão: a autorização lê users.role do
// banco (admin/guard.php e /auth/me.php), fonte única de verdade.
$_SESSION['user_id'] = $userId;

json_out([
    'success' => true,
    'user' => ['id' => (int) $userId, 'name' => $name, 'email' => $email, 'role' => 'student'],
], 201);
