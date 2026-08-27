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
    // XP total — mesma fonte única do dashboard do aluno: ranking_points
    'totalXP' => (int) $pdo->query('SELECT COALESCE(SUM(points), 0) FROM ranking_points')->fetchColumn(),
    // Novos usuários cadastrados no mês corrente
    'newThisMonth' => (int) $pdo->query('SELECT COUNT(*) FROM users WHERE YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())')->fetchColumn(),
    // Taxa média de acerto sobre todas as tentativas (0 se ainda não houver nenhuma)
    'avgCompletionRate' => (int) $pdo->query('SELECT COALESCE(ROUND(SUM(is_correct) / COUNT(*) * 100), 0) FROM attempts')->fetchColumn(),
]);
