<?php

/**
 * login-throttle.php — limite de tentativas (anti-força-bruta).
 *
 * Usa a tabela login_attempts como registro genérico: cada linha é uma tentativa
 * de uma "chave" (coluna email) vinda de um IP. As chaves têm prefixo por tipo:
 *   <email>          falha de login com senha
 *   2fa:<user_id>    código errado no 2º fator (por usuário, não por sessão)
 *   reset:<email>    pedido de código de "Esqueci minha senha"
 * Um login certo zera só as falhas daquele e-mail; as do 2FA zeram quando o
 * código certo é informado.
 */
const LOGIN_MAX_PER_EMAIL = 8;    // falhas por e-mail na janela
const LOGIN_MAX_PER_IP    = 20;   // falhas por IP na janela (mais alto: IP compartilhado)
const LOGIN_WINDOW_MIN    = 15;   // janela, em minutos

/**
 * A chave ou o IP passou do limite na janela? O limite por IP conta só as linhas
 * do mesmo tipo ($prefixoIp); com prefixo vazio conta todas daquele IP.
 */
function throttle_excedido(PDO $pdo, string $chave, string $ip, int $maxChave, int $maxIp, string $prefixoIp = ''): bool
{
    $ipBin = @inet_pton($ip) ?: '';
    // A janela é uma constante nossa (int), então é seguro embutir no SQL.
    $stmt = $pdo->prepare(
        'SELECT
            COALESCE(SUM(email = ?), 0)                AS por_chave,
            COALESCE(SUM(ip = ? AND email LIKE ?), 0)  AS por_ip
         FROM login_attempts
         WHERE attempted_at >= (NOW() - INTERVAL ' . LOGIN_WINDOW_MIN . ' MINUTE)'
    );
    $stmt->execute([$chave, $ipBin, $prefixoIp . '%']);
    $r = $stmt->fetch();

    return (int) ($r['por_chave'] ?? 0) >= $maxChave
        || (int) ($r['por_ip'] ?? 0) >= $maxIp;
}

function throttle_registrar(PDO $pdo, string $chave, string $ip): void
{
    $ipBin = @inet_pton($ip) ?: '';
    $pdo->prepare('INSERT INTO login_attempts (email, ip) VALUES (?, ?)')
        ->execute([$chave, $ipBin]);

    // Faxina ocasional: só a última janela importa, então linhas de mais de um dia
    // não servem para nada (a prática registra uma por correção).
    if (random_int(1, 100) === 1) {
        $pdo->exec('DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL 1 DAY');
    }
}

function throttle_limpar(PDO $pdo, string $chave): void
{
    $pdo->prepare('DELETE FROM login_attempts WHERE email = ?')->execute([$chave]);
}

// Está bloqueado agora? (e-mail OU IP estourou o limite na janela)
function login_bloqueado(PDO $pdo, string $email, string $ip): bool
{
    return throttle_excedido($pdo, $email, $ip, LOGIN_MAX_PER_EMAIL, LOGIN_MAX_PER_IP);
}

// Registra uma falha de login (senha errada / usuário inexistente).
function login_registrar_falha(PDO $pdo, string $email, string $ip): void
{
    throttle_registrar($pdo, $email, $ip);
}

// Login bem-sucedido: zera as falhas daquele e-mail.
function login_limpar(PDO $pdo, string $email): void
{
    throttle_limpar($pdo, $email);
}
