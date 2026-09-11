<?php

require_once __DIR__.'/guard.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

// Valida os campos de uma aula. Devolve lista de erros (vazia = ok).
function validarAula(array $body): array
{
    $errors = [];
    if (trim($body['title'] ?? '') === '') {
        $errors[] = 'O título é obrigatório';
    }
    if ((int) ($body['course_id'] ?? 0) <= 0) {
        $errors[] = 'Curso inválido';
    }
    if ((int) ($body['duration'] ?? 0) < 0) {
        $errors[] = 'Duração inválida';
    }

    return $errors;
}

// GET ?course_id=5 — lista as aulas de um curso (em ordem)
if ($method === 'GET') {
    $courseId = (int) ($_GET['course_id'] ?? 0);
    if (! $courseId) {
        json_out(['error' => 'course_id obrigatório'], 422);
        exit;
    }

    $stmt = $pdo->prepare(
        'SELECT id, course_id, title, duration, youtube_id, is_free, order_num
         FROM lessons WHERE course_id = ? ORDER BY order_num, id'
    );
    $stmt->execute([$courseId]);

    json_out(array_map(fn ($l) => [
        'id' => (int) $l['id'],
        'course_id' => (int) $l['course_id'],
        'title' => $l['title'],
        'duration' => (int) $l['duration'],
        'youtube_id' => $l['youtube_id'],
        'is_free' => (bool) $l['is_free'],
        'order_num' => (int) $l['order_num'],
    ], $stmt->fetchAll()));
    exit;
}

// POST — cria uma aula
if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $errors = validarAula($body);
    if ($errors) {
        json_out(['errors' => $errors], 422);
        exit;
    }

    try {
        $stmt = $pdo->prepare(
            'INSERT INTO lessons (course_id, title, duration, youtube_id, is_free, order_num)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            (int) $body['course_id'],
            trim($body['title']),
            (int) ($body['duration'] ?? 0),
            trim($body['youtube_id'] ?? '') ?: null,
            ! empty($body['is_free']) ? 1 : 0,
            (int) ($body['order_num'] ?? 0),
        ]);
    } catch (PDOException $e) {
        if ($e->errorInfo[1] === 1062) {
            json_out(['error' => 'Já existe uma aula nessa posição (ordem) neste curso'], 409);
            exit;
        }
        throw $e;
    }

    json_out(['success' => true, 'id' => (int) $pdo->lastInsertId()], 201);
    exit;
}

// PUT ?id=5 — edita uma aula
if ($method === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    if (! $id) {
        json_out(['error' => 'ID obrigatório'], 422);
        exit;
    }
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $errors = validarAula($body);
    if ($errors) {
        json_out(['errors' => $errors], 422);
        exit;
    }

    try {
        $stmt = $pdo->prepare(
            'UPDATE lessons SET title = ?, duration = ?, youtube_id = ?, is_free = ?, order_num = ?
             WHERE id = ?'
        );
        $stmt->execute([
            trim($body['title']),
            (int) ($body['duration'] ?? 0),
            trim($body['youtube_id'] ?? '') ?: null,
            ! empty($body['is_free']) ? 1 : 0,
            (int) ($body['order_num'] ?? 0),
            $id,
        ]);
    } catch (PDOException $e) {
        if ($e->errorInfo[1] === 1062) {
            json_out(['error' => 'Já existe uma aula nessa posição (ordem) neste curso'], 409);
            exit;
        }
        throw $e;
    }

    json_out(['success' => true]);
    exit;
}

// DELETE ?id=5 — apaga uma aula
if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if (! $id) {
        json_out(['error' => 'ID obrigatório'], 422);
        exit;
    }
    $pdo->prepare('DELETE FROM lessons WHERE id = ?')->execute([$id]);
    json_out(null, 204);
    exit;
}

json_out(['error' => 'Método não permitido'], 405);
