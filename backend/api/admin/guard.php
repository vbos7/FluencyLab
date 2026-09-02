<?php

// Boot compartilhado dos endpoints de admin.
// Os require ficam no escopo GLOBAL de propósito: assim $pdo (definido em db.php)
// continua disponível para o arquivo que incluir este guard. Se estivessem dentro
// da função, $pdo seria local e morreria ao retornar.
require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';

// Bloqueia quem não é admin. Cada endpoint faz seu próprio check de método,
// pois isso varia (stats/phrases são só GET; users é GET/PUT/DELETE).
//
// O papel é lido do BANCO (não de $_SESSION['role']) — mesma fonte de verdade que
// /auth/me.php, que a guarda do painel no front usa. Assim as duas guardas nunca
// discordam: promover/rebaixar um usuário passa a valer na hora, sem relogar, e
// uma sessão antiga (feita antes da conta virar admin) não fica presa num 403.
function requireAdmin(): void
{
    global $pdo;

    if (! isset($_SESSION['user_id'])) {
        json_out(['error' => 'Não autenticado'], 401);
        exit;
    }

    $stmt = $pdo->prepare('SELECT role FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $role = $stmt->fetchColumn();

    if ($role !== 'admin') {
        json_out(['error' => 'Acesso restrito a administradores'], 403);
        exit;
    }
}
