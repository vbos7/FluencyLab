-- FluencyLab — Schema do banco de dados
--
<<<<<<< HEAD
-- Este arquivo é a fonte de verdade da estrutura do banco. Pode ser rodado
-- várias vezes sem quebrar (tabelas usam IF NOT EXISTS, seeds usam
-- ON DUPLICATE KEY UPDATE).
--
-- No banco COMPARTILHADO (DBaaS), aplique assim — uma pessoa roda, vale para todos:
--   mysql -h fluencylab.mysql.dbaas.com.br -u SEU_USUARIO -p \
--     --default-character-set=utf8mb4 SEU_BANCO < backend/sql/schema.sql
--
-- No banco local do docker compose:
--   ./scripts/db-reset.sh
--
-- ATENÇÃO À LIMITAÇÃO: "CREATE TABLE IF NOT EXISTS" não altera tabela que já
-- existe. Se você ADICIONAR UMA COLUNA aqui, ela não aparece num banco já
-- criado — rodar este arquivo não vai dar erro, simplesmente não faz nada, e o
-- bug só aparece em runtime. Nesse caso escreva também o ALTER TABLE:
--   ALTER TABLE users ADD COLUMN phone VARCHAR(20);
-- rode no compartilhado, e mantenha a coluna aqui para quem criar do zero.
--
-- Consequência disso que já mordeu: se o banco compartilhado tiver sido criado
-- ANTES de `plans.name` virar UNIQUE, os seeds duplicam a cada reaplicação.
-- Sintoma: SELECT COUNT(*) FROM plans devolve mais que 2. Correção, uma vez só:
--   DELETE p1 FROM plans p1 JOIN plans p2 ON p1.name = p2.name AND p1.id > p2.id;
--   ALTER TABLE plans ADD UNIQUE (name);
=======
-- Este arquivo é a ÚNICA fonte de verdade do banco. Não altere tabelas na mão:
-- edite aqui, commite, e cada aluno roda o comando abaixo depois do pull.
--
--   ./scripts/db-reset.sh
--
-- O script dropa o banco e roda este arquivo do zero. Parece agressivo, mas é
-- o que garante que a estrutura fique igual em todas as máquinas: um
-- "CREATE TABLE IF NOT EXISTS" NÃO adiciona coluna nova em tabela que já
-- existe — ele simplesmente não faz nada, e o erro só aparece em runtime.
--
-- Como o banco está sempre vazio quando este arquivo roda, os INSERTs do fim
-- não precisam de proteção contra duplicata.
--
-- Na primeira vez você nem precisa do script: o docker-compose monta este
-- arquivo em /docker-entrypoint-initdb.d/, então o `docker compose up` já
-- sobe com o banco pronto.
>>>>>>> a55ceeb (feat: adicionar arquivo .env.example, configurar docker-compose e script de reset do banco)

-- Declara o encoding DESTE arquivo para o servidor. Sem isto, o cliente mysql
-- assume latin1 quando roda sem locale definido (é o caso do init automático
-- do container) e converte os bytes UTF-8 mais uma vez, gravando "InglÃªs"
-- no lugar de "Inglês". Tem que vir antes de qualquer INSERT com acento.
SET NAMES utf8mb4;

-- ─── MÓDULO A — Auth/Perfil ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100)  NOT NULL,
    email        VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone        VARCHAR(20),
    role         ENUM('student','admin') NOT NULL DEFAULT 'student',
    created_at   DATETIME      DEFAULT CURRENT_TIMESTAMP
);

-- ─── MÓDULO B — Cursos/Aulas ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS courses (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    slug        VARCHAR(50)  NOT NULL UNIQUE,   -- "basico", "intermediario", "avancado"
    title       VARCHAR(100) NOT NULL,
    description TEXT,
    level       ENUM('basico','intermediario','avancado') NOT NULL,
    order_num   INT          DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lessons (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    course_id  INT          NOT NULL,
    title      VARCHAR(100) NOT NULL,
    duration   VARCHAR(20),                     -- "8:08", "10:30" etc.
    youtube_id VARCHAR(50),
    order_num  INT          DEFAULT 0,
    -- FOREIGN KEY: toda lesson DEVE ter um course válido.
    -- ON DELETE CASCADE: se o curso for apagado, as aulas dele somem junto.
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ─── MÓDULO C — Prática/IA ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS phrases (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    pt         TEXT NOT NULL,                   -- frase em português
    en         TEXT NOT NULL,                   -- tradução de referência (usada pela IA)
    difficulty ENUM('easy','medium','hard') NOT NULL,
    category   VARCHAR(50) NOT NULL             -- "Cotidiano", "Trabalho", "Viagem" etc.
);

CREATE TABLE IF NOT EXISTS attempts (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT          NOT NULL,
    phrase_id   INT          NOT NULL,
    answer_given TEXT        NOT NULL,           -- tradução que o aluno digitou
    ai_feedback JSON,                            -- resposta completa da IA (JSON)
    is_correct  TINYINT(1)  NOT NULL,            -- 1 = correto, 0 = errado
    score       TINYINT UNSIGNED NOT NULL,       -- 0 a 100 (nota da IA)
    xp_earned   SMALLINT UNSIGNED NOT NULL,      -- XP ganho nessa tentativa
    created_at  DATETIME    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (phrase_id) REFERENCES phrases(id) ON DELETE CASCADE
);

-- ─── MÓDULO D — Progresso/Ranking/Planos ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS ranking_points (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id   INT          NOT NULL,
    points    SMALLINT UNSIGNED NOT NULL,
    reason    VARCHAR(100),                      -- "Exercício correto", "Bônus streak" etc.
    earned_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS plans (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    -- UNIQUE para o seed lá embaixo poder usar ON DUPLICATE KEY UPDATE
    name           VARCHAR(50)    NOT NULL UNIQUE,
    price          DECIMAL(10,2)  NOT NULL,
    description    TEXT,
    features       JSON,                         -- lista de features incluídas
    billing_period ENUM('monthly','lifetime') NOT NULL
);

CREATE TABLE IF NOT EXISTS user_plan (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT  NOT NULL,
    plan_id    INT  NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NULL,                    -- NULL = vitalício
    status     ENUM('active','canceled','expired') NOT NULL DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- ─── Dados iniciais ───────────────────────────────────────────────────────────

<<<<<<< HEAD
-- Nada de TRUNCATE: o MySQL recusa truncar tabela referenciada por foreign key
-- (erro 1701), e `plans` e `courses` são referenciadas por `user_plan` e `lessons`.
--
-- ON DUPLICATE KEY UPDATE em vez de INSERT puro para o arquivo poder rodar de
-- novo sem quebrar: na primeira vez insere, nas seguintes atualiza o conteúdo.
-- É o que permite corrigir um texto de curso aqui e reaplicar no banco
-- compartilhado sem duplicar linha nem dar erro 1062.
=======
-- Nada de TRUNCATE aqui: o MySQL recusa truncar tabela referenciada por uma
-- foreign key (erro 1701), e tanto `plans` quanto `courses` são referenciadas
-- por `user_plan` e `lessons`. Como o db-reset.sh sempre roda com o banco
-- recém-criado, não há duplicata possível.
>>>>>>> a55ceeb (feat: adicionar arquivo .env.example, configurar docker-compose e script de reset do banco)

INSERT INTO courses (slug, title, description, level, order_num) VALUES
('basico',       'Inglês Básico',        'Vocabulário essencial, cumprimentos e frases do dia a dia.',        'basico',       1),
('intermediario','Inglês Intermediário', 'Gramática, tempos verbais e conversação mais fluente.',             'intermediario',2),
('avancado',     'Inglês Avançado',      'Expressões idiomáticas, escrita formal e fluência avançada.',       'avancado',     3)
ON DUPLICATE KEY UPDATE
    title = VALUES(title), description = VALUES(description),
    level = VALUES(level), order_num = VALUES(order_num);

INSERT INTO plans (name, price, description, billing_period) VALUES
('Free', 0.00, 'Acesso gratuito com recursos básicos', 'monthly'),
('Pro',  4.99, 'Acesso completo vitalício',            'lifetime')
ON DUPLICATE KEY UPDATE
    price = VALUES(price), description = VALUES(description),
    billing_period = VALUES(billing_period);
