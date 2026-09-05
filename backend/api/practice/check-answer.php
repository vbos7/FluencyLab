<?php

require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
require_once __DIR__.'/AiService.php';
require_once __DIR__.'/../lib/settings.php';

// Limites do modo convidado (sem login), para conter o custo da IA da OpenAI.
const GUEST_MAX_ATTEMPTS = 5;    // por sessão do convidado
const GUEST_IP_DAILY_CAP = 20;   // por IP por dia (backstop se limparem os cookies)

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

// Convidado = sem sessão logada. Pode praticar, mas com teto (ver guardaConvidado).
$isGuest = ! isset($_SESSION['user_id']);

$body = json_decode(file_get_contents('php://input'), true);
$phraseId = (int) ($body['phrase_id'] ?? 0);
$resposta = trim($body['answer'] ?? '');
// Tempo gasto no exercício (segundos). Limitado a [0, 3600] para não inflar o
// total de estudo caso o aluno deixe a aba aberta.
$tempoGasto = max(0, min((int) ($body['time_spent_seconds'] ?? 0), 3600));

if (! $phraseId || empty($resposta)) {
    json_out(['errors' => ['phrase_id e answer obrigatórios']], 422);
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM phrases WHERE id = ?');
$stmt->execute([$phraseId]);
$frase = $stmt->fetch();
if (! $frase) {
    json_out(['error' => 'Frase não encontrada'], 404);
    exit;
}

// Convidado: aplica os tetos (sessão + IP) ANTES de gastar crédito da IA.
if ($isGuest) {
    guardaConvidado($pdo);
}

// Chama a IA (pode demorar 1-3 segundos)
try {
    $ai = new AiService;
    $feedback = $ai->corrigirTraducao($frase['pt'], $frase['en'], $resposta);
} catch (Exception $e) {
    json_out(['error' => 'Erro na IA: '.$e->getMessage()], 500);
    exit;
}

$score = (int) ($feedback['score'] ?? 0);
// XP base configurável no painel (Gamificação → xp_per_phrase). Default 10.
$xpBase = max(1, (int) get_setting($pdo, 'xp_per_phrase', '10'));
$xp = calcularXp($score, $xpBase);

// Convidado não é persistido (não tem user_id nem nível): devolve o feedback,
// informa quantas questões ainda restam e encerra aqui.
if ($isGuest) {
    json_out([
        'feedback' => $feedback,
        'xp_earned' => $xp,
        'guest' => true,
        'guest_remaining' => max(0, GUEST_MAX_ATTEMPTS - (int) ($_SESSION['guest_attempts'] ?? 0)),
    ]);
    exit;
}

// Salva a tentativa e o feedback da IA, normalizado: os escalares vão como
// colunas em attempts; os arrays (erros e pontos positivos) viram linhas nas
// tabelas-filhas. Tudo numa transação para não deixar tentativa órfã de feedback.
try {
    $pdo->beginTransaction();

    $pdo->prepare(
        'INSERT INTO attempts (user_id, phrase_id, answer_given, overall_comment, corrected_sentence, is_correct, score, xp_earned, time_spent_seconds)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )->execute([
        $_SESSION['user_id'], $phraseId, $resposta,
        $feedback['overall_comment'] ?? null,
        $feedback['corrected_sentence'] ?? null,
        $feedback['is_correct'] ? 1 : 0, $score, $xp, $tempoGasto,
    ]);
    $attemptId = (int) $pdo->lastInsertId();

    if (! empty($feedback['mistakes']) && is_array($feedback['mistakes'])) {
        $insMistake = $pdo->prepare(
            'INSERT INTO attempt_mistakes (attempt_id, type, original, suggestion, explanation_pt)
             VALUES (?, ?, ?, ?, ?)'
        );
        foreach ($feedback['mistakes'] as $m) {
            if (! is_array($m)) {
                continue;
            }
            $insMistake->execute([
                $attemptId,
                $m['type'] ?? null,
                $m['original'] ?? null,
                $m['suggestion'] ?? null,
                $m['explanation_pt'] ?? null,
            ]);
        }
    }

    if (! empty($feedback['positive_points']) && is_array($feedback['positive_points'])) {
        $insPoint = $pdo->prepare(
            'INSERT INTO attempt_positive_points (attempt_id, point) VALUES (?, ?)'
        );
        foreach ($feedback['positive_points'] as $point) {
            if (is_string($point) && $point !== '') {
                $insPoint->execute([$attemptId, $point]);
            }
        }
    }

    // Se acertou, credita pontos de ranking
    if ($feedback['is_correct']) {
        $pdo->prepare('INSERT INTO ranking_points (user_id, points, reason) VALUES (?, ?, ?)')
            ->execute([$_SESSION['user_id'], $xp, 'Exercício correto']);
    }

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    json_out(['error' => 'Erro ao salvar a tentativa'], 500);
    exit;
}

// XP total atualizado (mesma fonte do dashboard/ranking) + detecção de subida de
// nível. Só acerto credita ranking_points, então o XP "antes" tira o ganho desta
// tentativa quando ela foi correta; senão o nível não muda.
$stmtXp = $pdo->prepare('SELECT COALESCE(SUM(points), 0) FROM ranking_points WHERE user_id = ?');
$stmtXp->execute([$_SESSION['user_id']]);
$xpTotal = (int) $stmtXp->fetchColumn();

$xpAntes = $feedback['is_correct'] ? $xpTotal - $xp : $xpTotal;
$nivelAgora = nivelDoXp($xpTotal);
$subiuDeNivel = $nivelAgora > nivelDoXp($xpAntes);

json_out([
    'feedback' => $feedback,
    'xp_earned' => $xp,
    'xp_total' => $xpTotal,
    'level' => $nivelAgora,
    'leveled_up' => $subiuDeNivel,
]);

// Nível a partir do XP total — mesma fórmula triangular do ranking.php e do front
// (ranking.ts getLevel): o nível N exige N×150 de XP acumulado.
function nivelDoXp(int $xp): int
{
    $nivel = 1;
    $restante = $xp;
    while ($restante >= $nivel * 150) {
        $restante -= $nivel * 150;
        $nivel++;
    }

    return $nivel;
}

// Teto do convidado: contador na sessão (limite por convidado) + contagem diária
// por IP (backstop caso limpem os cookies). Reserva o slot ANTES de chamar a IA,
// para o crédito ficar protegido mesmo se a IA falhar. Aborta com 403 se estourar.
function guardaConvidado(PDO $pdo): void
{
    $usados = (int) ($_SESSION['guest_attempts'] ?? 0);
    if ($usados >= GUEST_MAX_ATTEMPTS) {
        json_out([
            'error' => 'limite_convidado',
            'message' => 'Você atingiu o limite de questões como convidado. Faça login para continuar praticando.',
        ], 403);
        exit;
    }

    $ipBin = @inet_pton(client_ip());
    if ($ipBin !== false) {
        $hoje = date('Y-m-d');
        $stmt = $pdo->prepare('SELECT count FROM guest_usage WHERE ip = ? AND day = ?');
        $stmt->execute([$ipBin, $hoje]);
        if ((int) ($stmt->fetchColumn() ?: 0) >= GUEST_IP_DAILY_CAP) {
            json_out([
                'error' => 'limite_convidado',
                'message' => 'Limite diário de uso como convidado atingido. Faça login para continuar.',
            ], 403);
            exit;
        }
        $pdo->prepare(
            'INSERT INTO guest_usage (ip, day, count) VALUES (?, ?, 1)
             ON DUPLICATE KEY UPDATE count = count + 1'
        )->execute([$ipBin, $hoje]);
    }

    $_SESSION['guest_attempts'] = $usados + 1;
}

// XP proporcional à qualidade da resposta, escalado pelo XP base configurável.
// Com base = 10 (default) reproduz os valores antigos: 25 / 15 / 8 / 3.
function calcularXp(int $score, int $xpBase): int
{
    if ($score >= 95) {
        return (int) round($xpBase * 2.5);
    }
    if ($score >= 70) {
        return (int) round($xpBase * 1.5);
    }
    if ($score >= 40) {
        return (int) round($xpBase * 0.8);
    }

    return (int) round($xpBase * 0.3);
}
