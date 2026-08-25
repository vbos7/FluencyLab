<?php

require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}
if (! isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);
    exit;
}

$stmt = $pdo->prepare('
    SELECT
        YEARWEEK(created_at, 1)     AS ano_semana,
        COALESCE(SUM(xp_earned), 0) AS xp,
        COUNT(*)                    AS treinos
    FROM attempts
    WHERE user_id = ?
      AND created_at >= DATE_SUB(NOW(), INTERVAL 12 WEEK)
    GROUP BY YEARWEEK(created_at, 1)
    ORDER BY ano_semana
');
$stmt->execute([$_SESSION['user_id']]);
$rows = $stmt->fetchAll();

// Garante que sempre devolve 12 semanas (mesmo sem dados)
$semanas = [];
for ($i = 11; $i >= 0; $i--) {
    $semanas[date('YW', strtotime("-{$i} weeks"))] = [
        'week' => 'Sem '.(12 - $i), 'xp' => 0, 'treinos' => 0,
    ];
}
foreach ($rows as $row) {
    if (isset($semanas[$row['ano_semana']])) {
        $semanas[$row['ano_semana']]['xp'] = (int) $row['xp'];
        $semanas[$row['ano_semana']]['treinos'] = (int) $row['treinos'];
    }
}
json_out(array_values($semanas));
