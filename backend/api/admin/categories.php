<?php

require_once __DIR__.'/guard.php';

requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

// GET — lista as categorias com a quantidade de frases em cada uma
if ($method === 'GET') {
    $stmt = $pdo->query('
        SELECT c.id, c.name, COUNT(p.id) AS phrase_count
        FROM categories c
        LEFT JOIN phrases p ON p.category_id = c.id
        GROUP BY c.id
        ORDER BY c.name
    ');
    // COUNT vem como string do driver — normaliza para inteiro.
    $rows = array_map(fn ($c) => [
        'id' => (int) $c['id'],
        'name' => $c['name'],
        'phrase_count' => (int) $c['phrase_count'],
    ], $stmt->fetchAll());
    json_out($rows);
    exit;
}

// POST — cria uma categoria
if ($method === 'POST') {
    $name = validarNome(json_decode(file_get_contents('php://input'), true), $errors);
    if (! empty($errors)) {
        json_out(['errors' => $errors], 422);
        exit;
    }

    try {
        $pdo->prepare('INSERT INTO categories (name) VALUES (?)')->execute([$name]);
    } catch (PDOException $e) {
        // 1062 = violação de UNIQUE (nome duplicado)
        if (($e->errorInfo[1] ?? null) === 1062) {
            json_out(['error' => 'Já existe uma categoria com esse nome'], 409);
            exit;
        }
        throw $e;
    }
    $id = (int) $pdo->lastInsertId();

    json_out(['success' => true, 'category' => ['id' => $id, 'name' => $name, 'phrase_count' => 0]], 201);
    exit;
}

// PUT ?id=5 — renomeia uma categoria
if ($method === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    if (! $id) {
        json_out(['error' => 'ID obrigatório'], 422);
        exit;
    }

    $name = validarNome(json_decode(file_get_contents('php://input'), true), $errors);
    if (! empty($errors)) {
        json_out(['errors' => $errors], 422);
        exit;
    }

    try {
        $pdo->prepare('UPDATE categories SET name = ? WHERE id = ?')->execute([$name, $id]);
    } catch (PDOException $e) {
        if (($e->errorInfo[1] ?? null) === 1062) {
            json_out(['error' => 'Já existe uma categoria com esse nome'], 409);
            exit;
        }
        throw $e;
    }

    json_out(['success' => true, 'category' => ['id' => $id, 'name' => $name]]);
    exit;
}

// DELETE ?id=5 — só apaga se não houver frases vinculadas (categoria em uso)
if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if (! $id) {
        json_out(['error' => 'ID obrigatório'], 422);
        exit;
    }

    $stmt = $pdo->prepare('SELECT COUNT(*) FROM phrases WHERE category_id = ?');
    $stmt->execute([$id]);
    $count = (int) $stmt->fetchColumn();
    if ($count > 0) {
        $frase = $count === 1 ? '1 frase' : "$count frases";
        json_out(['error' => "Categoria em uso por $frase. Reatribua-as antes de excluir."], 409);
        exit;
    }

    $pdo->prepare('DELETE FROM categories WHERE id = ?')->execute([$id]);
    json_out(null, 204);
    exit;
}

json_out(['error' => 'Método não permitido'], 405);

// Valida o nome da categoria. Preenche $errors por referência e devolve o nome limpo.
function validarNome(?array $body, ?array &$errors): string
{
    $name = trim($body['name'] ?? '');
    $errors = [];
    if ($name === '') {
        $errors[] = 'Nome da categoria é obrigatório';
    } elseif (mb_strlen($name) > 50) {
        $errors[] = 'Nome da categoria deve ter no máximo 50 caracteres';
    }

    return $name;
}
