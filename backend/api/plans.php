<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

// Público — qualquer um vê os planos disponíveis antes de se cadastrar
if ($_SERVER['REQUEST_METHOD'] !== 'GET') { json_out(['error' => 'Método não permitido'], 405); exit; }

$stmt  = $pdo->query("SELECT * FROM plans ORDER BY price");
$plans = $stmt->fetchAll();

// A coluna features é JSON no banco — vem como string, precisa decodificar
foreach ($plans as &$plan) {
    $plan['features'] = json_decode($plan['features'] ?? '[]', true);
}

json_out($plans);