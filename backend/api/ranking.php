<?php

/**
 * GET /api/ranking.php — ranking por XP (só para quem está logado).
 *
 *   ?limit=N  → os N primeiros (Home: top 3). N entre 1 e 100.
 *   ?me=1     → { position, total } do aluno logado (Perfil).
 *   (padrão)  → página do ranking: { top3, rows, startIdx, myPosition, total },
 *               com 10 linhas abaixo do pódio centradas no aluno.
 *
 * Antes devolvia TODOS os usuários (com nome e foto) a qualquer visitante, e o
 * Perfil baixava a lista inteira só para achar a posição.
 */

require_once __DIR__ . '/cors.php';

require_once __DIR__ . '/db.php';

require_once __DIR__ . '/lib/url.php';

require_once __DIR__ . '/lib/settings.php';

require_once __DIR__ . '/lib/progress.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
const RANKING_LINHAS = 10; // linhas abaixo do pódio
const RANKING_ACIMA  = 4;  // quantas delas ficam acima do aluno

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);

    exit;
}

if (!isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);

    exit;
}

$currentUserId = (int) $_SESSION['user_id'];

// Acesso → ranking_public: se desligado, o ranking geral fica só para admins.
// Alunos recebem lista vazia (o front mostra "ranking indisponível").
if (get_setting($pdo, 'ranking_public', '1') !== '1') {
    $st = $pdo->prepare('SELECT role FROM users WHERE id = ?');
    $st->execute([$currentUserId]);

    if ($st->fetchColumn() !== 'admin') {
        json_out(isset($_GET['me']) ? ['position' => null, 'total' => 0] : (isset($_GET['limit']) ? [] : ['top3' => [], 'rows' => [], 'startIdx' => 0, 'myPosition' => 0, 'total' => 0]));

        exit;
    }
}

// XP por usuário (fonte única: ranking_points). Ordem estável: XP, depois id.
$xpPorUsuario = 'SELECT u.id, u.name, u.avatar, COALESCE(SUM(rp.points), 0) AS xp
    FROM users u
    LEFT JOIN ranking_points rp ON rp.user_id = u.id
    GROUP BY u.id, u.name, u.avatar';

$total = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();

// Posição do aluno: quantos estão à frente (mais XP, ou mesmo XP e id menor) + 1.
$stmt = $pdo->prepare("
    SELECT COUNT(*) + 1 FROM ({$xpPorUsuario}) r
    WHERE r.xp > (SELECT COALESCE(SUM(points), 0) FROM ranking_points WHERE user_id = :id1)
       OR (r.xp = (SELECT COALESCE(SUM(points), 0) FROM ranking_points WHERE user_id = :id2) AND r.id < :id3)
");
$stmt->execute(['id1' => $currentUserId, 'id2' => $currentUserId, 'id3' => $currentUserId]);
$myPosition = (int) $stmt->fetchColumn();

if (isset($_GET['me'])) {
    json_out(['position' => $myPosition, 'total' => $total]);

    exit;
}

// Linhas [offset, offset + quantidade) do ranking ordenado.
$fatia = function (int $offset, int $quantidade) use ($pdo, $xpPorUsuario, $currentUserId): array {
    $rows = $pdo->query("{$xpPorUsuario} ORDER BY xp DESC, u.id ASC LIMIT {$quantidade} OFFSET {$offset}")->fetchAll();

    return array_map(fn ($user) => [
        'id'            => (int) $user['id'],
        'name'          => $user['name'],
        'xp'            => (int) $user['xp'],
        'level'         => nivel_do_xp((int) $user['xp']),
        'avatar'        => avatar_url($user['avatar']), // null se não tiver foto
        'isCurrentUser' => $currentUserId === (int) $user['id'],
    ], $rows);
};

if (isset($_GET['limit'])) {
    $limit = max(1, min(100, (int) $_GET['limit']));
    json_out($fatia(0, $limit));

    exit;
}

// Janela abaixo do pódio: começa RANKING_ACIMA posições acima do aluno, sem
// passar do fim da lista. startIdx é relativo à lista sem o pódio (posição 4 = 0).
$restantes = max(0, $total - 3);
$startIdx  = 0;

if ($myPosition > 3) {
    $startIdx = max(0, $myPosition - 4 - RANKING_ACIMA);
    $startIdx = max(0, min($startIdx, $restantes - RANKING_LINHAS));
}

json_out([
    'top3'       => $fatia(0, 3),
    'rows'       => $fatia(3 + $startIdx, RANKING_LINHAS),
    'startIdx'   => $startIdx,
    'myPosition' => $myPosition,
    'total'      => $total,
]);
