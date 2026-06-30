<?php
require_once __DIR__ . '/../cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    json_out(['error' => 'Método não permitido']);
    exit;
}

// Apaga todos os dados da sessão e destrói o cookie PHPSESSID
$_SESSION = [];
session_destroy();

json_out(['success' => true, 'message' => 'Logout realizado com sucesso']);
