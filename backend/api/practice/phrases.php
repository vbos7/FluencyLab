<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    json_out(['error' => 'Método não permitido']);
    exit;
}

$query  = "SELECT * FROM phrases WHERE 1=1";
$params = [];

// Filtra por categoria se o parâmetro vier na URL: ?category=Trabalho
if (!empty($_GET['category'])) {
    $query  .= " AND category = ?";
    $params[] = $_GET['category'];
}

// Filtra por dificuldade: ?difficulty=easy
if (!empty($_GET['difficulty'])) {
    $query  .= " AND difficulty = ?";
    $params[] = $_GET['difficulty'];
}

$stmt = $pdo->prepare($query);
$stmt->execute($params);
json_out($stmt->fetchAll());
