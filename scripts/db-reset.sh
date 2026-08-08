#!/usr/bin/env bash
#
# Recria o banco local a partir do backend/sql/schema.sql.
#
<<<<<<< HEAD
# ATENÇÃO: age SÓ no container do docker compose, nunca no banco compartilhado.
# Os valores abaixo são fixos justamente para isso — o script não lê o .env,
# então não tem como apontar sem querer para o banco que os outros usam.
#
# Para aplicar o schema no banco COMPARTILHADO, veja o README.
=======
# Rode isto sempre que der pull e o schema.sql tiver mudado. O banco é dropado
# e recriado do zero — é o que garante que a estrutura fique idêntica em todas
# as máquinas, incluindo colunas adicionadas depois.
>>>>>>> a55ceeb (feat: adicionar arquivo .env.example, configurar docker-compose e script de reset do banco)
#
# Uso:
#   ./scripts/db-reset.sh        # pede confirmação
#   ./scripts/db-reset.sh -y     # sem perguntar
#
set -euo pipefail

cd "$(dirname "$0")/.."

<<<<<<< HEAD
DB_NAME="fluency_lab"
DB_PASS="root"
=======
if [ -f .env ]; then
    set -a
    . ./.env
    set +a
fi

DB_NAME="${DB_NAME:-fluency_lab}"
DB_PASS="${DB_PASS:-root}"
>>>>>>> a55ceeb (feat: adicionar arquivo .env.example, configurar docker-compose e script de reset do banco)

if [ "${1:-}" != "-y" ]; then
    echo "Isto APAGA todos os dados do banco local '${DB_NAME}' e recria a partir do schema.sql."
    read -r -p "Continuar? [y/N] " resposta
    case "$resposta" in
        [yY]) ;;
        *) echo "Cancelado."; exit 0 ;;
    esac
fi

# MYSQL_PWD em vez de -p na linha de comando: evita o aviso
# "Using a password on the command line interface can be insecure".
mysql_exec() {
    docker compose exec -T -e MYSQL_PWD="$DB_PASS" mysql \
        mysql --default-character-set=utf8mb4 -uroot "$@"
}

echo "→ Recriando o banco ${DB_NAME}..."
mysql_exec -e "DROP DATABASE IF EXISTS \`${DB_NAME}\`;
               CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo "→ Aplicando backend/sql/schema.sql..."
mysql_exec "$DB_NAME" < backend/sql/schema.sql

echo "→ Tabelas criadas:"
mysql_exec "$DB_NAME" -e "SHOW TABLES;"

echo "Pronto."
