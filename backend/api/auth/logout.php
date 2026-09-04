<?php

require_once __DIR__.'/../cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);

    exit;
}

// Limpa todos os dados da sessão
$_SESSION = [];

// Apaga o cookie PHPSESSID no navegador do usuário
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'],
        $params['domain'],
        $params['secure'],
        $params['httponly']
    );
}

// Também apaga o cookie "remember", senão a sessão continuaria persistente.
setcookie('remember', '', ['expires' => time() - 42000, 'path' => '/', 'samesite' => 'Lax', 'secure' => request_is_https()]);

// Destrói a sessão no servidor
session_destroy();

json_out(['success' => true, 'message' => 'Logout realizado']);
