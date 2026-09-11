<?php

require_once __DIR__.'/guard.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

const NIVEIS = ['basico', 'intermediario', 'avancado'];

// Valida os campos de um curso. Devolve lista de erros (vazia = ok).
function validarCurso(array $body): array
{
    $errors = [];
    if (trim($body['title'] ?? '') === '') {
        $errors[] = 'O título é obrigatório';
    }
    $slug = trim($body['slug'] ?? '');
    if ($slug === '') {
        $errors[] = 'O slug é obrigatório';
    } elseif (! preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) {
        $errors[] = 'O slug deve ter só letras minúsculas, números e hífens (ex.: "basico")';
    }
    if (! in_array($body['level'] ?? '', NIVEIS, true)) {
        $errors[] = 'Nível inválido';
    }

    return $errors;
}

// GET — lista os cursos com a quantidade de aulas em cada um
if ($method === 'GET') {
    $rows = $pdo->query('
        SELECT c.id, c.slug, c.title, c.description, c.level, c.order_num,
               COUNT(l.id) AS lesson_count
        FROM courses c
        LEFT JOIN lessons l ON l.course_id = c.id
        GROUP BY c.id, c.slug, c.title, c.description, c.level, c.order_num
        ORDER BY c.order_num, c.id
    ')->fetchAll();

    json_out(array_map(fn ($c) => [
        'id' => (int) $c['id'],
        'slug' => $c['slug'],
        'title' => $c['title'],
        'description' => $c['description'],
        'level' => $c['level'],
        'order_num' => (int) $c['order_num'],
        'lesson_count' => (int) $c['lesson_count'],
    ], $rows));
    exit;
}

// POST — cria um curso
if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $errors = validarCurso($body);
    if ($errors) {
        json_out(['errors' => $errors], 422);
        exit;
    }

    try {
        $stmt = $pdo->prepare(
            'INSERT INTO courses (slug, title, description, level, order_num) VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            trim($body['slug']),
            trim($body['title']),
            trim($body['description'] ?? '') ?: null,
            $body['level'],
            (int) ($body['order_num'] ?? 0),
        ]);
    } catch (PDOException $e) {
        if ($e->errorInfo[1] === 1062) {
            json_out(['error' => 'Já existe um curso com esse slug'], 409);
            exit;
        }
        throw $e;
    }

    json_out(['success' => true, 'id' => (int) $pdo->lastInsertId()], 201);
    exit;
}

// PUT ?id=5 — edita um curso
if ($method === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    if (! $id) {
        json_out(['error' => 'ID obrigatório'], 422);
        exit;
    }
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $errors = validarCurso($body);
    if ($errors) {
        json_out(['errors' => $errors], 422);
        exit;
    }

    try {
        $stmt = $pdo->prepare(
            'UPDATE courses SET slug = ?, title = ?, description = ?, level = ?, order_num = ? WHERE id = ?'
        );
        $stmt->execute([
            trim($body['slug']),
            trim($body['title']),
            trim($body['description'] ?? '') ?: null,
            $body['level'],
            (int) ($body['order_num'] ?? 0),
            $id,
        ]);
    } catch (PDOException $e) {
        if ($e->errorInfo[1] === 1062) {
            json_out(['error' => 'Já existe um curso com esse slug'], 409);
            exit;
        }
        throw $e;
    }

    json_out(['success' => true]);
    exit;
}

// DELETE ?id=5 — apaga o curso (as aulas somem junto, via ON DELETE CASCADE)
if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if (! $id) {
        json_out(['error' => 'ID obrigatório'], 422);
        exit;
    }
    $pdo->prepare('DELETE FROM courses WHERE id = ?')->execute([$id]);
    json_out(null, 204);
    exit;
}

json_out(['error' => 'Método não permitido'], 405);
