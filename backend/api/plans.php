<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    json_out(['error' => 'Método não permitido']);
    exit;
}

$stmt = $pdo->query("SELECT * FROM plans ORDER BY price");
$plans = $stmt->fetchAll();

// features é uma coluna JSON — PHP decodifica automaticamente com PDO
// mas como string, então precisamos decodificar manualmente
foreach ($plans as &$plan) {
    $plan['features'] = json_decode($plan['features'] ?? '[]', true);
}

json_out($plans);
