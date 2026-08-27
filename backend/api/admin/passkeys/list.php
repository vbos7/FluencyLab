<?php

/**
 * GET /api/admin/passkeys/list.php
 *
 * Lista os passkeys do admin logado (para a tela de perfil mostrar/gerenciar).
 * Nunca devolve a chave pública nem o id binário cru — só metadados.
 */

require_once __DIR__.'/../guard.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$stmt = $pdo->prepare(
    'SELECT id, name, created_at, last_used_at
     FROM webauthn_credentials WHERE user_id = ? ORDER BY created_at DESC'
);
$stmt->execute([(int) $_SESSION['user_id']]);

json_out(['passkeys' => $stmt->fetchAll()]);
