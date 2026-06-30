-- FluencyLab — Schema do banco de dados
--
-- IMPORTANTE: use a flag --default-character-set=utf8mb4 para evitar
-- problemas de encoding com acentos no MySQL!
--
-- Execute com (IMPORTANTE: a flag charset deve vir logo após "mysql"):
--   docker compose exec -T mysql mysql --default-character-set=utf8mb4 \
--     -u root -proot fluency_lab < backend/sql/schema.sql
--
-- Para resetar o banco do zero (apaga tudo e recria):
--   docker compose exec mysql mysql -u root -proot \
--     -e "DROP DATABASE IF EXISTS fluency_lab; CREATE DATABASE fluency_lab;"
--   e rode o schema de novo com o comando acima.

-- ─── MÓDULO A — Auth/Perfil ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100)  NOT NULL,
    email        VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
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
    name           VARCHAR(50)    NOT NULL,
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

-- TRUNCATE para evitar duplicatas em re-execuções
TRUNCATE TABLE plans;
TRUNCATE TABLE courses;

INSERT INTO courses (slug, title, description, level, order_num) VALUES
('basico',       'Inglês Básico',        'Vocabulário essencial, cumprimentos e frases do dia a dia.',        'basico',       1),
('intermediario','Inglês Intermediário', 'Gramática, tempos verbais e conversação mais fluente.',             'intermediario',2),
('avancado',     'Inglês Avançado',      'Expressões idiomáticas, escrita formal e fluência avançada.',       'avancado',     3);

INSERT INTO plans (name, price, description, billing_period) VALUES
('Free', 0.00, 'Acesso gratuito com recursos básicos', 'monthly'),
('Pro',  4.99, 'Acesso completo vitalício',            'lifetime');
