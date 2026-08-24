<?php

require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

// 1=1 é sempre verdadeiro, então não filtra nada por padrão
$sql = 'SELECT * FROM phrases WHERE 1=1';
$params = [];

// ?category=Trabalho — filtra por categoria
if (! empty($_GET['category'])) {
    $sql .= ' AND category = ?';
    $params[] = $_GET['category'];
}

// ?difficulty=easy — filtra por dificuldade
if (! empty($_GET['difficulty'])) {
    $sql .= ' AND difficulty = ?';
    $params[] = $_GET['difficulty'];
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
json_out($stmt->fetchAll());
