<?php

require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';

if (! isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    json_out(['error' => 'Acesso restrito a administradores'], 403);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// GET — lista todos os usuários
if ($method === 'GET') {
    $stmt = $pdo->query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    json_out($stmt->fetchAll());
    exit;
}

// PUT ?id=5 — edita role ou nome
if ($method === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    $body = json_decode(file_get_contents('php://input'), true);
    $role = $body['role'] ?? null;
    $name = $body['name'] ?? null;

    $fields = [];
    $params = [];
    if ($name) {
        $fields[] = 'name = ?';
        $params[] = $name;
    }
    if ($role) {
        $fields[] = 'role = ?';
        $params[] = $role;
    }
    if (empty($fields) || ! $id) {
        json_out(['error' => 'Dados inválidos'], 422);
        exit;
    }

    $params[] = $id;
    $pdo->prepare('UPDATE users SET '.implode(', ', $fields).' WHERE id = ?')->execute($params);

    $stmt = $pdo->prepare('SELECT id, name, email, role FROM users WHERE id = ?');
    $stmt->execute([$id]);
    json_out($stmt->fetch());
    exit;
}

// DELETE ?id=5
if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if (! $id) {
        json_out(['error' => 'ID obrigatório'], 422);
        exit;
    }
    $pdo->prepare('DELETE FROM users WHERE id = ?')->execute([$id]);
    json_out(null, 204);
    exit;
}

json_out(['error' => 'Método não permitido'], 405);
