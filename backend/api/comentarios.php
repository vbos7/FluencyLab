<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // GET /api/comentarios.php?lesson_id=1
        if (empty($_GET['lesson_id'])) {
            json_out(['error' => 'lesson_id é obrigatório'], 400);
            exit;
        }

        $stmt = $pdo->prepare(
            "SELECT c.id, c.content, c.parent_id, c.created_at,
                    u.id AS user_id, u.name AS user_name
             FROM comments c
             JOIN users u ON u.id = c.user_id
             WHERE c.lesson_id = ? AND c.is_approved = 1
             ORDER BY c.created_at ASC"
        );
        $stmt->execute([$_GET['lesson_id']]);
        json_out($stmt->fetchAll());
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // POST /api/comentarios.php  Body: { lesson_id, user_id, content, parent_id? }
        $input = json_decode(file_get_contents("php://input"), true);

        if (empty($input['lesson_id']) || empty($input['user_id']) || empty($input['content'])) {
            json_out(['error' => 'lesson_id, user_id e content são obrigatórios'], 400);
            exit;
        }

        $stmt = $pdo->prepare(
            "INSERT INTO comments (lesson_id, user_id, parent_id, content)
             VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([
            $input['lesson_id'],
            $input['user_id'],
            $input['parent_id'] ?? null,
            trim($input['content'])
        ]);

        json_out(['success' => true, 'id' => $pdo->lastInsertId()], 201);
        exit;
    }

    json_out(['error' => 'Método não permitido'], 405);

} catch (PDOException $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Erro interno no servidor'], 500);
}

?>