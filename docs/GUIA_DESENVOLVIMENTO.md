# Guia de Desenvolvimento — Backend FluencyLab

> 👉 **Quer ir logo pro código?** Acesse o **[site de tarefas guiadas](tarefas/index.html)** — uma página por tarefa, em ordem, passo a passo. Este documento cobre ambiente, convenções e organização do time.

---

## 1. Introdução

O time é composto por 4 pessoas. O backend é em **PHP puro** (sem framework) + MySQL. O frontend já existe em Next.js. A comunicação entre eles é via requisições HTTP com JSON — o frontend chama endpoints PHP, o PHP responde com JSON.

**Stack do backend:**
- PHP 8.4 (Apache, via Docker)
- MySQL local (XAMPP/MAMP — sem container separado)
- Sem Composer, sem frameworks — PHP e as funções nativas já são o suficiente

---

## 2. Visão geral da arquitetura

```
Navegador → Next.js (porta 3000) → PHP/Apache (porta 8000) → MySQL (porta 3306)
```

- **frontend/** — Next.js, serve a interface que o usuário vê.
- **backend/** — PHP, serve JSON pra qualquer chamada do Next.js.
- **docker-compose.yml** — orquestra os 3 containers (MySQL + PHP + Next.js).

---

## 3. Estrutura do backend

```
backend/
├── Dockerfile               # php:8.4-apache + extensão pdo_mysql
├── api/
│   ├── cors.php             # CORS + session_start() + json_out() — INCLUDE EM TODO ENDPOINT
│   ├── db.php               # conexão PDO — INCLUDE EM TODO ENDPOINT QUE USA BANCO
│   ├── auth/
│   │   ├── register.php     # POST /api/auth/register.php
│   │   ├── login.php        # POST /api/auth/login.php
│   │   ├── logout.php       # POST /api/auth/logout.php
│   │   └── me.php           # GET  /api/auth/me.php — usuário da sessão (ou 401)
│   ├── profile.php          # GET/PUT /api/profile.php
│   ├── courses.php          # GET /api/courses.php + GET /api/courses.php?slug=X
│   ├── practice/
│   │   ├── phrases.php      # GET /api/practice/phrases.php
│   │   ├── check-answer.php # POST /api/practice/check-answer.php
│   │   └── AiService.php    # classe PHP que chama OpenAI via cURL
│   ├── user/
│   │   ├── stats.php        # GET /api/user/stats.php
│   │   ├── progress-weekly.php
│   │   └── calendar.php
│   ├── ranking.php          # GET /api/ranking.php
│   ├── plans.php            # GET /api/plans.php
│   ├── plans-subscribe.php  # POST /api/plans-subscribe.php
│   └── admin/               # Todos exigem role = 'admin' na sessão
│       ├── stats.php
│       ├── users.php
│       └── phrases.php
└── sql/
    └── schema.sql           # CREATE TABLE + dados iniciais
```

---

## 4. Ambiente de desenvolvimento

### Pré-requisitos
- Docker Desktop instalado e rodando.
- XAMPP ou MAMP com MySQL rodando localmente na porta 3306.
- Git.

### Primeiro setup

```bash
git clone git@github.com:vbos7/FluencyLab.git
cd FluencyLab
```

**1. Criar o banco e o usuário no MySQL local (XAMPP/MAMP)**

Abra o phpMyAdmin ou o terminal do MySQL local e execute:

```sql
CREATE DATABASE IF NOT EXISTS fluency_lab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'php_user'@'%' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON fluency_lab.* TO 'php_user'@'%';
FLUSH PRIVILEGES;
```

**2. Importar o schema (tabelas + dados iniciais)**

```bash
# No terminal da sua máquina (não dentro do Docker):
mysql --default-character-set=utf8mb4 -u php_user -psecret fluency_lab < backend/sql/schema.sql
```

> Se preferir, importe pelo phpMyAdmin: selecione o banco `fluency_lab` → Importar → escolha `backend/sql/schema.sql`.

**3. Subir os containers**

```bash
docker compose up --build -d

# Acesso:
# Frontend: http://localhost:3000
# API PHP:  http://localhost:8000
# Health:   http://localhost:8000 (deve retornar JSON com "status":"ok")
```

### Comandos do dia a dia

```bash
# Subir containers (sem rebuild se o código não mudou)
docker compose up -d

# Parar tudo
docker compose down

# Ver logs do PHP
docker compose logs -f backend

# Testar um endpoint no terminal
curl -s http://localhost:8000/api/courses.php
curl -s -X POST http://localhost:8000/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@test.com","password":"123456"}'
```

### Atenção: charset obrigatório

**Sempre** use `--default-character-set=utf8mb4` ao importar SQL, senão os acentos ficam corrompidos no banco.

---

## 5. Padrão de todo endpoint PHP

```php
<?php
require_once __DIR__ . '/cors.php';   // (ou '/../cors.php' se estiver em subpasta)
require_once __DIR__ . '/db.php';

// 1. Verificar método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

// 2. Verificar sessão (quando necessário)
if (!isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);
    exit;
}

// 3. Ler body JSON (para POST/PUT)
$body = json_decode(file_get_contents('php://input'), true);

// 4. Consulta com prepared statement (NUNCA concatene variáveis no SQL!)
$stmt = $pdo->prepare("SELECT * FROM tabela WHERE campo = ?");
$stmt->execute([$valor]);
$resultado = $stmt->fetchAll();

// 5. Responder
json_out($resultado);
```

---

## 6. Convenções de código

- **Tabelas**: plural, snake_case (`users`, `ranking_points`).
- **Endpoints**: arquivo PHP por recurso, sem extensões desnecessárias na URL.
- **Prepared statements**: sempre. Nunca concatene strings do usuário em SQL.
- **json_out()**: sempre (não use `echo json_encode()` direto — a função garante encoding correto).
- **Sessão**: guarde só `user_id` e `role` em `$_SESSION`. Nada mais.
- **Senhas**: sempre `password_hash()` para criar, `password_verify()` para verificar. Nunca MD5/SHA1.

---

## 7. Padrão de commits e branches

Mantemos o mesmo padrão do frontend (já estabelecido):

- **Commits**: Conventional Commits — `feat:`, `fix:`, `chore:`, `docs:`.
- **Branches**: `feature/LAB-XX-descricao`.
- **Merge**: via Pull Request no GitHub, com revisão de pelo menos uma pessoa.

---

## 8. Divisão de tarefas

**Aluno A — Auth + Perfil + Admin**
`api/auth/`, `api/profile.php`, `api/admin/`, `sql/schema.sql`, `api/cors.php`, `api/db.php`

**Aluno B — Cursos + Aulas**
`api/courses.php` — inclui listar cursos, buscar detalhe com aulas (JOIN), inserir dados.

**Aluno C — Prática + IA**
`api/practice/` — listar frases, `AiService.php` (cURL → OpenAI), submeter tradução.

**Aluno D — Progresso + Ranking + Planos**
`api/user/`, `api/ranking.php`, `api/plans.php`, `api/plans-subscribe.php` — foco em queries SQL com COUNT, SUM, GROUP BY, JOIN.

### Sprints sugeridas

- **Sprint 1** (paralelo): A implementa auth completo; B cria tabelas e insere dados de cursos/aulas; C cria a tabela phrases e insere as frases; D alinha com C o formato de `attempts` (pois Progress/Ranking depende disso).
- **Sprint 2**: C implementa o `AiService` e `check-answer.php`; D implementa os endpoints de stats/ranking/planos; A implementa perfil e admin; B finaliza detalhe do curso.
- **Sprint 3** (integração): cada um conecta seus endpoints no frontend (tarefas 24-36 do site de tarefas), começando pela tarefa 24 (setup do axios + fetchFromApi).

---

## 9. Modelagem de dados

| Tabela | Campos principais | FK |
|---|---|---|
| `users` | id, name, email, password_hash, role | — |
| `courses` | id, slug, title, description, level, order_num | — |
| `lessons` | id, course_id, title, duration, youtube_id, order_num | → courses |
| `phrases` | id, pt, en, difficulty, category | — |
| `attempts` | id, user_id, phrase_id, answer_given, ai_feedback(JSON), is_correct, score, xp_earned | → users, phrases |
| `ranking_points` | id, user_id, points, reason, earned_at | → users |
| `plans` | id, name, price, description, features(JSON), billing_period | — |
| `user_plan` | id, user_id, plan_id, started_at, expires_at, status | → users, plans |

---

## 10. FAQ / Problemas comuns

**Acentos corrompidos no banco ("InglÃ©s" em vez de "Inglês")**
Você importou SQL sem `--default-character-set=utf8mb4`. Resetar o banco e reimportar com o flag correto.

**"Access denied for user php_user"**
Crie o usuário no MySQL local: `CREATE USER IF NOT EXISTS 'php_user'@'%' IDENTIFIED BY 'secret'; GRANT ALL ON fluency_lab.* TO 'php_user'@'%'; FLUSH PRIVILEGES;`

**CORS — erro "blocked by CORS policy"**
Confirme que o `cors.php` está sendo incluído no arquivo do endpoint, E que o frontend usa `withCredentials: true` no axios.

**Cookie PHPSESSID não está sendo enviado**
Confirme `withCredentials: true` no `apiClient` (tarefa 24). No DevTools → Network, veja se o request tem o header `Cookie: PHPSESSID=...`.

---

## 11. Fase 2 / próximos passos

- L5-Swagger / documentação de API
- Testes automatizados com PHPUnit
- Hashing mais forte (Argon2) para senhas
- Rate limiting para evitar abuso das chamadas à OpenAI
