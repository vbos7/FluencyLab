<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    json_out(['error' => 'Não autenticado']);
    exit;
}

$userId = $_SESSION['user_id'];

// GET — devolve os dados do usuário logado
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        json_out(['error' => 'Usuário não encontrado']);
        exit;
    }

    json_out($user);
    exit;
}

// PUT — atualiza nome e/ou email
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body  = json_decode(file_get_contents('php://input'), true);
    $name  = trim($body['name']  ?? '');
    $email = trim($body['email'] ?? '');

    $fields = [];
    $params = [];

    if (!empty($name)) {
        $fields[] = 'name = ?';
        $params[] = $name;
    }
    if (!empty($email)) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(422);
            json_out(['errors' => ['Email inválido']]);
            exit;
        }
        $fields[] = 'email = ?';
        $params[] = $email;
    }

    if (empty($fields)) {
        http_response_code(422);
        json_out(['errors' => ['Nenhum campo para atualizar']]);
        exit;
    }

    $params[] = $userId;
    $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?';
    $pdo->prepare($sql)->execute($params);

    // Atualiza o nome na sessão
    if (!empty($name)) $_SESSION['name'] = $name;

    $stmt = $pdo->prepare("SELECT id, name, email, role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    json_out($stmt->fetch());
    exit;
}

http_response_code(405);
json_out(['error' => 'Método não permitido']);
