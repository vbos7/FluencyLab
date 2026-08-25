<?php

require_once __DIR__.'/cors.php';
require_once __DIR__.'/db.php';

// Público — qualquer pessoa pode ver o ranking
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$stmt = $pdo->query('
    SELECT u.id, u.name, COALESCE(SUM(rp.points), 0) AS xp
    FROM users u
    LEFT JOIN ranking_points rp ON rp.user_id = u.id
    GROUP BY u.id, u.name
    ORDER BY xp DESC
    LIMIT 30
');

$lista = array_map(function ($user) {
    $xp = (int) $user['xp'];
    $nivel = 1;
    while ($xp >= $nivel * 150) {
        $nivel++;
    }   // nível N exige N×150 de XP

    return ['id' => $user['id'], 'name' => $user['name'], 'xp' => $xp, 'level' => $nivel];
}, $stmt->fetchAll());

json_out($lista);
