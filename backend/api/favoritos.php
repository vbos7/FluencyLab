<?php

require_once __DIR__.'/cors.php';
require_once __DIR__.'/db.php';

if (empty($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->prepare(
            'SELECT p.id, p.pt, p.en, p.difficulty, c.name AS category
             FROM favorite_phrases f
             JOIN phrases p ON p.id = f.phrase_id
             JOIN categories c ON c.id = p.category_id
             WHERE f.user_id = ?
             ORDER BY f.created_at DESC'
        );
        $stmt->execute([$userId]);
        json_out($stmt->fetchAll());
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (! isset($input['phrase_id']) || ! ctype_digit((string) $input['phrase_id'])) {
            json_out(['error' => 'phrase_id é obrigatório e deve ser um número'], 400);
            exit;
        }
        $phraseId = (int) $input['phrase_id'];

        $existe = $pdo->prepare('SELECT 1 FROM phrases WHERE id = ?');
        $existe->execute([$phraseId]);
        if (! $existe->fetchColumn()) {
            json_out(['error' => 'Frase não encontrada'], 404);
            exit;
        }

        $stmt = $pdo->prepare(
            'INSERT IGNORE INTO favorite_phrases (user_id, phrase_id) VALUES (?, ?)'
        );
        $stmt->execute([$userId, $phraseId]);

        json_out(['success' => true, 'favorited' => true]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        if (! isset($_GET['phrase_id']) || ! ctype_digit((string) $_GET['phrase_id'])) {
            json_out(['error' => 'phrase_id é obrigatório e deve ser um número'], 400);
            exit;
        }

        $stmt = $pdo->prepare(
            'DELETE FROM favorite_phrases WHERE user_id = ? AND phrase_id = ?'
        );
        $stmt->execute([$userId, (int) $_GET['phrase_id']]);

        json_out(['success' => true, 'favorited' => false]);
        exit;
    }

    json_out(['error' => 'Método não permitido'], 405);

} catch (PDOException $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Erro interno no servidor'], 500);
}
