<?php

/**
 * cors.php — incluído no início de TODOS os endpoints.
 * Faz três coisas:
 *   1. Define os headers de CORS para o Next.js (porta 3000) conseguir fazer chamadas
 *   2. Inicia a sessão PHP (para ler/gravar $_SESSION)
 *   3. Responde imediatamente a requisições OPTIONS (preflight do browser)
 */
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Preflight: o browser manda OPTIONS antes de qualquer POST/PUT/DELETE
// para perguntar "posso fazer essa requisição?". Respondemos 200 e paramos aqui.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);

    exit;
}

// Configura o cookie de sessão ANTES de chamar session_start().
// SameSite=Lax permite que o cookie viaje entre portas do mesmo host (localhost:3000 → localhost:8000).
// httponly=false: deixa o JavaScript do Next.js checar se o cookie existe (para o middleware).
// Configura o cookie de sessão ANTES de chamar session_start().
// SameSite=Lax permite que o cookie viaje entre portas do mesmo host (localhost:3000 → localhost:8000).
// httponly=false: deixa o JavaScript do Next.js checar se o cookie existe (para o middleware).
session_set_cookie_params([
    'samesite' => 'Lax',
    'httponly' => false,
    'secure'   => false,    // false em desenvolvimento local (http)
    'path'     => '/',
]);

session_start();

/**
 * Envia uma resposta JSON com encoding correto (acentos não escapados).
 * Use no lugar de `echo json_encode(...)` em todos os endpoints.
 */
function json_out(mixed $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
