<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    json_out(['error' => 'Método não permitido']);
    exit;
}

// Público — qualquer um pode ver o ranking

// Soma os pontos de ranking por usuário, join com users para pegar nome
$stmt = $pdo->query(
    "SELECT
        u.id,
        u.name,
        COALESCE(SUM(rp.points), 0) AS xp
     FROM users u
     LEFT JOIN ranking_points rp ON rp.user_id = u.id
     GROUP BY u.id, u.name
     ORDER BY xp DESC
     LIMIT 30"
);

$lista = $stmt->fetchAll();

// Calcula nível: para subir ao nível N, precisa de N×150 de XP acumulado
$lista = array_map(function ($user) {
    $xp    = (int) $user['xp'];
    $nivel = 1;
    while ($xp >= $nivel * 150) {
        $nivel++;
    }
    return ['id' => $user['id'], 'name' => $user['name'], 'xp' => $xp, 'level' => $nivel];
}, $lista);

json_out($lista);
