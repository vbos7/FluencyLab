<?php

/**
 * db.php — cria a conexão com o banco MySQL via PDO.
 * Incluído após cors.php em qualquer endpoint que precise do banco.
 *
 * Por que PDO e não mysqli_connect()?
 * - PDO funciona com qualquer banco (MySQL, PostgreSQL, SQLite...) com a mesma API
 * - Prepared statements são mais simples de escrever com PDO
 * - getenv() lê as variáveis de ambiente definidas no docker-compose.yml
 *
 * O `?:` define um valor padrão para quando você roda localmente (php -S) com o MySQL do MAMP.
 * No Docker, as variáveis de ambiente sobrescrevem esses padrões.
 */
$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '8889';        // 8889 = porta padrão do MySQL no MAMP
$name = getenv('DB_NAME') ?: 'db_fluencylab';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: 'root';

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
