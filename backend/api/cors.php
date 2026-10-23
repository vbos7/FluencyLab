<?php

/**
 * cors.php — incluído no início de TODOS os endpoints.
 * Faz três coisas:
 *   1. Define os headers de CORS para o Next.js (porta 3000) conseguir fazer chamadas
 *   2. Inicia a sessão PHP (para ler/gravar $_SESSION)
 *   3. Responde imediatamente a requisições OPTIONS (preflight do browser)
 */
require_once __DIR__ . '/env.php';

// Duração da sessão persistente ("Manter conectado"): 30 dias.
const SESSION_LIFETIME = 2592000;

// Origem do Next.js autorizada a chamar esta API. O default cobre o
// `npm run dev` padrão; mude APP_ORIGIN no .env se usar outra porta.
header('Access-Control-Allow-Origin: ' . env('APP_ORIGIN', 'http://localhost:3000'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');
// A API só devolve JSON: não deixa o navegador "adivinhar" outro tipo nem exibir
// a resposta dentro de frames de outros sites.
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');

// Preflight: o browser manda OPTIONS antes de qualquer POST/PUT/DELETE
// para perguntar "posso fazer essa requisição?". Respondemos 200 e paramos aqui.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);

    exit;
}

// No Forge o nginx termina o TLS e repassa o protocolo original em
// X-Forwarded-Proto — para o PHP a conexão parece http. Sem checar os dois,
// o cookie nunca seria marcado como secure em produção.
$https = request_is_https();

// "Manter conectado": um cookie separado `remember` (lido ANTES do session_start)
// decide se a sessão é persistente (30 dias) ou some ao fechar o navegador.
$remember = ($_COOKIE['remember'] ?? '') === '1';

// gc_maxlifetime alto nos DOIS casos: o servidor não descarta a sessão cedo demais.
// O default do PHP (~24min) era o que derrubava a sessão "sozinha" da noite pro dia,
// deixando o cookie órfão (middleware achava logado, mas a API respondia 401).
ini_set('session.gc_maxlifetime', (string) SESSION_LIFETIME);

// Configura o cookie de sessão ANTES de chamar session_start().
// SameSite=Lax permite que o cookie viaje entre portas do mesmo host (localhost:3000 → localhost:8000).
// httponly=true: o JavaScript da página não lê o cookie (um XSS não rouba a sessão).
// O proxy do Next (proxy.ts) roda no servidor e lê cookies HttpOnly normalmente.
// secure precisa acompanhar o protocolo: em http (Docker local) tem que ser
// false, senão o browser descarta o cookie e ninguém consegue logar.
// lifetime: 30 dias se "manter conectado"; 0 = cookie de sessão (morre ao fechar o navegador).
session_set_cookie_params([
    'lifetime' => $remember ? SESSION_LIFETIME : 0,
    'samesite' => 'Lax',
    'httponly' => true,
    'secure'   => $https,
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

/**
 * A conexão é HTTPS? No Forge o nginx termina o TLS e sinaliza via
 * X-Forwarded-Proto, então checamos os dois. Usado para marcar cookies secure.
 */
function request_is_https(): bool
{
    return ($_SERVER['HTTPS'] ?? '') === 'on'
        || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
}

/**
 * IP real do cliente, usado nos limites de tentativas e no teto do convidado.
 *
 * Os cabeçalhos CF-Connecting-IP e X-Forwarded-For podem ser enviados por
 * qualquer um, então só valem quando a requisição chega de um proxy listado em
 * TRUSTED_PROXIES (IPs ou faixas CIDR, separados por vírgula — ex.: as faixas do
 * Cloudflare, se a API estiver atrás dele). Fora disso vale o REMOTE_ADDR.
 */
function client_ip(): string
{
    $remoto = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

    if (!ip_confiavel($remoto)) {
        return $remoto;
    }

    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return $_SERVER['HTTP_CF_CONNECTING_IP'];
    }

    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
    }

    return $remoto;
}

// O IP está em TRUSTED_PROXIES (aceita IP exato ou faixa CIDR, IPv4 e IPv6)?
function ip_confiavel(string $ip): bool
{
    $ipBin = @inet_pton($ip);

    if ($ipBin === false) {
        return false;
    }

    foreach (array_filter(array_map('trim', explode(',', env('TRUSTED_PROXIES')))) as $faixa) {
        [$rede, $bits] = array_pad(explode('/', $faixa, 2), 2, null);
        $redeBin       = @inet_pton($rede);

        if ($redeBin === false || strlen($redeBin) !== strlen($ipBin)) {
            continue;
        }

        $bits  = $bits === null ? strlen($ipBin) * 8 : (int) $bits;
        $bytes = intdiv($bits, 8);
        $resto = $bits % 8;

        if (substr($ipBin, 0, $bytes) !== substr($redeBin, 0, $bytes)) {
            continue;
        }

        if ($resto === 0) {
            return true;
        }

        $mascara = (0xFF << (8 - $resto)) & 0xFF;

        if ((ord($ipBin[$bytes]) & $mascara) === (ord($redeBin[$bytes]) & $mascara)) {
            return true;
        }
    }

    return false;
}

/**
 * Aplica (ou limpa) o "manter conectado" após um login bem-sucedido.
 *
 * Grava/apaga o cookie `remember` (que o cors.php lê no próximo request para
 * decidir a duração da sessão) e, quando persistente, reemite o PHPSESSID já com
 * 30 dias, para valer imediatamente sem esperar o próximo request.
 */
function aplicar_remember(bool $remember): void
{
    $base = [
        'path'     => '/',
        'samesite' => 'Lax',
        'secure'   => request_is_https(),
        'httponly' => true,
    ];

    if ($remember) {
        setcookie('remember', '1', ['expires' => time() + SESSION_LIFETIME] + $base);
        setcookie(session_name(), session_id(), ['expires' => time() + SESSION_LIFETIME] + $base);
    } else {
        // Expira no passado = remove o cookie.
        setcookie('remember', '', ['expires' => time() - 3600] + $base);
    }
}
