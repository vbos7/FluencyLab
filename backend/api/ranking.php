<?php

require_once __DIR__.'/cors.php';
require_once __DIR__.'/db.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */

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
    ORDER BY xp DESC, u.id ASC
');

$currentUserId = isset($_SESSION['user_id']) ? (int) $_SESSION['user_id'] : null;

$lista = array_map(function ($user) use ($currentUserId) {
    $xp = (int) $user['xp'];
    $nivel = 1;
    while ($xp >= $nivel * 150) {
        $nivel++;
    }   // nível N exige N×150 de XP

    return [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'xp' => $xp,
        'level' => $nivel,
        'isCurrentUser' => $currentUserId === (int) $user['id'],
    ];
}, $stmt->fetchAll());

json_out($lista);
