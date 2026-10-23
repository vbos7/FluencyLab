<?php

/**
 * progress.php — regras únicas de nível e sequência (streak).
 *
 * Antes cada endpoint tinha a própria cópia (ranking, painel, prática, dashboard)
 * e a sequência era calculada de dois jeitos diferentes. O front (ranking.ts
 * getLevel) segue a mesma fórmula de nível.
 */

// Nível triangular: o nível N exige N×150 de XP ACUMULADO (subtrai a cada volta).
function nivel_do_xp(int $xp): int
{
    $nivel    = 1;
    $restante = $xp;
    while ($restante >= $nivel * 150) {
        $restante -= $nivel * 150;
        $nivel++;
    }

    return $nivel;
}

/**
 * Sequência = dias consecutivos com prática (qualquer tentativa), terminando hoje
 * — ou ontem, se hoje ainda não praticou. É o número que o aluno vê e o que
 * libera o bônus de XP. Lê só os últimos 400 dias (uma sequência maior que isso
 * é contada até o limite).
 */
function streak_do_usuario(PDO $pdo, int $userId): int
{
    $stmt = $pdo->prepare(
        'SELECT DISTINCT DATE(created_at) AS dia
         FROM attempts
         WHERE user_id = ? AND created_at >= CURDATE() - INTERVAL 400 DAY'
    );
    $stmt->execute([$userId]);
    $ativos = array_flip(array_column($stmt->fetchAll(), 'dia'));

    $cursor = new DateTime('today');

    if (!isset($ativos[$cursor->format('Y-m-d')])) {
        $cursor->modify('-1 day');
    }

    $streak = 0;
    while (isset($ativos[$cursor->format('Y-m-d')])) {
        $streak++;
        $cursor->modify('-1 day');
    }

    return $streak;
}

// XP total do aluno — fonte única: ranking_points (só acertos creditam).
function xp_total_do_usuario(PDO $pdo, int $userId): int
{
    $stmt = $pdo->prepare('SELECT COALESCE(SUM(points), 0) FROM ranking_points WHERE user_id = ?');
    $stmt->execute([$userId]);

    return (int) $stmt->fetchColumn();
}
