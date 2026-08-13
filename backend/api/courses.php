<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

try {
    // Listagem geral: GET /api/cursos.php
    if (empty($_GET['slug'])) {
        $stmt = $pdo->query(
            "SELECT id, slug, title, description, level, order_num
             FROM courses ORDER BY order_num"
        );
        json_out($stmt->fetchAll());
        exit;
    }

    // Detalhe por slug: GET /api/cursos.php?slug=basico
    $slug = $_GET['slug'];

    $stmt = $pdo->prepare(
        "SELECT id, slug, title, description, level, order_num
         FROM courses WHERE slug = ?"
    );
    $stmt->execute([$slug]);
    $course = $stmt->fetch();

    if (!$course) {
        json_out(['error' => 'Curso não encontrado'], 404);
        exit;
    }

    // Busca as aulas desse curso
    $stmt = $pdo->prepare(
        "SELECT id, title, duration, youtube_id, order_num
         FROM lessons WHERE course_id = ? ORDER BY order_num"
    );
    $stmt->execute([$course['id']]);
    $course['lessons'] = $stmt->fetchAll();

    // Campos calculados, já prontos pro front usar
    $course['total_lessons'] = count($course['lessons']);
    $course['total_duration'] = array_sum(array_column($course['lessons'], 'duration'));

    json_out($course);
    exit;

} catch (PDOException $e) {
    error_log($e->getMessage()); // erro real só no log do servidor
    json_out(['error' => 'Erro interno no servidor'], 500);
    exit;
}

?>