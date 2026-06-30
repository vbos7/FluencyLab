<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    json_out(['error' => 'Método não permitido']);
    exit;
}

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    json_out(['error' => 'Acesso restrito a administradores']);
    exit;
}

// Inclui quantas vezes cada frase foi praticada (COUNT das attempts)
$stmt = $pdo->query(
    "SELECT p.*, COUNT(a.id) AS total_attempts
       FROM phrases p
       LEFT JOIN attempts a ON a.phrase_id = p.id
      GROUP BY p.id
      ORDER BY total_attempts DESC"
);

json_out($stmt->fetchAll());
