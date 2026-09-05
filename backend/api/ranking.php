<?php

require_once __DIR__.'/cors.php';
require_once __DIR__.'/db.php';
require_once __DIR__.'/lib/url.php';
require_once __DIR__.'/lib/settings.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

// Acesso → ranking_public: se desligado, o ranking geral fica só para admins.
// Alunos recebem lista vazia (o front mostra "ranking indisponível").
if (get_setting($pdo, 'ranking_public', '1') !== '1') {
    $ehAdmin = false;
    if (isset($_SESSION['user_id'])) {
        $st = $pdo->prepare('SELECT role FROM users WHERE id = ?');
        $st->execute([$_SESSION['user_id']]);
        $ehAdmin = $st->fetchColumn() === 'admin';
    }
    if (! $ehAdmin) {
        json_out([]);
        exit;
    }
}

// Mesma lógica de nível usada no front (ranking.ts: getLevel) — nível N exige N×150,
// subtraindo cumulativamente, não apenas comparando o bruto.
function calcularNivel(int $xp): int
{
    $nivel = 1;
    $restante = $xp;
    while ($restante >= $nivel * 150) {
        $restante -= $nivel * 150;
        $nivel++;
    }

    return $nivel;
}

$stmt = $pdo->query('
    SELECT u.id, u.name, u.avatar, COALESCE(SUM(rp.points), 0) AS xp
    FROM users u
    LEFT JOIN ranking_points rp ON rp.user_id = u.id
    GROUP BY u.id, u.name, u.avatar
    ORDER BY xp DESC, u.id ASC
');

$currentUserId = isset($_SESSION['user_id']) ? (int) $_SESSION['user_id'] : null;

$lista = array_map(function ($user) use ($currentUserId) {
    $xp = (int) $user['xp'];

    return [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'xp' => $xp,
        'level' => calcularNivel($xp),
        'avatar' => avatar_url($user['avatar']), // null se não tiver foto
        'isCurrentUser' => $currentUserId === (int) $user['id'],
    ];
}, $stmt->fetchAll());

json_out($lista);
