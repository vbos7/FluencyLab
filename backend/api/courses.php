<?php

require_once __DIR__ . '/cors.php';

require_once __DIR__ . '/db.php';

require_once __DIR__ . '/lib/premium.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);

    exit;
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

    if (!$course) {
        json_out(['error' => 'Curso não encontrado'], 404);

        exit;
    }

    $stmt = $pdo->prepare(
        'SELECT id, title, duration, youtube_id, order_num, is_free
         FROM lessons WHERE course_id = ? ORDER BY order_num'
    );
    $stmt->execute([$course['id']]);
    $lessons = $stmt->fetchAll();

    $temPremium = hasActivePro($pdo, isset($_SESSION['user_id']) ? (int) $_SESSION['user_id'] : null);

    // Remove o youtube_id de aulas bloqueadas, pra ninguém "roubar" o vídeo pelo Network
    foreach ($lessons as &$lesson) {
        $lesson['is_free'] = (bool) $lesson['is_free'];
        $lesson['locked']  = !$lesson['is_free'] && !$temPremium;

        if ($lesson['locked']) {
            $lesson['youtube_id'] = null; // esconde o vídeo de quem não tem acesso
        }
    }
    unset($lesson);

    $course['lessons']          = $lessons;
    $course['total_lessons']    = count($lessons);
    $course['total_duration']   = array_sum(array_column($lessons, 'duration'));
    $course['user_has_premium'] = $temPremium;

    json_out($course);

    exit;

} catch (PDOException $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Erro interno no servidor'], 500);

    exit;
}
