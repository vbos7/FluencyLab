<?php

// Grava na sessão: não deixa o db.php liberá-la cedo (ver db.php).
const MANTER_SESSAO = true;

require_once __DIR__ . '/../cors.php';

require_once __DIR__ . '/../db.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
require_once __DIR__ . '/AiService.php';

require_once __DIR__ . '/../lib/settings.php';

require_once __DIR__ . '/../lib/progress.php';

require_once __DIR__ . '/../lib/login-throttle.php';

// Limites do modo convidado (sem login), para conter o custo da IA da OpenAI.
const GUEST_MAX_ATTEMPTS = 5;    // por sessão do convidado
const GUEST_IP_DAILY_CAP = 20;   // por IP por dia (backstop se limparem os cookies)
// Logado: correções por usuário na janela do throttle (15 min). Uma pessoa leva
// uns 15–30 s por frase; isto só barra robôs gastando crédito da IA.
const USER_MAX_CORRECOES = 60;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);

    exit;
}

// Convidado = sem sessão logada. Pode praticar, mas com teto (ver guardaConvidado).
$isGuest = !isset($_SESSION['user_id']);

$body     = json_decode(file_get_contents('php://input'), true);
$phraseId = (int) ($body['phrase_id'] ?? 0);
$resposta = trim($body['answer'] ?? '');
// Tempo gasto no exercício (segundos). Limitado a [0, 3600] para não inflar o
// total de estudo caso o aluno deixe a aba aberta.
$tempoGasto = max(0, min((int) ($body['time_spent_seconds'] ?? 0), 3600));

if (!$phraseId || empty($resposta)) {
    json_out(['errors' => ['phrase_id e answer obrigatórios']], 422);

    exit;
}

// As frases são curtas: uma resposta longa só serve para gastar crédito da IA ou
// esconder instruções no meio do texto.
if (mb_strlen($resposta) > 300) {
    json_out(['errors' => ['A resposta pode ter no máximo 300 caracteres.']], 422);

    exit;
}

$stmt = $pdo->prepare('SELECT * FROM phrases WHERE id = ?');
$stmt->execute([$phraseId]);
$frase = $stmt->fetch();

if (!$frase) {
    json_out(['error' => 'Frase não encontrada'], 404);

    exit;
}

// Convidado: aplica os tetos (sessão + IP) ANTES de gastar crédito da IA.
$reservaConvidado = $isGuest ? guardaConvidado($pdo) : null;

if (!$isGuest) {
    $chaveCorrecao = 'pratica:' . (int) $_SESSION['user_id'];

    if (throttle_excedido($pdo, $chaveCorrecao, client_ip(), USER_MAX_CORRECOES, PHP_INT_MAX, 'pratica:')) {
        json_out(['errors' => ['Muitas correções em pouco tempo. Faça uma pausa e tente de novo.']], 429);

        exit;
    }
    throttle_registrar($pdo, $chaveCorrecao, client_ip());
}

// Chama a IA (pode demorar 1-3 segundos)
try {
    $ai       = new AiService();
    $feedback = $ai->corrigirTraducao($frase['pt'], $frase['en'], $resposta);
} catch (Exception $e) {
    // A correção não aconteceu: o convidado não pode perder a questão reservada.
    if ($reservaConvidado !== null) {
        devolveConvidado($pdo, $reservaConvidado);
    }
    // O motivo (chave inválida, timeout...) fica no log; o aluno vê uma mensagem genérica.
    error_log('[check-answer] ' . $e->getMessage());
    json_out(['error' => 'Não foi possível corrigir agora. Tente novamente em instantes.'], 502);

    exit;
}

$score = (int) ($feedback['score'] ?? 0);
// XP base configurável no painel (Gamificação → xp_per_phrase). Default 10.
// Só acerto dá XP: o que aparece na tela é o que entra no ranking.
$xpBase = max(1, (int) get_setting($pdo, 'xp_per_phrase', '10'));
$xp     = $feedback['is_correct'] ? calcularXp($score, $xpBase) : 0;

// Convidado não é persistido (não tem user_id nem nível): devolve o feedback,
// informa quantas questões ainda restam e encerra aqui.
if ($isGuest) {
    json_out([
        'feedback'        => $feedback,
        'xp_earned'       => $xp,
        'guest'           => true,
        'guest_remaining' => max(0, GUEST_MAX_ATTEMPTS - (int) ($_SESSION['guest_attempts'] ?? 0)),
    ]);

    exit;
}

$userId = (int) $_SESSION['user_id'];

// XP de uma frase só uma vez por dia: repetir a mesma frase continua corrigindo,
// mas não sobe o ranking.
$xpRepetido = false;

if ($xp > 0) {
    $stmt = $pdo->prepare(
        'SELECT 1 FROM attempts
         WHERE user_id = ? AND phrase_id = ? AND is_correct = 1 AND xp_earned > 0 AND created_at >= CURDATE()
         LIMIT 1'
    );
    $stmt->execute([$userId, $phraseId]);
    $xpRepetido = (bool) $stmt->fetchColumn();

    if ($xpRepetido) {
        $xp = 0;
    }
}

// Bônus de sequência (Gamificação → streak_bonus): se o aluno está numa streak
// (>= 2 dias consecutivos) e acertou, o XP é multiplicado pelo bônus configurado.
$streakBonus = (float) get_setting($pdo, 'streak_bonus', '1.5');

if ($xp > 0 && $streakBonus > 1 && streak_do_usuario($pdo, $userId) >= 2) {
    $xp = (int) round($xp * $streakBonus);
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
        $userId, $phraseId, $resposta,
        $feedback['overall_comment'] ?? null,
        $feedback['corrected_sentence'] ?? null,
        $feedback['is_correct'] ? 1 : 0, $score, $xp, $tempoGasto,
    ]);
    $attemptId = (int) $pdo->lastInsertId();

    if (!empty($feedback['mistakes']) && is_array($feedback['mistakes'])) {
        $insMistake = $pdo->prepare(
            'INSERT INTO attempt_mistakes (attempt_id, type, original, suggestion, explanation_pt)
             VALUES (?, ?, ?, ?, ?)'
        );

        foreach ($feedback['mistakes'] as $m) {
            if (!is_array($m)) {
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

    if (!empty($feedback['positive_points']) && is_array($feedback['positive_points'])) {
        $insPoint = $pdo->prepare(
            'INSERT INTO attempt_positive_points (attempt_id, point) VALUES (?, ?)'
        );

        foreach ($feedback['positive_points'] as $point) {
            if (is_string($point) && $point !== '') {
                $insPoint->execute([$attemptId, $point]);
            }
        }
    }

    // Acerto que rendeu XP credita pontos de ranking
    if ($xp > 0) {
        $pdo->prepare('INSERT INTO ranking_points (user_id, points, reason) VALUES (?, ?, ?)')
            ->execute([$userId, $xp, 'Exercício correto']);
    }

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    json_out(['error' => 'Erro ao salvar a tentativa'], 500);

    exit;
}

// XP total atualizado (mesma fonte do dashboard/ranking) + detecção de subida de
// nível: o XP "antes" é o total sem o ganho desta tentativa.
$xpTotal      = xp_total_do_usuario($pdo, $userId);
$nivelAgora   = nivel_do_xp($xpTotal);
$subiuDeNivel = $nivelAgora > nivel_do_xp($xpTotal - $xp);

json_out([
    'feedback'    => $feedback,
    'xp_earned'   => $xp,
    'xp_repeated' => $xpRepetido,
    'xp_total'    => $xpTotal,
    'level'       => $nivelAgora,
    'leveled_up'  => $subiuDeNivel,
]);

// Teto do convidado: contador na sessão (limite por convidado) + contagem diária
// por IP (backstop caso limpem os cookies). Reserva o slot ANTES de chamar a IA,
// para requisições em paralelo não passarem do teto; se a IA falhar, o slot é
// devolvido em devolveConvidado(). Aborta com 403 se estourar.
//
// @return array{ip: string|false, day: string} o que foi reservado
function guardaConvidado(PDO $pdo): array
{
    $usados = (int) ($_SESSION['guest_attempts'] ?? 0);

    if ($usados >= GUEST_MAX_ATTEMPTS) {
        json_out([
            'error'   => 'limite_convidado',
            'message' => 'Você atingiu o limite de questões como convidado. Faça login para continuar praticando.',
        ], 403);

        exit;
    }

    $ipBin = @inet_pton(client_ip());
    $hoje  = date('Y-m-d');

    if ($ipBin !== false) {
        $stmt = $pdo->prepare('SELECT count FROM guest_usage WHERE ip = ? AND day = ?');
        $stmt->execute([$ipBin, $hoje]);

        if ((int) ($stmt->fetchColumn() ?: 0) >= GUEST_IP_DAILY_CAP) {
            json_out([
                'error'   => 'limite_convidado',
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

    return ['ip' => $ipBin, 'day' => $hoje];
}

// Desfaz a reserva de guardaConvidado() quando a correção falha.
function devolveConvidado(PDO $pdo, array $reserva): void
{
    $_SESSION['guest_attempts'] = max(0, (int) ($_SESSION['guest_attempts'] ?? 0) - 1);

    if ($reserva['ip'] !== false) {
        $pdo->prepare('UPDATE guest_usage SET count = count - 1 WHERE ip = ? AND day = ? AND count > 0')
            ->execute([$reserva['ip'], $reserva['day']]);
    }
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
