<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';

if (empty($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // Treinos + taxa de acerto + tempo total
    $stmt = $pdo->prepare(
        "SELECT
            COUNT(*) AS total_treinos,
            ROUND(SUM(is_correct) / COUNT(*) * 100) AS taxa_acerto,
            COALESCE(SUM(time_spent_seconds), 0) AS tempo_total_segundos
         FROM attempts
         WHERE user_id = ?"
    );
    $stmt->execute([$userId]);
    $stats = $stmt->fetch();

    // XP total — fonte única: ranking_points
    $stmt = $pdo->prepare("SELECT COALESCE(SUM(points), 0) AS xp_total FROM ranking_points WHERE user_id = ?");
    $stmt->execute([$userId]);
    $xp = $stmt->fetch();

    // Consistência: atividades por dia (usado no heatmap)
    $stmt = $pdo->prepare(
        "SELECT DATE(created_at) AS dia, COUNT(*) AS atividades
         FROM attempts
         WHERE user_id = ?
         GROUP BY DATE(created_at)
         ORDER BY dia"
    );
    $stmt->execute([$userId]);
    $consistencia = $stmt->fetchAll();

    // ── Semanal: treinos por semana (últimas 12) ──
    $stmt = $pdo->prepare(
        "SELECT YEARWEEK(created_at, 3) AS week_key, COUNT(*) AS treinos
         FROM attempts
         WHERE user_id = ? AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 WEEK)
         GROUP BY week_key"
    );
    $stmt->execute([$userId]);
    $treinosPorSemana = [];
    foreach ($stmt->fetchAll() as $row) {
        $treinosPorSemana[(int) $row['week_key']] = (int) $row['treinos'];
    }

    // ── Semanal: XP por semana (últimas 12) ──
    $stmt = $pdo->prepare(
        "SELECT YEARWEEK(earned_at, 3) AS week_key, SUM(points) AS xp
         FROM ranking_points
         WHERE user_id = ? AND earned_at >= DATE_SUB(CURDATE(), INTERVAL 12 WEEK)
         GROUP BY week_key"
    );
    $stmt->execute([$userId]);
    $xpPorSemana = [];
    foreach ($stmt->fetchAll() as $row) {
        $xpPorSemana[(int) $row['week_key']] = (int) $row['xp'];
    }

    // Monta as últimas 12 semanas em ordem, preenchendo com 0 onde não há dados
    $weekly = [];
    $monday = new DateTime('monday this week');
    for ($i = 11; $i >= 0; $i--) {
        $weekStart = (clone $monday)->modify("-{$i} week");
        $weekKey = (int) $weekStart->format('oW'); // ano ISO + semana ISO, bate com YEARWEEK(mode 3)
        $weekly[] = [
            'week' => $weekStart->format('d/m'),
            'treinos' => $treinosPorSemana[$weekKey] ?? 0,
            'xp' => $xpPorSemana[$weekKey] ?? 0,
        ];
    }

    json_out([
        'total_treinos' => (int) $stats['total_treinos'],
        'taxa_acerto' => (int) ($stats['taxa_acerto'] ?? 0),
        'tempo_total_segundos' => (int) $stats['tempo_total_segundos'],
        'xp_total' => (int) $xp['xp_total'],
        'consistencia' => $consistencia,
        'weekly' => $weekly,
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Erro interno no servidor'], 500);
}