<?php

require_once __DIR__.'/guard.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}
requireAdmin();

// ?limit=N (padrão 5, teto 50). Cast para int já protege contra SQL injection.
$limit = (int) ($_GET['limit'] ?? 5);
if ($limit < 1 || $limit > 50) {
    $limit = 5;
}

$rows = $pdo->query("
    SELECT u.id, u.name, u.email, COALESCE(SUM(rp.points), 0) AS xp
    FROM users u
    LEFT JOIN ranking_points rp ON rp.user_id = u.id
    GROUP BY u.id, u.name, u.email
    ORDER BY xp DESC
    LIMIT {$limit}
")->fetchAll();

// Mesma fórmula (triangular) do ranking do aluno: o nível N exige N×150 de XP
// ACUMULADO — por isso subtraímos a cada volta, igual ao ranking.php e ao front.
$saida = array_map(function ($u) {
    $xp = (int) $u['xp'];
    $nivel = 1;
    $restante = $xp;
    while ($restante >= $nivel * 150) {
        $restante -= $nivel * 150;
        $nivel++;
    }

    return ['id' => (int) $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'xp' => $xp, 'level' => $nivel];
}, $rows);

json_out($saida);
