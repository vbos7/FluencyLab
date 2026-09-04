<?php

/**
 * login-throttle.php — proteção anti-força-bruta do login.
 *
 * Conta as FALHAS recentes de login por e-mail e por IP numa janela de tempo.
 * Bloqueia por e-mail (ataque direcionado a uma conta) e por IP (um IP tentando
 * muitas contas). Só falhas são registradas; um login certo zera o contador do
 * e-mail. Fecha o buraco do 2FA: sem isso, dava pra relogar e resetar as
 * tentativas do 2º fator.
 */

const LOGIN_MAX_PER_EMAIL = 8;    // falhas por e-mail na janela
const LOGIN_MAX_PER_IP = 20;      // falhas por IP na janela (mais alto: IP compartilhado)
const LOGIN_WINDOW_MIN = 15;      // janela, em minutos

// Está bloqueado agora? (e-mail OU IP estourou o limite na janela)
function login_bloqueado(PDO $pdo, string $email, string $ip): bool
{
    $ipBin = @inet_pton($ip) ?: '';
    // A janela é uma constante nossa (int), então é seguro embutir no SQL.
    $stmt = $pdo->prepare(
        'SELECT
            COALESCE(SUM(email = ?), 0) AS por_email,
            COALESCE(SUM(ip = ?), 0)    AS por_ip
         FROM login_attempts
         WHERE attempted_at >= (NOW() - INTERVAL '.LOGIN_WINDOW_MIN.' MINUTE)'
    );
    $stmt->execute([$email, $ipBin]);
    $r = $stmt->fetch();

    return (int) ($r['por_email'] ?? 0) >= LOGIN_MAX_PER_EMAIL
        || (int) ($r['por_ip'] ?? 0) >= LOGIN_MAX_PER_IP;
}

// Registra uma falha de login (senha errada / usuário inexistente).
function login_registrar_falha(PDO $pdo, string $email, string $ip): void
{
    $ipBin = @inet_pton($ip) ?: '';
    $pdo->prepare('INSERT INTO login_attempts (email, ip) VALUES (?, ?)')
        ->execute([$email, $ipBin]);
}

// Login bem-sucedido: zera as falhas daquele e-mail.
function login_limpar(PDO $pdo, string $email): void
{
    $pdo->prepare('DELETE FROM login_attempts WHERE email = ?')->execute([$email]);
}
