<?php

require_once __DIR__.'/guard.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}
requireAdmin();

// Total de usuários cadastrados por mês (YYYY-MM).
$porMes = [];
foreach ($pdo->query("SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym, COUNT(*) AS total FROM users GROUP BY ym")->fetchAll() as $r) {
    $porMes[$r['ym']] = (int) $r['total'];
}

$meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Janela dos últimos 12 meses, terminando no mês atual.
$inicio = new DateTime('first day of this month');
$inicio->modify('-11 months');

// Base do gráfico: tudo que foi cadastrado ANTES da janela já conta como acumulado.
$acumulado = 0;
foreach ($porMes as $ym => $total) {
    if ($ym < $inicio->format('Y-m')) {
        $acumulado += $total;
    }
}

// Percorre os 12 meses acumulando o total de usuários até cada mês.
$saida = [];
$cursor = clone $inicio;
for ($i = 0; $i < 12; $i++) {
    $acumulado += $porMes[$cursor->format('Y-m')] ?? 0;
    $saida[] = ['month' => $meses[(int) $cursor->format('n') - 1], 'users' => $acumulado];
    $cursor->modify('+1 month');
}

json_out($saida);
