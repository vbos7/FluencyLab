<?php

/**
 * db.php — cria a conexão com o banco MySQL via PDO.
 * Incluído após cors.php em qualquer endpoint que precise do banco.
 *
 * Por que PDO e não mysqli_connect()?
 * - PDO funciona com qualquer banco (MySQL, PostgreSQL, SQLite...) com a mesma API
 * - Prepared statements são mais simples de escrever com PDO
 *
 * A função env() vem do env.php e resolve de onde a configuração sai em cada
 * ambiente (arquivo .env no terminal, variáveis no Docker, fastcgi_param no Forge).
 *
 * Sem padrão para as credenciais de propósito: se o .env estiver faltando, o erro
 * é "access denied" na hora, e não uma conexão silenciosa num banco errado.
 */
require_once __DIR__ . '/env.php';

$host = env('DB_HOST');
$port = env('DB_PORT', '3306');
$name = env('DB_NAME');
$user = env('DB_USER');
$pass = env('DB_PASS');

if ($host === '' || $name === '' || $user === '') {
    http_response_code(500);
    exit(json_encode([
        'error' => 'Configuração do banco ausente. Copie o .env.example para .env e preencha.',
    ], JSON_UNESCAPED_UNICODE));
}


$pdo = new PDO(
    "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
    $user,
    $pass,
    [
        // Lança exceção em vez de retornar false silenciosamente
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        // Fetch como array associativo por padrão: $row['email'] em vez de $row[1]
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);
 ?>