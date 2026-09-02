<?php

require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

// JOIN com categories para devolver o nome da categoria (o front espera `category`).
// 1=1 é sempre verdadeiro, então não filtra nada por padrão.
$sql = 'SELECT p.id, p.pt, p.en, p.difficulty, p.category_id, c.name AS category
        FROM phrases p
        JOIN categories c ON c.id = p.category_id
        WHERE 1=1';
$params = [];

// ?category=Trabalho — filtra pelo nome da categoria (compatibilidade)
if (! empty($_GET['category'])) {
    $sql .= ' AND c.name = ?';
    $params[] = $_GET['category'];
}

// ?category_id=2 — filtra pelo id da categoria
if (! empty($_GET['category_id'])) {
    $sql .= ' AND p.category_id = ?';
    $params[] = (int) $_GET['category_id'];
}

// ?difficulty=easy — filtra por dificuldade
if (! empty($_GET['difficulty'])) {
    $sql .= ' AND p.difficulty = ?';
    $params[] = $_GET['difficulty'];
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
json_out($stmt->fetchAll());
