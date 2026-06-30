<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    json_out(['error' => 'Acesso restrito a administradores']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// GET — lista todos os usuários
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
    json_out($stmt->fetchAll());
    exit;
}

// PUT /api/admin/users.php?id=5 — edita role ou nome de um usuário
if ($method === 'PUT') {
    $id   = (int) ($_GET['id'] ?? 0);
    $body = json_decode(file_get_contents('php://input'), true);

    if (!$id) { http_response_code(422); json_out(['error' => 'ID obrigatório']); exit; }

    $allowed = ['name', 'role'];
    $fields  = [];
    $params  = [];

    foreach ($allowed as $field) {
        if (isset($body[$field])) {
            $fields[] = "{$field} = ?";
            $params[] = $body[$field];
        }
    }

    if (empty($fields)) { http_response_code(422); json_out(['error' => 'Nada para atualizar']); exit; }

    $params[] = $id;
    $pdo->prepare("UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

    $stmt = $pdo->prepare("SELECT id, name, email, role FROM users WHERE id = ?");
    $stmt->execute([$id]);
    json_out($stmt->fetch());
    exit;
}

// DELETE /api/admin/users.php?id=5
if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if (!$id) { http_response_code(422); json_out(['error' => 'ID obrigatório']); exit; }
    $pdo->prepare("DELETE FROM users WHERE id = ?")->execute([$id]);
    http_response_code(204);
    exit;
}

http_response_code(405);
json_out(['error' => 'Método não permitido']);
