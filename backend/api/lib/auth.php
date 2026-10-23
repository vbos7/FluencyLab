<?php

/**
 * auth.php — abertura e validade da sessão logada.
 *
 * Todo login (senha, 2º fator, passkey, cadastro) passa por iniciar_sessao_logada():
 *  - troca o ID da sessão (session_regenerate_id), senão um ID plantado antes do
 *    login continuaria valendo depois dele (fixação de sessão);
 *  - guarda uma impressão do hash da senha atual. db.php confere essa impressão a
 *    cada request: trocar ou redefinir a senha derruba as outras sessões abertas.
 */
function auth_impressao(PDO $pdo, int $userId): ?string
{
    $stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $hash = $stmt->fetchColumn();

    return $hash === false ? null : substr(hash('sha256', $hash), 0, 32);
}

function iniciar_sessao_logada(PDO $pdo, int $userId): void
{
    session_regenerate_id(true);
    $_SESSION['user_id']  = $userId;
    $_SESSION['auth_imp'] = auth_impressao($pdo, $userId);
}

/**
 * Chamado por db.php: encerra a sessão se o usuário sumiu ou trocou de senha
 * depois do login. Sessões antigas (de antes desta regra) ganham a impressão na
 * primeira passagem, em vez de serem derrubadas.
 */
function validar_sessao_logada(PDO $pdo): void
{
    if (session_status() !== PHP_SESSION_ACTIVE || !isset($_SESSION['user_id'])) {
        return;
    }

    $atual = auth_impressao($pdo, (int) $_SESSION['user_id']);

    if (!isset($_SESSION['auth_imp'])) {
        $_SESSION['auth_imp'] = $atual;
    }

    if ($atual === null || !hash_equals($_SESSION['auth_imp'], $atual)) {
        $_SESSION = [];
    }
}
