<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    json_out(['error' => 'Método não permitido']);
    exit;
}

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    json_out(['error' => 'Acesso restrito a administradores']);
    exit;
}

echo json_encode([
    'totalUsers'         => (int) $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn(),
    'totalPhrases'       => (int) $pdo->query("SELECT COUNT(*) FROM phrases")->fetchColumn(),
    'activeToday'        => (int) $pdo->query("SELECT COUNT(DISTINCT user_id) FROM attempts WHERE DATE(created_at) = CURDATE()")->fetchColumn(),
    'totalXP'            => (int) $pdo->query("SELECT COALESCE(SUM(xp_earned),0) FROM attempts")->fetchColumn(),
    'newThisMonth'       => (int) $pdo->query("SELECT COUNT(*) FROM users WHERE MONTH(created_at) = MONTH(NOW())")->fetchColumn(),
    'avgScore'           => round((float) $pdo->query("SELECT COALESCE(AVG(score),0) FROM attempts")->fetchColumn(), 1),
]);
