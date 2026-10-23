<?php

/**
 * POST /api/avatar-upload.php   (multipart, campo "avatar") — foto do aluno.
 * A regra (tipos, tamanho, reprocessamento) é a mesma do admin: lib/avatar.php.
 */

require_once __DIR__ . '/cors.php';

require_once __DIR__ . '/db.php';

require_once __DIR__ . '/lib/url.php';

require_once __DIR__ . '/lib/avatar.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if (empty($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);

    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);

    exit;
}

[$rel, $erro] = avatar_salvar($pdo, (int) $_SESSION['user_id'], $_FILES['avatar'] ?? null);

if ($erro !== null) {
    json_out(['error' => $erro], 422);

    exit;
}

json_out(['success' => true, 'avatar_url' => avatar_url($rel)]);
