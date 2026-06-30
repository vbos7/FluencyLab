<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/AiService.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    json_out(['error' => 'Método não permitido']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    json_out(['error' => 'Não autenticado']);
    exit;
}

$body      = json_decode(file_get_contents('php://input'), true);
$phraseId  = (int) ($body['phrase_id'] ?? 0);
$respostaAluno = trim($body['answer'] ?? '');

if (!$phraseId || empty($respostaAluno)) {
    http_response_code(422);
    json_out(['errors' => ['phrase_id e answer são obrigatórios']]);
    exit;
}

// Busca a frase no banco
$stmt = $pdo->prepare("SELECT * FROM phrases WHERE id = ?");
$stmt->execute([$phraseId]);
$frase = $stmt->fetch();

if (!$frase) {
    http_response_code(404);
    json_out(['error' => 'Frase não encontrada']);
    exit;
}

// Chama a IA (pode demorar 1-3 segundos)
try {
    $ai       = new AiService();
    $feedback = $ai->corrigirTraducao($frase['pt'], $frase['en'], $respostaAluno);
} catch (\Exception $e) {
    http_response_code(500);
    json_out(['error' => 'Erro na correção por IA: ' . $e->getMessage()]);
    exit;
}

$score = (int) ($feedback['score'] ?? 0);
$xp    = calcularXp($score);

// Salva a tentativa no banco
$stmt = $pdo->prepare(
    "INSERT INTO attempts (user_id, phrase_id, answer_given, ai_feedback, is_correct, score, xp_earned)
     VALUES (?, ?, ?, ?, ?, ?, ?)"
);
$stmt->execute([
    $_SESSION['user_id'],
    $phraseId,
    $respostaAluno,
    json_encode($feedback),
    $feedback['is_correct'] ? 1 : 0,
    $score,
    $xp,
]);

$attemptId = $pdo->lastInsertId();

// Se acertou, registra pontos no ranking
if ($feedback['is_correct']) {
    creditarPontos($_SESSION['user_id'], $xp, 'Exercício correto', $pdo);
}

echo json_encode([
    'feedback'   => $feedback,
    'xp_earned'  => $xp,
    'attempt_id' => $attemptId,
]);

// ─── Funções auxiliares ───────────────────────────────────────────────────────

/**
 * Calcula o XP baseado no score da IA (0-100).
 * Mesmas faixas que o frontend já usa na apresentação.
 */
function calcularXp(int $score): int
{
    if ($score >= 95) return 25;
    if ($score >= 70) return 15;
    if ($score >= 40) return 8;
    return 3;
}

/**
 * Insere uma linha em ranking_points para registrar a pontuação.
 * Em PHP puro fazemos isso manualmente — sem Observers como no Laravel.
 */
function creditarPontos(int $userId, int $points, string $reason, PDO $pdo): void
{
    $stmt = $pdo->prepare(
        "INSERT INTO ranking_points (user_id, points, reason) VALUES (?, ?, ?)"
    );
    $stmt->execute([$userId, $points, $reason]);
}
