<?php

require_once __DIR__.'/cors.php';
require_once __DIR__.'/db.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if (empty($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // ─── GET: busca a anotação da aula ──────────────────────────
    // GET /api/notas.php?lesson_id=5
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (empty($_GET['lesson_id'])) {
            json_out(['error' => 'lesson_id é obrigatório'], 400);
            exit;
        }

        $stmt = $pdo->prepare(
            'SELECT content, updated_at FROM lesson_notes WHERE user_id = ? AND lesson_id = ?'
        );
        $stmt->execute([$userId, $_GET['lesson_id']]);
        $nota = $stmt->fetch();

        // Se ainda não existe nota, devolve vazio (não é erro, é estado normal)
        json_out($nota ?: ['content' => '', 'updated_at' => null]);
        exit;
    }

    // ─── PUT: cria ou atualiza a anotação ───────────────────────
    // PUT /api/notas.php  Body: { lesson_id, content }
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input['lesson_id'])) {
            json_out(['error' => 'lesson_id é obrigatório'], 400);
            exit;
        }

        $content = trim($input['content'] ?? '');

        // ON DUPLICATE KEY UPDATE: se já existe (mesmo user_id + lesson_id), atualiza em vez de duplicar
        $stmt = $pdo->prepare(
            'INSERT INTO lesson_notes (user_id, lesson_id, content)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE content = VALUES(content)'
        );
        $stmt->execute([$userId, $input['lesson_id'], $content]);

        json_out(['success' => true]);
        exit;
    }

    json_out(['error' => 'Método não permitido'], 405);

} catch (PDOException $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Erro interno no servidor'], 500);
}
