<?php

/**
 * stripe.php — helpers da integração com a Stripe (Checkout hospedado).
 *
 * Fluxo: create-checkout-session.php cria a sessão e redireciona o usuário pro
 * checkout da própria Stripe; ao voltar, confirm-session.php confirma o
 * pagamento na hora (UX imediata) e webhook.php confirma de novo de forma
 * assíncrona (rede de segurança caso o usuário feche a aba antes do redirect
 * completar). Os dois caminhos chamam ativar_plano_da_sessao(), que é
 * idempotente via UNIQUE em user_plan.stripe_session_id.
 */

require_once __DIR__.'/../../vendor/autoload.php';
require_once __DIR__.'/../env.php';

function stripe_client(): \Stripe\StripeClient
{
    return new \Stripe\StripeClient(env('STRIPE_SECRET_KEY'));
}

/**
 * Ativa o plano de um usuário a partir de uma Checkout Session paga.
 * Idempotente: se a sessão já foi processada (webhook + confirmação síncrona
 * chegando em paralelo, ou o usuário atualizando a página de retorno), a
 * segunda chamada só devolve o plano já ativado, sem duplicar.
 *
 * @return array{name: string}|null null quando a sessão não está paga.
 */
function ativar_plano_da_sessao(PDO $pdo, \Stripe\Checkout\Session $session): ?array
{
    if ($session->payment_status !== 'paid') {
        return null;
    }

    $userId = (int) ($session->metadata['user_id'] ?? 0);
    $planId = (int) ($session->metadata['plan_id'] ?? 0);

    if (! $userId || ! $planId) {
        return null;
    }

    $stmt = $pdo->prepare('SELECT * FROM plans WHERE id = ?');
    $stmt->execute([$planId]);
    $plan = $stmt->fetch();

    if (! $plan) {
        return null;
    }

    // Já processada (webhook e confirmação síncrona correndo em paralelo, ou
    // usuário dando F5 na página de retorno) — devolve sem inserir de novo.
    $stmt = $pdo->prepare('SELECT id FROM user_plan WHERE stripe_session_id = ?');
    $stmt->execute([$session->id]);
    if ($stmt->fetch()) {
        return ['name' => $plan['name']];
    }

    $expiresAt = ($plan['billing_period'] === 'lifetime')
        ? null
        : date('Y-m-d H:i:s', strtotime('+1 month'));

    try {
        $pdo->prepare(
            'INSERT INTO user_plan (user_id, plan_id, expires_at, stripe_session_id) VALUES (?, ?, ?, ?)'
        )->execute([$userId, $planId, $expiresAt, $session->id]);
    } catch (PDOException $e) {
        // 23000 = violação de UNIQUE: outra requisição já inseriu essa sessão
        // entre o SELECT acima e este INSERT. Corrida inofensiva — segue normal.
        if ($e->errorInfo[1] !== 1062) {
            throw $e;
        }
    }

    return ['name' => $plan['name']];
}
