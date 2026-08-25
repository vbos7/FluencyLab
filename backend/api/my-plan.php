<?php

require_once __DIR__.'/cors.php';
require_once __DIR__.'/db.php';

// Sem sessão => sem plano Pro (visitante/guest continua vendo o upsell).
if (! isset($_SESSION['user_id'])) {
    json_out(['active' => false, 'plan' => null]);
    exit;
}

// Considera apenas plano ATIVO e PAGO (price > 0 = Pro). O plano Free não conta,
// pois o modal de upsell é justamente para converter quem ainda está no Free.
$stmt = $pdo->prepare(
    'SELECT p.name, p.price, p.billing_period, up.status, up.expires_at
     FROM user_plan up
     JOIN plans p ON p.id = up.plan_id
     WHERE up.user_id = ?
       AND up.status = "active"
       AND p.price > 0
       AND (up.expires_at IS NULL OR up.expires_at > NOW())
     ORDER BY up.started_at DESC
     LIMIT 1'
);
$stmt->execute([$_SESSION['user_id']]);
$plan = $stmt->fetch();

json_out(['active' => (bool) $plan, 'plan' => $plan ?: null]);
