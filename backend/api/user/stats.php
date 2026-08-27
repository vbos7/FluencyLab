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
        COUNT(*) AS totalPracticed,
        SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) AS totalCorrect,
        COALESCE(SUM(xp_earned), 0) AS userXp,
        COALESCE(SUM(time_spent_seconds), 0) AS totalSeconds
    FROM attempts WHERE user_id = ?
');
$stmt->execute([$_SESSION['user_id']]);
$row = $stmt->fetch();

json_out([
    'totalPracticed' => (int) $row['totalPracticed'],
    'totalCorrect' => (int) $row['totalCorrect'],
    'userXp' => (int) $row['userXp'],
    'totalSeconds' => (int) $row['totalSeconds'],
]);
