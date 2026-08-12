#!/usr/bin/env bash
#
# Sobe o backend PHP no terminal, servindo a pasta backend/.
#
# Uso: ./scripts/dev-backend.sh          (ou: ./scripts/dev-backend.sh 8001)
#
# No outro terminal, o frontend:  cd frontend && npm run dev
#
# Windows: use o scripts\dev-backend.cmd no PowerShell/cmd.
# Este arquivo funciona no Git Bash.
#
set -euo pipefail

cd "$(dirname "$0")/.."

PORTA="${1:-8000}"

if [ ! -f .env ]; then
    echo "Erro: .env não encontrado na raiz." >&2
    echo "Rode:  cp .env.example .env    e preencha as credenciais do banco." >&2
    exit 1
fi

# Descobre o binário do PHP, nesta ordem:
#   1. PHP_BIN definido no .env  — para quem tem o PHP fora do PATH (típico do XAMPP)
#   2. `php` no PATH             — macOS/Linux, e Windows com o PATH configurado
#   3. caminhos padrão do XAMPP  — último recurso, evita erro logo no primeiro dia
if [ -z "${PHP_BIN:-}" ]; then
    PHP_BIN=$(grep -E '^[[:space:]]*PHP_BIN=' .env 2>/dev/null | tail -1 | cut -d= -f2- | tr -d '"'"'" || true)
fi

if [ -z "${PHP_BIN:-}" ]; then
    if command -v php > /dev/null 2>&1; then
        PHP_BIN=php
    else
        for candidato in /c/xampp/php/php.exe /d/xampp/php/php.exe "/c/Program Files/php/php.exe"; do
            if [ -x "$candidato" ]; then
                PHP_BIN="$candidato"
                break
            fi
        done
    fi
fi

if [ -z "${PHP_BIN:-}" ]; then
    echo "Erro: não encontrei o PHP." >&2
    echo "Defina o caminho no .env, por exemplo:" >&2
    echo '  PHP_BIN=C:\xampp\php\php.exe' >&2
    exit 1
fi

# O servidor embutido do PHP atende UMA requisição por vez por padrão. Durante o
# SSR o Next dispara várias chamadas à API na mesma página, e elas ficariam em
# fila. Com workers elas rodam em paralelo.
export PHP_CLI_SERVER_WORKERS=4

echo "PHP: ${PHP_BIN}"
echo "Backend em http://localhost:${PORTA}  (Ctrl+C para parar)"
echo "Teste rápido: curl http://localhost:${PORTA}/api/auth/me.php"

exec "$PHP_BIN" -S "localhost:${PORTA}" -t backend
