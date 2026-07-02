<?php

/**
 * db.php — cria a conexão com o banco MySQL via PDO.
 * Incluído após cors.php em qualquer endpoint que precise do banco.
 *
 * Por que PDO e não mysqli_connect()?
 * - PDO funciona com qualquer banco (MySQL, PostgreSQL, SQLite...) com a mesma API
 * - Prepared statements são mais simples de escrever com PDO
 * - getenv() lê as variáveis de ambiente definidas no docker-compose.yml
 */
$pdo = new PDO(
    'mysql:host=' . getenv('DB_HOST') . ';port=' . (getenv('DB_PORT') ?: '3306') . ';dbname=' . getenv('DB_NAME') . ';charset=utf8mb4',
    getenv('DB_USER'),
    getenv('DB_PASS'),
    [
        // Lança exceção em vez de retornar false silenciosamente
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        // Fetch como array associativo por padrão: $row['email'] em vez de $row[1]
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
);
