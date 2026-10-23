<?php

require_once __DIR__ . '/../cors.php';

require_once __DIR__ . '/../db.php';

require_once __DIR__ . '/../lib/progress.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);

    exit;
}

if (!isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);

    exit;
}

$stmt = $pdo->prepare('
    SELECT
        COUNT(*) AS totalPracticed,
        SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) AS totalCorrect,
        COALESCE(SUM(time_spent_seconds), 0) AS totalSeconds
    FROM attempts WHERE user_id = ?
');
$stmt->execute([$_SESSION['user_id']]);
$row = $stmt->fetch();

json_out([
    'totalPracticed' => (int) $row['totalPracticed'],
    'totalCorrect'   => (int) $row['totalCorrect'],
    // Mesma fonte da Home e do ranking (ranking_points), não attempts.xp_earned.
    'userXp'         => xp_total_do_usuario($pdo, (int) $_SESSION['user_id']),
    'totalSeconds'   => (int) $row['totalSeconds'],
]);
