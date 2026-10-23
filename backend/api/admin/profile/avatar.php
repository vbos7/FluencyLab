<?php

/**
 * POST   /api/admin/profile/avatar.php   (multipart, campo "avatar")  → envia/atualiza
 * DELETE /api/admin/profile/avatar.php                                → remove
 *
 * Mesma regra do aluno (lib/avatar.php). Devolve sempre a URL ABSOLUTA, pois o
 * front está em outra origem.
 */

require_once __DIR__ . '/../guard.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
require_once __DIR__ . '/../../lib/url.php';

require_once __DIR__ . '/../../lib/avatar.php';

requireAdmin();

$userId = (int) $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'DELETE') {
    avatar_remover($pdo, $userId);
    json_out(['success' => true, 'avatar' => null]);

    exit;
}

if ($method !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);

    exit;
}

[$rel, $erro] = avatar_salvar($pdo, $userId, $_FILES['avatar'] ?? null);

if ($erro !== null) {
    json_out(['errors' => [$erro]], 422);

    exit;
}

json_out(['success' => true, 'avatar' => avatar_url($rel)]);
