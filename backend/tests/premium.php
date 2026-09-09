<?php

// Tabelas temporárias: nenhuma assinatura persistente é alterada.
require_once __DIR__.'/../api/env.php';
require_once __DIR__.'/../api/lib/premium.php';

$pdo = new PDO(
    'mysql:host='.env('DB_HOST').';port='.env('DB_PORT', '3306').';dbname='.env('DB_NAME').';charset=utf8mb4',
    env('DB_USER'), env('DB_PASS'), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);
$pdo->exec('CREATE TEMPORARY TABLE plans (id INT PRIMARY KEY, name VARCHAR(50))');
$pdo->exec('CREATE TEMPORARY TABLE user_plan (id INT PRIMARY KEY, user_id INT, plan_id INT, status VARCHAR(30), expires_at DATETIME NULL)');
$pdo->exec("INSERT INTO plans VALUES (1, 'Free'), (2, 'Pro')");
$pdo->exec("INSERT INTO user_plan VALUES
    (1, 1, 1, 'active', NULL),
    (2, 2, 2, 'active', NULL),
    (3, 3, 2, 'active', DATE_ADD(NOW(), INTERVAL 1 DAY)),
    (4, 4, 2, 'active', DATE_SUB(NOW(), INTERVAL 1 DAY)),
    (5, 5, 2, 'cancelled', NULL)");
foreach ([[null, false], [1, false], [2, true], [3, true], [4, false], [5, false], [6, false]] as [$userId, $expected]) {
    if (hasActivePro($pdo, $userId) !== $expected) {
        throw new RuntimeException('Permissão incorreta para usuário '.var_export($userId, true));
    }
}
echo "Premium: 7 verificações de integração passaram.\n";
