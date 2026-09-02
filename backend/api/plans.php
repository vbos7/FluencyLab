<?php

require_once __DIR__.'/cors.php';
require_once __DIR__.'/db.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */

// Público — qualquer um vê os planos disponíveis antes de se cadastrar
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$plans = $pdo->query('SELECT * FROM plans ORDER BY price')->fetchAll();

// As features agora vivem na tabela plan_features (uma linha por feature). Monta,
// para cada plano, o array no mesmo formato que o front (Feature) já espera:
// { label, included: bool, highlight: bool }.
$featStmt = $pdo->prepare(
    'SELECT label, included, highlight FROM plan_features WHERE plan_id = ? ORDER BY order_num, id'
);
foreach ($plans as &$plan) {
    $featStmt->execute([$plan['id']]);
    $plan['features'] = array_map(fn ($f) => [
        'label' => $f['label'],
        'included' => (bool) $f['included'],
        'highlight' => (bool) $f['highlight'],
    ], $featStmt->fetchAll());
}
unset($plan);

json_out($plans);
