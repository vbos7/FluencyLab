<?php

/**
 * webhook.php — endpoint que a Stripe chama diretamente (sem cookies, sem
 * browser), então não passa por cors.php: não precisa de CORS nem de sessão
 * PHP, e ler php://input aqui tem que vir antes de qualquer coisa que já
 * consuma o corpo da requisição.
 *
 * Rede de segurança para o pagamento ser confirmado mesmo se o usuário fechar
 * a aba antes do redirect de volta pro front completar (nesse caso
 * confirm-session.php nunca é chamado). Configure a URL
 * https://SEU_DOMINIO/api/stripe/webhook.php no Dashboard da Stripe, evento
 * "checkout.session.completed".
 */

require_once __DIR__ . '/../env.php';

require_once __DIR__ . '/../db.php';

require_once __DIR__ . '/../lib/stripe.php';

$payload       = file_get_contents('php://input');
$sigHeader     = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';
$webhookSecret = env('STRIPE_WEBHOOK_SECRET');

// Sem o segredo não há como saber se o evento veio mesmo da Stripe: qualquer um
// poderia forjar um checkout.session.completed "pago" e ganhar o plano. Recusa
// com 500 (a Stripe tenta de novo depois que o segredo for configurado).
if ($webhookSecret === '') {
    error_log('[stripe/webhook] STRIPE_WEBHOOK_SECRET ausente — evento recusado');
    http_response_code(500);

    exit;
}

try {
    $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
} catch (\Exception $e) {
    http_response_code(400);

    exit;
}

if ($event->type === 'checkout.session.completed') {
    ativar_plano_da_sessao($pdo, $event->data->object);
}

http_response_code(200);
