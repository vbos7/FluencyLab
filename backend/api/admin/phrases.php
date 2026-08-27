<?php

require_once __DIR__.'/guard.php';

requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

// GET — lista as frases com o total de vezes praticadas e o nome da categoria
if ($method === 'GET') {
    $stmt = $pdo->query('
        SELECT p.id, p.pt, p.en, p.difficulty, p.category_id,
               c.name AS category, COUNT(a.id) AS total_attempts
        FROM phrases p
        JOIN categories c ON c.id = p.category_id
        LEFT JOIN attempts a ON a.phrase_id = p.id
        GROUP BY p.id
        ORDER BY total_attempts DESC
    ');
    json_out($stmt->fetchAll());
    exit;
}

// POST — cria uma frase
if ($method === 'POST') {
    [$pt, $en, $difficulty, $categoryId, $errors] = validarFrase($pdo, json_decode(file_get_contents('php://input'), true));
    if (! empty($errors)) {
        json_out(['errors' => $errors], 422);
        exit;
    }

    $pdo->prepare('INSERT INTO phrases (pt, en, difficulty, category_id) VALUES (?, ?, ?, ?)')
        ->execute([$pt, $en, $difficulty, $categoryId]);
    $id = (int) $pdo->lastInsertId();

    json_out(['success' => true, 'phrase' => buscarFrase($pdo, $id)], 201);
    exit;
}

// PUT ?id=5 — edita uma frase
if ($method === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    if (! $id) {
        json_out(['error' => 'ID obrigatório'], 422);
        exit;
    }

    [$pt, $en, $difficulty, $categoryId, $errors] = validarFrase($pdo, json_decode(file_get_contents('php://input'), true));
    if (! empty($errors)) {
        json_out(['errors' => $errors], 422);
        exit;
    }

    $pdo->prepare('UPDATE phrases SET pt = ?, en = ?, difficulty = ?, category_id = ? WHERE id = ?')
        ->execute([$pt, $en, $difficulty, $categoryId, $id]);

    json_out(['success' => true, 'phrase' => buscarFrase($pdo, $id)]);
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

// Valida e normaliza o corpo de uma frase. Retorna [pt, en, difficulty, category_id, errors].
function validarFrase(PDO $pdo, ?array $body): array
{
    $pt = trim($body['pt'] ?? '');
    $en = trim($body['en'] ?? '');
    $difficulty = $body['difficulty'] ?? '';
    $categoryId = (int) ($body['category_id'] ?? 0);

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
    if (! $categoryId) {
        $errors[] = 'Categoria é obrigatória';
    } else {
        $stmt = $pdo->prepare('SELECT id FROM categories WHERE id = ?');
        $stmt->execute([$categoryId]);
        if (! $stmt->fetch()) {
            $errors[] = 'Categoria inválida';
        }
    }

    return [$pt, $en, $difficulty, $categoryId, $errors];
}

// Busca uma frase já com o nome da categoria (mesmo formato do GET da lista).
function buscarFrase(PDO $pdo, int $id): array
{
    $stmt = $pdo->prepare('
        SELECT p.id, p.pt, p.en, p.difficulty, p.category_id, c.name AS category
        FROM phrases p
        JOIN categories c ON c.id = p.category_id
        WHERE p.id = ?
    ');
    $stmt->execute([$id]);

    return $stmt->fetch() ?: [];
}
