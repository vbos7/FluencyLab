<?php

require_once __DIR__.'/guard.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}
requireAdmin();

// Sessões por dia = nº de tentativas registradas (últimos 14 dias).
$sessoes = [];
foreach ($pdo->query('SELECT DATE(created_at) AS dia, COUNT(*) AS total FROM attempts WHERE created_at >= CURDATE() - INTERVAL 13 DAY GROUP BY dia')->fetchAll() as $r) {
    $sessoes[$r['dia']] = (int) $r['total'];
}

// XP por dia (fonte única: ranking_points) — últimos 14 dias.
$xpDia = [];
foreach ($pdo->query('SELECT DATE(earned_at) AS dia, COALESCE(SUM(points), 0) AS xp FROM ranking_points WHERE earned_at >= CURDATE() - INTERVAL 13 DAY GROUP BY dia')->fetchAll() as $r) {
    $xpDia[$r['dia']] = (int) $r['xp'];
}

// Monta a série completa de 14 dias (preenche com 0 os dias sem dados).
$saida = [];
$cursor = new DateTime('13 days ago');
$cursor->setTime(0, 0, 0);
for ($i = 0; $i < 14; $i++) {
    $iso = $cursor->format('Y-m-d');
    $saida[] = [
        'day' => $cursor->format('d/m'),
        'sessions' => $sessoes[$iso] ?? 0,
        'xp' => $xpDia[$iso] ?? 0,
    ];
    $cursor->modify('+1 day');
}

json_out($saida);
