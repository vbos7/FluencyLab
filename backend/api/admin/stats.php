<?php

require_once __DIR__.'/guard.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}
requireAdmin();

json_out([
    'totalUsers' => (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn(),
    'totalPhrases' => (int) $pdo->query('SELECT COUNT(*) FROM phrases')->fetchColumn(),
    'activeToday' => (int) $pdo->query('SELECT COUNT(DISTINCT user_id) FROM attempts WHERE DATE(created_at) = CURDATE()')->fetchColumn(),
    'totalXP' => (int) $pdo->query('SELECT COALESCE(SUM(xp_earned), 0) FROM attempts')->fetchColumn(),
]);
