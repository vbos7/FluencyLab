<?php

/**
 * confirm-session.php — chamado pelo front na volta do checkout (?session_id=...)
 * para confirmar o pagamento e mostrar o modal de agradecimento sem depender só
 * do webhook (que pode demorar alguns segundos, ou nem chegar em dev local).
 */

require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../lib/stripe.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}
if (! isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);
    exit;
}

$sessionId = $_GET['session_id'] ?? '';
if (! $sessionId) {
    json_out(['error' => 'session_id obrigatório'], 422);
    exit;
}

try {
    $session = stripe_client()->checkout->sessions->retrieve($sessionId);
} catch (\Stripe\Exception\ApiErrorException $e) {
    json_out(['error' => 'Sessão de checkout não encontrada'], 404);
    exit;
}

// Impede que um usuário confirme (e ganhe o plano de) uma sessão que não é dele.
if ((int) ($session->metadata['user_id'] ?? 0) !== (int) $_SESSION['user_id']) {
    json_out(['error' => 'Sessão não pertence a este usuário'], 403);
    exit;
}

$plano = ativar_plano_da_sessao($pdo, $session);

if (! $plano) {
    json_out(['success' => false, 'error' => 'Pagamento ainda não confirmado'], 202);
    exit;
}

json_out(['success' => true, 'plan' => $plano['name']]);
