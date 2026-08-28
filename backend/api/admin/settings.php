<?php

require_once __DIR__.'/guard.php';

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
    if (! is_array($body)) {
        json_out(['error' => 'Corpo inválido'], 422);
        exit;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
    );
    foreach ($body as $key => $value) {
        if (! in_array($key, $permitidas, true)) {
            continue;
        }
        // Toggles chegam como boolean do JSON — normaliza para "1"/"0".
        if (is_bool($value)) {
            $value = $value ? '1' : '0';
        }
        $stmt->execute([$key, (string) $value]);
    }

    json_out(['success' => true, 'settings' => lerSettings($pdo)]);
    exit;
}

json_out(['error' => 'Método não permitido'], 405);

// Lê todas as configurações e devolve como mapa chave => valor.
function lerSettings(PDO $pdo): array
{
    $out = [];
    foreach ($pdo->query('SELECT setting_key, setting_value FROM settings')->fetchAll() as $row) {
        $out[$row['setting_key']] = $row['setting_value'];
    }

    return $out;
}
