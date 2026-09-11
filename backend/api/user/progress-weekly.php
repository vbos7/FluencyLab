<?php

require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../lib/premium.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}
if (! isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);
    exit;
}

$detailed = isset($_GET['detailed']);
if ($detailed) {
    requirePro($pdo);
}

$stmt = $pdo->prepare('
    SELECT
        YEARWEEK(created_at, 3)     AS ano_semana,
        COALESCE(SUM(xp_earned), 0) AS xp,
        COUNT(*)                    AS treinos,
        SUM(is_correct) AS acertos,
        SUM(time_spent_seconds) AS segundos
    FROM attempts
    WHERE user_id = ?
      AND created_at >= DATE_SUB(NOW(), INTERVAL 12 WEEK)
    GROUP BY YEARWEEK(created_at, 3)
    ORDER BY ano_semana
');
$stmt->execute([$_SESSION['user_id']]);
$rows = $stmt->fetchAll();

// Garante que sempre devolve 12 semanas (mesmo sem dados)
$semanas = [];
for ($i = 11; $i >= 0; $i--) {
    $semanas[date('oW', strtotime("-{$i} weeks"))] = [
        'week' => 'Sem '.(12 - $i), 'xp' => 0, 'treinos' => 0,
        ...($detailed ? ['inicio' => date('Y-m-d', strtotime("monday this week -{$i} weeks")), 'acertos' => 0, 'segundos' => 0] : []),
    ];
}
foreach ($rows as $row) {
    if (isset($semanas[$row['ano_semana']])) {
        $semanas[$row['ano_semana']]['xp'] = (int) $row['xp'];
        $semanas[$row['ano_semana']]['treinos'] = (int) $row['treinos'];
        if ($detailed) {
            $semanas[$row['ano_semana']]['acertos'] = (int) $row['acertos'];
            $semanas[$row['ano_semana']]['segundos'] = (int) $row['segundos'];
        }
    }
}
json_out(array_values($semanas));
