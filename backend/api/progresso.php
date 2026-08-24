<?php

require_once __DIR__.'/cors.php';
require_once __DIR__.'/db.php';

if (empty($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // ─── GET: progresso de um curso ────────────────────────────
    // GET /api/progresso.php?course_id=1
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (empty($_GET['course_id'])) {
            json_out(['error' => 'course_id é obrigatório'], 400);
            exit;
        }

        $stmt = $pdo->prepare(
            'SELECT lp.lesson_id
             FROM lesson_progress lp
             JOIN lessons l ON l.id = lp.lesson_id
             WHERE lp.user_id = ? AND l.course_id = ?'
        );
        $stmt->execute([$userId, $_GET['course_id']]);
        $concluidas = array_column($stmt->fetchAll(), 'lesson_id');

        $stmt2 = $pdo->prepare('SELECT COUNT(*) AS total FROM lessons WHERE course_id = ?');
        $stmt2->execute([$_GET['course_id']]);
        $total = (int) $stmt2->fetch()['total'];

        $percentual = $total > 0 ? round((count($concluidas) / $total) * 100) : 0;

        json_out([
            'completed_lesson_ids' => array_map('intval', $concluidas),
            'total_lessons' => $total,
            'completed_count' => count($concluidas),
            'percent' => $percentual,
        ]);
        exit;
    }

    // ─── POST: marca aula como concluída ───────────────────────
    // POST /api/progresso.php  Body: { lesson_id }
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['lesson_id'])) {
            json_out(['error' => 'lesson_id é obrigatório'], 400);
            exit;
        }

        $stmt = $pdo->prepare(
            'INSERT IGNORE INTO lesson_progress (user_id, lesson_id) VALUES (?, ?)'
        );
        $stmt->execute([$userId, $input['lesson_id']]);

        json_out(['success' => true, 'completed' => true]);
        exit;
    }

    // ─── DELETE: desmarca aula (toggle) ────────────────────────
    // DELETE /api/progresso.php?lesson_id=5
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        if (empty($_GET['lesson_id'])) {
            json_out(['error' => 'lesson_id é obrigatório'], 400);
            exit;
        }

        $stmt = $pdo->prepare(
            'DELETE FROM lesson_progress WHERE user_id = ? AND lesson_id = ?'
        );
        $stmt->execute([$userId, $_GET['lesson_id']]);

        json_out(['success' => true, 'completed' => false]);
        exit;
    }

    json_out(['error' => 'Método não permitido'], 405);

} catch (PDOException $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Erro interno no servidor'], 500);
}
