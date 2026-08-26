<?php

require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

// Verificar se está logado E se é admin
if (! isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    json_out(['error' => 'Acesso restrito a administradores'], 403);
    exit;
}

json_out([
    'totalUsers' => (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn(),
    'totalPhrases' => (int) $pdo->query('SELECT COUNT(*) FROM phrases')->fetchColumn(),
    'activeToday' => (int) $pdo->query('SELECT COUNT(DISTINCT user_id) FROM attempts WHERE DATE(created_at) = CURDATE()')->fetchColumn(),
    'totalXP' => (int) $pdo->query('SELECT COALESCE(SUM(xp_earned), 0) FROM attempts')->fetchColumn(),
]);
