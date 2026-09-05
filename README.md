# Como rodar o FluencyLab

Guia para começar a desenvolver depois de baixar a branch `develop`.

O projeto tem duas partes que rodam **ao mesmo tempo, em dois terminais**:

| Parte | O que é | Onde roda |
| --- | --- | --- |
| Backend | API em PHP puro | `http://localhost:8000` |
| Frontend | Next.js | `http://localhost:3000` |

O banco de dados **não roda na sua máquina** — é um MySQL compartilhado na
nuvem. Todo mundo usa o mesmo, então o schema já vem pronto e ninguém precisa
criar tabela nenhuma.

---

## 1. Pré-requisitos

| | Versão | Como conferir |
| --- | --- | --- |
| PHP | 8.1 ou superior, com a extensão `pdo_mysql` | `php -v` e `php -m` |
| Node.js | 20 ou superior | `node -v` |
| Git | qualquer | `git --version` |

**macOS:** se faltar o PHP, `brew install php`.

**Windows:** o XAMPP já traz PHP com `pdo_mysql` habilitado. Não precisa ligar o
Apache nem o MySQL dele — só o executável do PHP é usado.

---

## 2. Configuração (uma vez só)

Estes três passos são iguais nos dois sistemas. Rode na raiz do projeto.

### 2.1. Credenciais do banco

```bash
cp .env.example .env
```

No Windows (PowerShell/cmd): `copy .env.example .env`

Abra o `.env` e preencha `DB_NAME`, `DB_USER` e `DB_PASS` com as credenciais do
banco compartilhado. O `DB_HOST` já vem preenchido.

> As credenciais não estão no Git de propósito. Peça para quem já tem.

### 2.2. Endereço da API para o frontend

```bash
cd frontend
cp .env.example .env.local
cd ..
```

Não precisa editar — o conteúdo padrão já está certo.

### 2.3. Dependências do frontend

```bash
cd frontend
npm install
cd ..
```

---

## 3. Rodando

Precisa de **dois terminais abertos ao mesmo tempo**.

### Terminal 1 — backend

**macOS / Linux:**

```bash
./scripts/dev-backend.sh
```

**Windows (PowerShell ou cmd):**

```
scripts\dev-backend.cmd
```

O script encontra o PHP sozinho. Se ele reclamar que não achou, veja
[Problemas comuns](#5-problemas-comuns).

### Terminal 2 — frontend

```bash
cd frontend
npm run dev
```

Abra <http://localhost:3000>.

---

## 4. Conferindo que funcionou

Com os dois terminais rodando, num terceiro:

```bash
curl http://localhost:8000/api/auth/me.php
```

A resposta certa é:

```json
{"error":"Não autenticado"}
```

Parece erro, mas é o que você quer ver: significa que o PHP subiu, leu o `.env`,
conectou no banco e respondeu. "Não autenticado" só quer dizer que você ainda
não fez login.

Depois disso, crie uma conta em <http://localhost:3000/register> e navegue.

---

## 5. Problemas comuns

### "não encontrei o PHP" (mais comum no Windows)

O terminal não sabe onde o PHP está. Duas saídas:

**Rápida** — abra o `.env` e aponte o caminho:

```
PHP_BIN=C:\xampp\php\php.exe
```

**Definitiva** — adicione `C:\xampp\php` ao PATH do Windows
(Configurações → Variáveis de Ambiente). Aí `php` passa a funcionar em qualquer
terminal, neste projeto e em qualquer outro.

### `{"error":"Configuração do banco ausente..."}`

Falta o `.env` na raiz, ou ele está sem `DB_NAME`/`DB_USER`/`DB_PASS`.
Volte ao [passo 2.1](#21-credenciais-do-banco).

### O frontend carrega mas nenhum dado aparece

Provavelmente falta o `frontend/.env.local` ([passo 2.2](#22-endereço-da-api-para-o-frontend)).
Confirme no DevTools → Network se as chamadas estão indo para `undefined/...`.

Se você criou o arquivo com o `npm run dev` já rodando, **reinicie o servidor**.
Variáveis `NEXT_PUBLIC_` entram no bundle na hora do build — recarregar a página
não adianta.

### "Address already in use" / porta ocupada

Alguma coisa já está usando a 3000 ou a 8000.

```bash
# macOS/Linux — descobrir quem
lsof -nP -iTCP:8000 -sTCP:LISTEN
```

```
REM Windows
netstat -ano | findstr :8000
```

Feche o processo, ou suba o backend em outra porta:
`./scripts/dev-backend.sh 8001` — e ajuste o `frontend/.env.local` para a mesma
porta.

### Timeout ao conectar no banco

O provedor pode exigir liberação do seu IP. Confirme com quem administra o
banco se o seu endereço está autorizado.

---

## 6. Trabalhando com o banco compartilhado

**Todos escrevem no mesmo banco.** O que você apagar some para todo mundo, na
hora. Não existe "meus dados de teste".

Combinem antes de rodar `DELETE`, `DROP` ou `UPDATE` sem `WHERE`.

### Alterando a estrutura

O [`backend/sql/schema.sql`](backend/sql/schema.sql) é a fonte de verdade da
estrutura. Ele pode ser rodado várias vezes sem quebrar.

**Uma pessoa aplica, e vale para todos:**

```bash
mysql -h fluencylab.mysql.dbaas.com.br -u SEU_USUARIO -p \
  --default-character-set=utf8mb4 SEU_BANCO < backend/sql/schema.sql
```

> **Cuidado com colunas novas.** `CREATE TABLE IF NOT EXISTS` **não altera**
> tabela que já existe. Se você adicionar uma coluna no `schema.sql` e
> reaplicar, nada acontece e **nenhum erro aparece** — o bug só surge depois, em
> runtime. Para colunas novas, rode também o `ALTER TABLE` correspondente e
> mantenha a coluna no `schema.sql` para quem criar o banco do zero.

---

## 7. Rotina do dia a dia

```bash
git pull
cd frontend && npm install && cd ..   # só se o package.json tiver mudado
```

Depois suba os dois terminais como no [passo 3](#3-rodando).

Se alguém avisar que mexeu no `schema.sql`, você não precisa fazer nada: o banco
é compartilhado e a mudança já está aplicada.

---

## 8. Caminho alternativo: tudo em Docker

Existe uma configuração completa em Docker, com **banco local próprio** — útil
para trabalhar sem internet ou para testar sem afetar os outros.

```bash
docker compose up -d --build
```

Sobe MySQL, backend e frontend. Na primeira vez o schema é aplicado
automaticamente. Para recriar o banco local do zero:

```bash
./scripts/db-reset.sh
```

O `db-reset.sh` age **só** no container — ele não tem como tocar no banco
compartilhado.

Nesse modo você não precisa do `.env`; as credenciais do container são fixas.