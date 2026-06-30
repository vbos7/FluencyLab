<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    json_out(['error' => 'Método não permitido']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    json_out(['error' => 'Não autenticado']);
    exit;
}

// Agrupa tentativas por dia no último ano e calcula o "nível" de atividade
$stmt = $pdo->prepare(
    "SELECT
        DATE(created_at)  AS date,
        COUNT(*)          AS total
     FROM attempts
     WHERE user_id = ?
       AND created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
     GROUP BY DATE(created_at)"
);
$stmt->execute([$_SESSION['user_id']]);

$resultado = array_map(function ($row) {
    $count = (int) $row['total'];
    $level = match (true) {
        $count >= 6 => 3,
        $count >= 3 => 2,
        $count >= 1 => 1,
        default     => 0,
    };
    return ['date' => $row['date'], 'level' => $level];
}, $stmt->fetchAll());

json_out($resultado);
