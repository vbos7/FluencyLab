#!/usr/bin/env bash
#
# Recria o banco do MySQL instalado NA MÁQUINA (Homebrew/XAMPP) com schema e seeds.
# Para o banco do docker compose, use o db-reset.sh.
#
# ATENÇÃO: age SÓ em 127.0.0.1. Os valores são fixos de propósito — o script não
# lê o .env, então não tem como apontar sem querer para o banco do Forge.
# Para o backend usar este banco, o .env da raiz precisa de:
#   DB_HOST=127.0.0.1  DB_PORT=3306  DB_NAME=fluency_lab  DB_USER=root  DB_PASS=
#
# Usuários do seed: <email>@seed.fluencylab.com e demo@fluencylab.com, senha 123456.
# Nenhum é admin. Para ter um admin local, crie sua conta em /register e rode:
#   mysql -uroot fluency_lab -e "UPDATE users SET role='admin' WHERE email='seu@email'"
#
# Uso:
#   ./scripts/db-local-reset.sh        # pede confirmação
#   ./scripts/db-local-reset.sh -y     # sem perguntar
#
set -euo pipefail

cd "$(dirname "$0")/.."

DB_HOST="127.0.0.1"
DB_NAME="fluency_lab"
DB_USER="root"

if [ "${1:-}" != "-y" ]; then
    echo "Isto APAGA todos os dados do banco '${DB_NAME}' em ${DB_HOST} e recria com schema e seeds."
    read -r -p "Continuar? [y/N] " resposta
    case "$resposta" in
        [yY]) ;;
        *) echo "Cancelado."; exit 0 ;;
    esac
fi

mysql_exec() {
    mysql --default-character-set=utf8mb4 -h "$DB_HOST" -u "$DB_USER" "$@"
}

echo "→ Recriando o banco ${DB_NAME}..."
mysql_exec -e "DROP DATABASE IF EXISTS \`${DB_NAME}\`;
               CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

for arquivo in schema seed-phrases seed-users; do
    echo "→ Aplicando backend/sql/${arquivo}.sql..."
    mysql_exec "$DB_NAME" < "backend/sql/${arquivo}.sql" > /dev/null
done

# O schema.sql gera as tentativas do aluno demo a partir da primeira frase, mas
# na primeira passada a tabela phrases ainda está vazia (as frases vêm do
# seed-phrases.sql). Reaplicar — o schema é idempotente — completa o demo.
echo "→ Reaplicando o schema.sql para completar o aluno demo..."
mysql_exec "$DB_NAME" < backend/sql/schema.sql > /dev/null

echo "→ Contagens:"
mysql_exec "$DB_NAME" -e "
    SELECT 'usuários' AS tabela, COUNT(*) AS total FROM users
    UNION ALL SELECT 'admins', COUNT(*) FROM users WHERE role = 'admin'
    UNION ALL SELECT 'frases', COUNT(*) FROM phrases
    UNION ALL SELECT 'aulas', COUNT(*) FROM lessons
    UNION ALL SELECT 'tentativas', COUNT(*) FROM attempts;"

echo "Pronto."
