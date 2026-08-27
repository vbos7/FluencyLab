<?php

require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';
require_once __DIR__.'/AiService.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}
if (! isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);
    exit;
}

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

// Chama a IA (pode demorar 1-3 segundos)
try {
    $ai = new AiService;
    $feedback = $ai->corrigirTraducao($frase['pt'], $frase['en'], $resposta);
} catch (Exception $e) {
    json_out(['error' => 'Erro na IA: '.$e->getMessage()], 500);
    exit;
}

$score = (int) ($feedback['score'] ?? 0);
$xp = calcularXp($score);

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

json_out(['feedback' => $feedback, 'xp_earned' => $xp]);

function calcularXp(int $score): int
{
    if ($score >= 95) {
        return 25;
    }
    if ($score >= 70) {
        return 15;
    }
    if ($score >= 40) {
        return 8;
    }

    return 3;
}
