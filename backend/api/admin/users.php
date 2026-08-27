<?php

require_once __DIR__.'/guard.php';

requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

// GET — lista todos os usuários com XP, nível e status de atividade
if ($method === 'GET') {
    // Subqueries escalares evitam multiplicar linhas ao cruzar ranking_points + attempts.
    $rows = $pdo->query('
        SELECT u.id, u.name, u.email, u.role, u.created_at,
               (SELECT COALESCE(SUM(points), 0) FROM ranking_points WHERE user_id = u.id) AS xp,
               (SELECT MAX(created_at) FROM attempts WHERE user_id = u.id) AS last_activity
        FROM users u
        ORDER BY u.created_at DESC
    ')->fetchAll();

    $limite = (new DateTime)->modify('-7 days');

    $saida = array_map(function ($u) use ($limite) {
        $xp = (int) $u['xp'];
        $nivel = 1;
        while ($xp >= $nivel * 150) {
            $nivel++;
        }

        // Ativo = teve alguma tentativa nos últimos 7 dias
        $ativo = $u['last_activity'] !== null && new DateTime($u['last_activity']) >= $limite;

        return [
            'id' => (int) $u['id'],
            'name' => $u['name'],
            'email' => $u['email'],
            'role' => $u['role'],
            'createdAt' => $u['created_at'],
            'xp' => $xp,
            'level' => $nivel,
            'isActive' => $ativo,
        ];
    }, $rows);

    json_out($saida);
    exit;
}

// POST — cria um novo usuário
if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $name = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';
    $role = $body['role'] ?? 'student';

    $errors = [];
    if ($name === '') {
        $errors[] = 'Nome é obrigatório';
    }
    if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Email inválido';
    }
    if (strlen($password) < 6) {
        $errors[] = 'A senha precisa ter pelo menos 6 caracteres';
    }
    if (! in_array($role, ['student', 'admin'], true)) {
        $errors[] = 'Papel inválido (student ou admin)';
    }

    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        $errors[] = 'Este email já está em uso';
    }

    if (! empty($errors)) {
        json_out(['errors' => $errors], 422);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $pdo->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
        ->execute([$name, $email, $hash, $role]);
    $id = (int) $pdo->lastInsertId();

    $stmt = $pdo->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
    $stmt->execute([$id]);
    json_out(['success' => true, 'user' => $stmt->fetch()], 201);
    exit;
}

// PUT ?id=5 — edita role ou nome
if ($method === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    $body = json_decode(file_get_contents('php://input'), true);
    $role = $body['role'] ?? null;
    $name = $body['name'] ?? null;

    if ($role !== null && ! in_array($role, ['student', 'admin'], true)) {
        json_out(['error' => 'Papel inválido (student ou admin)'], 422);
        exit;
    }

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
    // Um admin não pode excluir a própria conta por aqui (evita se trancar pra fora).
    if ($id === (int) $_SESSION['user_id']) {
        json_out(['error' => 'Você não pode excluir a própria conta'], 422);
        exit;
    }
    $pdo->prepare('DELETE FROM users WHERE id = ?')->execute([$id]);
    json_out(null, 204);
    exit;
}

json_out(['error' => 'Método não permitido'], 405);
