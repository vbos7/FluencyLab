<?php

/**
 * env.php — resolve configuração vinda de três lugares diferentes.
 *
 * O mesmo código roda em três ambientes, e cada um entrega config de um jeito:
 *
 *   1. Terminal (php -S)   → não entrega nada. Lemos o .env da raiz do projeto.
 *   2. Docker Compose      → variáveis de ambiente de verdade (getenv).
 *   3. Laravel Forge       → fastcgi_param do nginx, que o PHP-FPM expõe em $_SERVER.
 *
 * A ordem de precedência abaixo é o que faz isso funcionar sem `if` de ambiente:
 * ambiente real ganha do arquivo. Assim um .env esquecido na máquina nunca
 * sobrescreve o que o Docker ou o Forge definiram.
 */

/**
 * Lê o .env da raiz do projeto uma única vez.
 *
 * Por que não parse_ini_file()? Porque ele trata `#` como início de comentário
 * mesmo no meio do valor, e corta senha em pedaço silenciosamente — e senha
 * gerada por painel de hospedagem tem `#` com frequência.
 *
 * @return array<string, string>
 */
function env_arquivo(): array
{
    static $valores = null;

    if ($valores !== null) {
        return $valores;
    }

    $valores = [];
    $caminho = __DIR__ . '/../../.env';

    if (!is_readable($caminho)) {
        return $valores;
    }

    foreach (file($caminho, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $linha) {
        $linha = trim($linha);

        // Comentário só vale quando é a linha inteira
        if ($linha === '' || str_starts_with($linha, '#')) {
            continue;
        }

        // Divide no PRIMEIRO "=": a senha pode conter "=" e precisa sobreviver inteira
        $partes = explode('=', $linha, 2);

        if (count($partes) !== 2) {
            continue;
        }

        $chave = trim($partes[0]);
        $valor = trim($partes[1]);

        // Remove aspas envolventes, se houver: DB_PASS="a b c" → a b c
        if (strlen($valor) >= 2 && ($valor[0] === '"' || $valor[0] === "'") && $valor[-1] === $valor[0]) {
            $valor = substr($valor, 1, -1);
        }

        $valores[$chave] = $valor;
    }

    return $valores;
}

/**
 * Devolve uma configuração, procurando na ordem: ambiente → $_SERVER → .env → padrão.
 */
function env(string $chave, string $padrao = ''): string
{
    $valor = getenv($chave);

    if ($valor !== false && $valor !== '') {
        return $valor;
    }

    if (!empty($_SERVER[$chave])) {
        return (string) $_SERVER[$chave];
    }

    return env_arquivo()[$chave] ?? $padrao;
}
