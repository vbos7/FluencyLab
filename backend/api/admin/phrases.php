<?php

require_once __DIR__.'/guard.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}
requireAdmin();

$stmt = $pdo->query('
    SELECT p.*, COUNT(a.id) AS total_attempts
    FROM phrases p
    LEFT JOIN attempts a ON a.phrase_id = p.id
    GROUP BY p.id
    ORDER BY total_attempts DESC
');
json_out($stmt->fetchAll());
