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

        if ($valor !== '' && ($valor[0] === '"' || $valor[0] === "'")) {
            // Entre aspas vale tudo até a aspa de fechamento (inclusive "#"):
            // DB_PASS="a#b c"  # comentário → a#b c
            $fim   = strpos($valor, $valor[0], 1);
            $valor = $fim === false ? substr($valor, 1) : substr($valor, 1, $fim - 1);
        } else {
            // Sem aspas, " #" começa um comentário no fim da linha:
            // MAIL_ENCRYPTION=tls   # tls = STARTTLS → tls. Um "#" colado ao valor
            // (senha gerada por painel) continua fazendo parte dele.
            // Linha só com espaço e comentário depois do "=" é valor vazio.
            $valor = preg_match('/^\s+#/', $partes[1])
                ? ''
                : rtrim((string) preg_replace('/\s+#.*$/', '', $valor));
        }

        $valores[$chave] = $valor;
    }

    return $valores;
}

/**
 * Devolve uma configuração, procurando na ordem: ambiente → $_SERVER → .env → padrão.
 * Valor vazio conta como ausente (MAIL_FROM_ADDRESS= usa o padrão).
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

    $valor = env_arquivo()[$chave] ?? '';

    return $valor !== '' ? $valor : $padrao;
}

// Fuso único da aplicação. O PHP usa UTC por padrão e o MySQL usa o fuso do
// servidor (-03): sem alinhar os dois, datas geradas no PHP (validade do código
// de senha, "hoje" da sequência, semanas do progresso) não batiam com NOW() e
// CURDATE(). db.php aplica o mesmo fuso na conexão.
if (!@date_default_timezone_set(env('APP_TIMEZONE', 'America/Sao_Paulo'))) {
    date_default_timezone_set('America/Sao_Paulo');
}
