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

$userId = $_SESSION['user_id'];

// Agrupa as tentativas das últimas 12 semanas por semana (YEARWEEK)
$stmt = $pdo->prepare(
    "SELECT
        YEARWEEK(created_at, 1)     AS ano_semana,
        MIN(created_at)             AS inicio_semana,
        COALESCE(SUM(xp_earned), 0) AS xp,
        COUNT(*)                    AS treinos
     FROM attempts
     WHERE user_id = ?
       AND created_at >= DATE_SUB(NOW(), INTERVAL 12 WEEK)
     GROUP BY YEARWEEK(created_at, 1)
     ORDER BY ano_semana"
);
$stmt->execute([$userId]);
$rows = $stmt->fetchAll();

// Garante que sempre devolve 12 semanas (mesmo que sem dados)
$semanas = [];
for ($i = 11; $i >= 0; $i--) {
    $semanas[date('YW', strtotime("-{$i} weeks"))] = [
        'week'    => 'Sem ' . (12 - $i),
        'xp'      => 0,
        'treinos' => 0,
    ];
}

foreach ($rows as $row) {
    $key = $row['ano_semana'];
    if (isset($semanas[$key])) {
        $semanas[$key]['xp']      = (int) $row['xp'];
        $semanas[$key]['treinos'] = (int) $row['treinos'];
    }
}

json_out(array_values($semanas));
