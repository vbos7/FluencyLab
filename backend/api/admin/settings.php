<?php

require_once __DIR__ . '/guard.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];

// Chaves aceitas — protege a tabela de lixo e ignora campos desconhecidos.
$permitidas = [
    'app_name', 'app_description', 'xp_per_phrase', 'streak_bonus',
    'ranking_public', 'new_registrations', 'maintenance_mode',
];

// GET — devolve todas as configurações como um objeto { chave: valor }
if ($method === 'GET') {
    json_out(lerSettings($pdo));

    exit;
}

// PUT/PATCH — grava (upsert) apenas as chaves permitidas enviadas no corpo
if ($method === 'PUT' || $method === 'PATCH') {
    $body = json_decode(file_get_contents('php://input'), true);

    if (!is_array($body)) {
        json_out(['error' => 'Corpo inválido'], 422);

        exit;
    }

    // Valida TUDO antes de gravar: estes valores mudam o XP e o acesso de todos
    // os alunos (check-answer.php, register.php, ranking.php, status.php).
    $valores = [];
    $errors  = [];

    foreach ($body as $key => $value) {
        if (!in_array($key, $permitidas, true)) {
            continue;
        }

        [$normalizado, $erro] = validarSetting($key, $value);

        if ($erro !== null) {
            $errors[] = $erro;
        } else {
            $valores[$key] = $normalizado;
        }
    }

    if ($errors) {
        json_out(['errors' => $errors], 422);

        exit;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
    );

    foreach ($valores as $key => $value) {
        $stmt->execute([$key, $value]);
    }

    json_out(['success' => true, 'settings' => lerSettings($pdo)]);

    exit;
}

json_out(['error' => 'Método não permitido'], 405);

/**
 * Normaliza e valida um valor. @return array{0: string, 1: ?string} [valor, erro]
 */
function validarSetting(string $key, mixed $value): array
{
    switch ($key) {
        case 'ranking_public':
        case 'new_registrations':
        case 'maintenance_mode':
            // Toggles chegam como boolean do JSON (ou "1"/"0") — normaliza para "1"/"0".
            if (is_bool($value) || in_array($value, ['0', '1', 0, 1], true)) {
                return [$value ? '1' : '0', null];
            }

            return ['', "{$key} deve ser verdadeiro ou falso"];

        case 'xp_per_phrase':
            $n = filter_var($value, FILTER_VALIDATE_INT);

            return $n !== false && $n >= 1 && $n <= 1000
                ? [(string) $n, null]
                : ['', 'XP por frase deve ser um número inteiro entre 1 e 1000'];

        case 'streak_bonus':
            $n = filter_var($value, FILTER_VALIDATE_FLOAT);

            return $n !== false && $n >= 1 && $n <= 5
                ? [(string) $n, null]
                : ['', 'O multiplicador de sequência deve ficar entre 1 e 5'];

        case 'app_name':
            $texto = trim((string) $value);

            return $texto !== '' && mb_strlen($texto) <= 60
                ? [$texto, null]
                : ['', 'O nome da plataforma deve ter entre 1 e 60 caracteres'];

        default: // app_description
            $texto = trim((string) $value);

            return mb_strlen($texto) <= 300
                ? [$texto, null]
                : ['', 'A descrição pode ter no máximo 300 caracteres'];
    }
}

// Lê todas as configurações e devolve como mapa chave => valor.
function lerSettings(PDO $pdo): array
{
    $out = [];

    foreach ($pdo->query('SELECT setting_key, setting_value FROM settings')->fetchAll() as $row) {
        $out[$row['setting_key']] = $row['setting_value'];
    }

    return $out;
}
