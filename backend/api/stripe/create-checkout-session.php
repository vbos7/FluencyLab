<?php

require_once __DIR__ . '/../cors.php';

require_once __DIR__ . '/../db.php';

require_once __DIR__ . '/../lib/stripe.php';

require_once __DIR__ . '/../lib/premium.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);

    exit;
}

if (!isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);

    exit;
}

$body   = json_decode(file_get_contents('php://input'), true);
$planId = (int) ($body['plan_id'] ?? 0);

if (!$planId) {
    json_out(['errors' => ['plan_id obrigatório']], 422);

    exit;
}

$stmt = $pdo->prepare('SELECT * FROM plans WHERE id = ?');
$stmt->execute([$planId]);
$plan = $stmt->fetch();

if (!$plan) {
    json_out(['error' => 'Plano não encontrado'], 404);

    exit;
}

if ((float) $plan['price'] <= 0) {
    json_out(['error' => 'Este plano é gratuito, não precisa de pagamento'], 422);

    exit;
}

// Só existe compra única (vitalícia). Assinatura mensal exigiria renovar o plano a
// cada invoice.paid, cancelar e oferecer o portal do cliente — nada disso existe.
if ($plan['billing_period'] !== 'lifetime') {
    json_out(['error' => 'Este plano ainda não pode ser assinado.'], 422);

    exit;
}

// Quem já tem plano pago ativo não paga de novo.
if (hasActivePro($pdo, (int) $_SESSION['user_id'])) {
    json_out(['error' => 'Você já tem o plano Pro ativo.'], 409);

    exit;
}

$stmt = $pdo->prepare('SELECT email FROM users WHERE id = ?');
$stmt->execute([$_SESSION['user_id']]);
$email = $stmt->fetchColumn();

// Origem do front (mesma variável usada no CORS) — é pra lá que a Stripe
// redireciona o usuário depois do pagamento.
$frontOrigin = rtrim(env('APP_ORIGIN', 'http://localhost:3000'), '/');

try {
    $session = stripe_client()->checkout->sessions->create([
        'mode'       => 'payment',
        'line_items' => [[
            'price_data' => [
                'currency'     => 'brl',
                'product_data' => ['name' => "Plano {$plan['name']} — FluencyLab"],
                'unit_amount'  => (int) round(((float) $plan['price']) * 100),
            ],
            'quantity' => 1,
        ]],
        'customer_email'      => $email ?: null,
        'client_reference_id' => (string) $_SESSION['user_id'],
        'metadata'            => [
            'user_id' => (string) $_SESSION['user_id'],
            'plan_id' => (string) $plan['id'],
        ],
        'success_url' => $frontOrigin . '/home?checkout=success&session_id={CHECKOUT_SESSION_ID}',
        'cancel_url'  => $frontOrigin . '/planos?checkout=cancel',
    ]);

    json_out(['url' => $session->url]);
} catch (\Stripe\Exception\ApiErrorException $e) {
    json_out(['error' => 'Não foi possível iniciar o checkout. Tente novamente.'], 502);
}
