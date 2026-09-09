<?php

require_once __DIR__.'/../cors.php';
require_once __DIR__.'/../db.php';
require_once __DIR__.'/../lib/premium.php';

/** @var PDO $pdo */
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}
json_out(['is_pro' => hasActivePro($pdo, isset($_SESSION['user_id']) ? (int) $_SESSION['user_id'] : null)]);
