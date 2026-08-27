<?php

require_once __DIR__.'/cors.php';
require_once __DIR__.'/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}
if (! isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$planId = (int) ($body['plan_id'] ?? 0);

if (! $planId) {
    json_out(['errors' => ['plan_id obrigatório']], 422);
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM plans WHERE id = ?');
$stmt->execute([$planId]);
$plan = $stmt->fetch();

if (! $plan) {
    json_out(['error' => 'Plano não encontrado'], 404);
    exit;
}

// Data de expiração: null = vitalício, senão daqui 1 mês
$expiresAt = ($plan['billing_period'] === 'lifetime')
    ? null
    : date('Y-m-d H:i:s', strtotime('+1 month'));

$pdo->prepare(
    'INSERT INTO user_plan (user_id, plan_id, expires_at) VALUES (?, ?, ?)'
)->execute([$_SESSION['user_id'], $planId, $expiresAt]);

json_out(['success' => true, 'plan' => $plan['name']], 201);
