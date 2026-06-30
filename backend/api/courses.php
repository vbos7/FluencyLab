<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    json_out(['error' => 'Método não permitido']);
    exit;
}

// Se veio ?slug=basico, devolve o curso com suas aulas
if (!empty($_GET['slug'])) {
    $slug = $_GET['slug'];

    $stmt = $pdo->prepare("SELECT * FROM courses WHERE slug = ?");
    $stmt->execute([$slug]);
    $course = $stmt->fetch();

    if (!$course) {
        http_response_code(404);
        json_out(['error' => 'Curso não encontrado']);
        exit;
    }

    // JOIN entre courses e lessons via course_id (FOREIGN KEY definida no schema)
    $stmt = $pdo->prepare(
        "SELECT id, title, duration, youtube_id, order_num
           FROM lessons
          WHERE course_id = ?
          ORDER BY order_num"
    );
    $stmt->execute([$course['id']]);
    $course['lessons'] = $stmt->fetchAll();

    json_out($course);
    exit;
}

// Sem parâmetros: devolve a lista de todos os cursos
$stmt = $pdo->query("SELECT * FROM courses ORDER BY order_num");
json_out($stmt->fetchAll());
