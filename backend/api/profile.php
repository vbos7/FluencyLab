<?php
require_once __DIR__ . '/cors.php';

require_once __DIR__ . '/db.php';

if (!isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);

    exit;
}

$userId = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    json_out($stmt->fetch());

    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body  = json_decode(file_get_contents('php://input'), true);
    $name  = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');

    $fields = [];
    $params = [];

    if (!empty($name)) {
        $fields[] = 'name = ?';
        $params[] = $name;
    }

    if (!empty($email)) {
        $fields[] = 'email = ?';
        $params[] = $email;
    }

    if (empty($fields)) {
        json_out(['error' => 'Nada para atualizar'], 422);

        exit;
    }

    $params[] = $userId;
    $pdo->prepare("UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

    if (!empty($name)) {
        $_SESSION['name'] = $name;
    }

    $stmt = $pdo->prepare("SELECT id, name, email, role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    json_out($stmt->fetch());

    exit;
}

json_out(['error' => 'Método não permitido'], 405);
