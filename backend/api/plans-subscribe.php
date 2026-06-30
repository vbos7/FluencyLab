<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    json_out(['error' => 'Método não permitido']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    json_out(['error' => 'Não autenticado']);
    exit;
}

$body   = json_decode(file_get_contents('php://input'), true);
$planId = (int) ($body['plan_id'] ?? 0);

if (!$planId) {
    http_response_code(422);
    json_out(['errors' => ['plan_id é obrigatório']]);
    exit;
}

// Verifica se o plano existe
$stmt = $pdo->prepare("SELECT * FROM plans WHERE id = ?");
$stmt->execute([$planId]);
$plan = $stmt->fetch();

if (!$plan) {
    http_response_code(404);
    json_out(['error' => 'Plano não encontrado']);
    exit;
}

$expiresAt = null;
if ($plan['billing_period'] === 'monthly') {
    $expiresAt = date('Y-m-d H:i:s', strtotime('+1 month'));
}

$stmt = $pdo->prepare(
    "INSERT INTO user_plan (user_id, plan_id, expires_at, status)
     VALUES (?, ?, ?, 'active')"
);
$stmt->execute([$_SESSION['user_id'], $planId, $expiresAt]);

http_response_code(201);
json_out(['success' => true, 'plan' => $plan['name']]);
