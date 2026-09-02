<?php

require_once __DIR__.'/cors.php';
require_once __DIR__.'/db.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

// Verifica se o usuário logado tem plano premium ativo (e não expirado)
function usuarioTemPremium(PDO $pdo): bool
{
    if (empty($_SESSION['user_id'])) {
        return false; // nem logado, então não é premium
    }

    $stmt = $pdo->prepare(
        "SELECT up.id
         FROM user_plan up
         JOIN plans p ON p.id = up.plan_id
         WHERE up.user_id = ?
           AND up.status = 'active'
           AND p.name = 'Pro'
           AND (up.expires_at IS NULL OR up.expires_at > NOW())
         LIMIT 1"
    );

    $stmt->execute([$_SESSION['user_id']]);

    return (bool) $stmt->fetch();
}

try {
    if (empty($_GET['slug'])) {
        $stmt = $pdo->query(
            'SELECT c.id, c.slug, c.title, c.description, c.level, c.order_num,
                COUNT(l.id) AS total_lessons
         FROM courses c
         LEFT JOIN lessons l ON l.course_id = c.id
         GROUP BY c.id
         ORDER BY c.order_num'
        );
        json_out($stmt->fetchAll());
        exit;
    }

    $slug = $_GET['slug'];

    $stmt = $pdo->prepare(
        'SELECT id, slug, title, description, level, order_num
         FROM courses WHERE slug = ?'
    );
    $stmt->execute([$slug]);
    $course = $stmt->fetch();

    if (! $course) {
        json_out(['error' => 'Curso não encontrado'], 404);
        exit;
    }

    $stmt = $pdo->prepare(
        'SELECT id, title, duration, youtube_id, order_num, is_free
         FROM lessons WHERE course_id = ? ORDER BY order_num'
    );
    $stmt->execute([$course['id']]);
    $lessons = $stmt->fetchAll();

    $temPremium = usuarioTemPremium($pdo);

    // Remove o youtube_id de aulas bloqueadas, pra ninguém "roubar" o vídeo pelo Network
    foreach ($lessons as &$lesson) {
        $lesson['is_free'] = (bool) $lesson['is_free'];
        $lesson['locked'] = ! $lesson['is_free'] && ! $temPremium;

        if ($lesson['locked']) {
            $lesson['youtube_id'] = null; // esconde o vídeo de quem não tem acesso
        }
    }
    unset($lesson);

    $course['lessons'] = $lessons;
    $course['total_lessons'] = count($lessons);
    $course['total_duration'] = array_sum(array_column($lessons, 'duration'));
    $course['user_has_premium'] = $temPremium;

    json_out($course);
    exit;

} catch (PDOException $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Erro interno no servidor'], 500);
    exit;
}
