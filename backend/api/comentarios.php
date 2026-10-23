<?php

require_once __DIR__ . '/cors.php';

require_once __DIR__ . '/db.php';

require_once __DIR__ . '/lib/premium.php';

require_once __DIR__ . '/lib/login-throttle.php';

const COMENTARIO_MAX_CHARS   = 1000;
const COMENTARIOS_POR_JANELA = 10; // por usuário, na janela do throttle (15 min)

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // GET /api/comentarios.php?lesson_id=1
        if (empty($_GET['lesson_id'])) {
            json_out(['error' => 'lesson_id é obrigatório'], 400);

            exit;
        }

        $stmt = $pdo->prepare(
            'SELECT c.id, c.content, c.parent_id, c.created_at,
                    u.id AS user_id, u.name AS user_name
             FROM comments c
             JOIN users u ON u.id = c.user_id
             WHERE c.lesson_id = ? AND c.is_approved = 1
             ORDER BY c.created_at ASC'
        );
        $stmt->execute([(int) $_GET['lesson_id']]);
        json_out($stmt->fetchAll());

        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Precisa estar logado — user_id vem da sessão, não do body
        if (empty($_SESSION['user_id'])) {
            json_out(['error' => 'Você precisa estar logado para comentar'], 401);

            exit;
        }

        // POST /api/comentarios.php  Body: { lesson_id, content, parent_id? }
        $input = json_decode(file_get_contents('php://input'), true);

        $userId   = (int) $_SESSION['user_id'];
        $lessonId = (int) ($input['lesson_id'] ?? 0);
        $parentId = isset($input['parent_id']) ? (int) $input['parent_id'] : null;
        $conteudo = trim((string) ($input['content'] ?? ''));

        if (!$lessonId || $conteudo === '') {
            json_out(['errors' => ['lesson_id e content são obrigatórios']], 422);

            exit;
        }

        if (mb_strlen($conteudo) > COMENTARIO_MAX_CHARS) {
            json_out(['errors' => ['O comentário pode ter no máximo ' . COMENTARIO_MAX_CHARS . ' caracteres.']], 422);

            exit;
        }

        // A aula precisa existir e estar liberada para o aluno (gratuita ou Pro).
        $stmt = $pdo->prepare('SELECT is_free FROM lessons WHERE id = ?');
        $stmt->execute([$lessonId]);
        $aula = $stmt->fetch();

        if (!$aula) {
            json_out(['error' => 'Aula não encontrada'], 404);

            exit;
        }

        if (!$aula['is_free'] && !hasActivePro($pdo, $userId)) {
            json_out(['error' => 'Esta aula é exclusiva do plano Pro.'], 403);

            exit;
        }

        // Resposta só a um comentário da mesma aula.
        if ($parentId !== null) {
            $stmt = $pdo->prepare('SELECT 1 FROM comments WHERE id = ? AND lesson_id = ?');
            $stmt->execute([$parentId, $lessonId]);

            if (!$stmt->fetchColumn()) {
                json_out(['errors' => ['Comentário respondido não existe nesta aula.']], 422);

                exit;
            }
        }

        $chave = 'comentario:' . $userId;

        if (throttle_excedido($pdo, $chave, client_ip(), COMENTARIOS_POR_JANELA, PHP_INT_MAX, 'comentario:')) {
            json_out(['errors' => ['Muitos comentários em pouco tempo. Aguarde alguns minutos.']], 429);

            exit;
        }
        throttle_registrar($pdo, $chave, client_ip());

        $stmt = $pdo->prepare(
            'INSERT INTO comments (lesson_id, user_id, parent_id, content)
             VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([
            $lessonId,
            $userId, // vem da sessão, não do body
            $parentId,
            $conteudo,
        ]);

        json_out(['success' => true, 'id' => (int) $pdo->lastInsertId()], 201);

        exit;
    }

    json_out(['error' => 'Método não permitido'], 405);

} catch (PDOException $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Erro interno no servidor'], 500);
}
