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

// COUNT(*) conta quantas linhas existem para esse usuário
$stmt = $pdo->prepare(
    "SELECT
        COUNT(*)                               AS totalPracticed,
        SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) AS totalCorrect,
        COALESCE(SUM(xp_earned), 0)            AS userXp
     FROM attempts
     WHERE user_id = ?"
);
$stmt->execute([$userId]);
$stats = $stmt->fetch();

echo json_encode([
    'totalPracticed' => (int) $stats['totalPracticed'],
    'totalCorrect'   => (int) $stats['totalCorrect'],
    'userXp'         => (int) $stats['userXp'],
]);
