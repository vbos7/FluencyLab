<?php

/**
 * DELETE /api/admin/passkeys/delete.php?id=123
 *
 * Remove um passkey do admin logado. O WHERE user_id garante que ninguém apague
 * a credencial de outra pessoa mexendo no id.
 */

require_once __DIR__.'/../guard.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$id = (int) ($_GET['id'] ?? 0);
if ($id <= 0) {
    json_out(['errors' => ['Passkey inválido.']], 422);
    exit;
}

$stmt = $pdo->prepare('DELETE FROM webauthn_credentials WHERE id = ? AND user_id = ?');
$stmt->execute([$id, (int) $_SESSION['user_id']]);

if ($stmt->rowCount() === 0) {
    json_out(['error' => 'Passkey não encontrado'], 404);
    exit;
}

json_out(['success' => true]);
