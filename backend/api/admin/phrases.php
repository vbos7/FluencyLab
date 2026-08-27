<?php

require_once __DIR__.'/guard.php';

requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

// GET — lista as frases com o total de vezes praticadas
if ($method === 'GET') {
    $stmt = $pdo->query('
        SELECT p.*, COUNT(a.id) AS total_attempts
        FROM phrases p
        LEFT JOIN attempts a ON a.phrase_id = p.id
        GROUP BY p.id
        ORDER BY total_attempts DESC
    ');
    json_out($stmt->fetchAll());
    exit;
}

// POST — cria uma frase
if ($method === 'POST') {
    [$pt, $en, $difficulty, $category, $errors] = validarFrase(json_decode(file_get_contents('php://input'), true));
    if (! empty($errors)) {
        json_out(['errors' => $errors], 422);
        exit;
    }

    $pdo->prepare('INSERT INTO phrases (pt, en, difficulty, category) VALUES (?, ?, ?, ?)')
        ->execute([$pt, $en, $difficulty, $category]);
    $id = (int) $pdo->lastInsertId();

    $stmt = $pdo->prepare('SELECT * FROM phrases WHERE id = ?');
    $stmt->execute([$id]);
    json_out(['success' => true, 'phrase' => $stmt->fetch()], 201);
    exit;
}

// PUT ?id=5 — edita uma frase
if ($method === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    if (! $id) {
        json_out(['error' => 'ID obrigatório'], 422);
        exit;
    }

    [$pt, $en, $difficulty, $category, $errors] = validarFrase(json_decode(file_get_contents('php://input'), true));
    if (! empty($errors)) {
        json_out(['errors' => $errors], 422);
        exit;
    }

    $pdo->prepare('UPDATE phrases SET pt = ?, en = ?, difficulty = ?, category = ? WHERE id = ?')
        ->execute([$pt, $en, $difficulty, $category, $id]);

    $stmt = $pdo->prepare('SELECT * FROM phrases WHERE id = ?');
    $stmt->execute([$id]);
    json_out(['success' => true, 'phrase' => $stmt->fetch()]);
    exit;
}

// DELETE ?id=5 (as tentativas ligadas somem junto por ON DELETE CASCADE)
if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if (! $id) {
        json_out(['error' => 'ID obrigatório'], 422);
        exit;
    }
    $pdo->prepare('DELETE FROM phrases WHERE id = ?')->execute([$id]);
    json_out(null, 204);
    exit;
}

json_out(['error' => 'Método não permitido'], 405);

// Valida e normaliza o corpo de uma frase. Retorna [pt, en, difficulty, category, errors].
function validarFrase(?array $body): array
{
    $pt = trim($body['pt'] ?? '');
    $en = trim($body['en'] ?? '');
    $difficulty = $body['difficulty'] ?? '';
    $category = trim($body['category'] ?? '');

    $errors = [];
    if ($pt === '') {
        $errors[] = 'Frase em português é obrigatória';
    }
    if ($en === '') {
        $errors[] = 'Tradução em inglês é obrigatória';
    }
    if (! in_array($difficulty, ['easy', 'medium', 'hard'], true)) {
        $errors[] = 'Dificuldade inválida (easy, medium ou hard)';
    }
    if ($category === '') {
        $errors[] = 'Categoria é obrigatória';
    }

    return [$pt, $en, $difficulty, $category, $errors];
}
