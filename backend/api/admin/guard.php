<?php

// Boot compartilhado dos endpoints de admin.
// Os require ficam no escopo GLOBAL de propósito: assim $pdo (definido em db.php)
// continua disponível para o arquivo que incluir este guard. Se estivessem dentro
// da função, $pdo seria local e morreria ao retornar.
require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';

// Bloqueia quem não é admin. Cada endpoint faz seu próprio check de método,
// pois isso varia (stats/phrases são só GET; users é GET/PUT/DELETE).
function requireAdmin(): void
{
    if (! isset($_SESSION['user_id']) || ($_SESSION['role'] ?? null) !== 'admin') {
        json_out(['error' => 'Acesso restrito a administradores'], 403);
        exit;
    }
}
