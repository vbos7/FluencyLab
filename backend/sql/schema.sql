-- FluencyLab — Schema do banco de dados
--
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
    -- Caminho/URL do avatar (só o painel admin usa por enquanto).
    avatar       VARCHAR(255)  NULL,
    -- 2FA (TOTP) — só admins ativam. O segredo fica CIFRADO em repouso
    -- (libsodium + APP_KEY); os códigos de recuperação são guardados como
    -- HASHes (JSON). confirmed_at != NULL significa 2FA ativo e verificado.
    two_factor_secret          TEXT      NULL,
    two_factor_recovery_codes  TEXT      NULL,
    two_factor_confirmed_at    DATETIME  NULL,
    created_at   DATETIME      DEFAULT CURRENT_TIMESTAMP
);

-- Passkeys (WebAuthn/FIDO2) do login próprio do painel admin. Um usuário pode
-- ter vários dispositivos. credential_id é o id binário cru devolvido pelo
-- autenticador; public_key é o PEM usado para validar as assinaturas no login.
CREATE TABLE IF NOT EXISTS webauthn_credentials (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT             NOT NULL,
    credential_id VARBINARY(255)  NOT NULL UNIQUE,
    public_key    TEXT            NOT NULL,
    sign_count    INT UNSIGNED    NOT NULL DEFAULT 0,
    name          VARCHAR(100)    NULL,          -- apelido do dispositivo ("MacBook", "iPhone")
    created_at    DATETIME        DEFAULT CURRENT_TIMESTAMP,
    last_used_at  DATETIME        NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    duration   INT          NOT NULL DEFAULT 0,  -- duração em SEGUNDOS (o front formata p/ "8:08")
    youtube_id VARCHAR(50),
    is_free    TINYINT(1)   NOT NULL DEFAULT 0,  -- 1 = aula liberada p/ todos; 0 = só assinante Pro
    order_num  INT          DEFAULT 0,
    -- Uma aula por (curso, posição). Além de organizar, permite o seed lá embaixo
    -- usar ON DUPLICATE KEY UPDATE e reaplicar sem duplicar aula.
    UNIQUE KEY uq_lessons_course_order (course_id, order_num),
    -- FOREIGN KEY: toda lesson DEVE ter um course válido.
    -- ON DELETE CASCADE: se o curso for apagado, as aulas dele somem junto.
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Marca quais aulas cada usuário concluiu. Alimenta o progresso.php e a barra de
-- progresso na página do curso. O UNIQUE garante uma marcação por aula e faz o
-- INSERT IGNORE do endpoint funcionar (marcar 2x não duplica).
CREATE TABLE IF NOT EXISTS lesson_progress (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    lesson_id    INT NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_lesson_progress (user_id, lesson_id),
    FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- ─── MÓDULO C — Prática/IA ───────────────────────────────────────────────────

-- Categorias das frases, normalizadas numa tabela própria (antes era texto livre
-- repetido em phrases.category). O painel admin tem CRUD para elas.
CREATE TABLE IF NOT EXISTS categories (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE          -- "Cotidiano", "Trabalho", "Viagem" etc.
);

CREATE TABLE IF NOT EXISTS phrases (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    pt          TEXT NOT NULL,                  -- frase em português
    en          TEXT NOT NULL,                  -- tradução de referência (usada pela IA)
    difficulty  ENUM('easy','medium','hard') NOT NULL,
    category_id INT NOT NULL,                   -- FK para categories
    -- ON DELETE RESTRICT: não deixa apagar categoria que ainda tem frases.
    CONSTRAINT fk_phrases_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS attempts (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT          NOT NULL,
    phrase_id   INT          NOT NULL,
    answer_given TEXT        NOT NULL,           -- tradução que o aluno digitou
    -- Escalares do feedback da IA (1:1 com a tentativa). Os arrays (erros e
    -- pontos positivos) ficam em attempt_mistakes / attempt_positive_points.
    overall_comment    TEXT NULL,               -- comentário geral da IA
    corrected_sentence TEXT NULL,               -- versão corrigida sugerida
    is_correct  TINYINT(1)  NOT NULL,            -- 1 = correto, 0 = errado
    score       TINYINT UNSIGNED NOT NULL,       -- 0 a 100 (nota da IA)
    xp_earned   SMALLINT UNSIGNED NOT NULL,      -- XP ganho nessa tentativa
    time_spent_seconds INT UNSIGNED NOT NULL DEFAULT 0, -- tempo gasto no exercício (o dashboard soma isto)
    created_at  DATETIME    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (phrase_id) REFERENCES phrases(id) ON DELETE CASCADE
);

-- Erros apontados pela IA numa tentativa (array → tabela-filha). Muitos por tentativa.
CREATE TABLE IF NOT EXISTS attempt_mistakes (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id     INT NOT NULL,
    type           VARCHAR(100) NULL,           -- categoria do erro (ex.: "grammar")
    original       TEXT NULL,                   -- trecho errado do aluno
    suggestion     TEXT NULL,                   -- correção sugerida
    explanation_pt TEXT NULL,                   -- explicação em português
    FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE
);

-- Pontos positivos apontados pela IA (array → tabela-filha).
CREATE TABLE IF NOT EXISTS attempt_positive_points (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id INT NOT NULL,
    point      TEXT NOT NULL,
    FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE
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
    billing_period ENUM('monthly','lifetime') NOT NULL
);

-- Features de cada plano, normalizadas (antes era plans.features em JSON).
CREATE TABLE IF NOT EXISTS plan_features (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    plan_id   INT NOT NULL,
    label     VARCHAR(255) NOT NULL,
    included  TINYINT(1) NOT NULL DEFAULT 1,     -- 1 = incluída no plano; 0 = riscada
    highlight TINYINT(1) NOT NULL DEFAULT 0,     -- destaca a feature no card
    order_num INT NOT NULL DEFAULT 0,            -- ordem de exibição
    -- UNIQUE (plan_id, label) deixa o seed reaplicável com ON DUPLICATE KEY UPDATE.
    UNIQUE KEY uq_plan_features (plan_id, label),
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
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

-- Configurações globais da plataforma (chave/valor), usadas pelo painel admin.
-- Tudo é guardado como texto; o consumidor converte (ex.: "1"/"0" para boolean).
CREATE TABLE IF NOT EXISTS settings (
    setting_key   VARCHAR(50) PRIMARY KEY,
    setting_value TEXT
);

-- ─── Migrações para bancos JÁ existentes ─────────────────────────────────────
-- Os CREATE TABLE acima NÃO alteram tabela que já existe. Este bloco adiciona,
-- de forma idempotente (checando o information_schema antes), as colunas e
-- índices novos em bancos criados antes desta versão. É seguro rodar quantas
-- vezes quiser — quando a coluna já existe, o comando vira um "DO 0" (no-op).

-- lessons.is_free (usada por courses.php)
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lessons' AND COLUMN_NAME = 'is_free') = 0,
    'ALTER TABLE lessons ADD COLUMN is_free TINYINT(1) NOT NULL DEFAULT 0 AFTER youtube_id',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- lessons.duration: VARCHAR antigo → INT em segundos (o front trata como número)
SET @ddl := IF(
    (SELECT DATA_TYPE FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lessons' AND COLUMN_NAME = 'duration') <> 'int',
    'ALTER TABLE lessons MODIFY COLUMN duration INT NOT NULL DEFAULT 0',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- lessons: chave única (course_id, order_num) para o seed ser reaplicável
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lessons' AND INDEX_NAME = 'uq_lessons_course_order') = 0,
    'ALTER TABLE lessons ADD UNIQUE KEY uq_lessons_course_order (course_id, order_num)',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- attempts.time_spent_seconds (usada por dashboard.php)
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'attempts' AND COLUMN_NAME = 'time_spent_seconds') = 0,
    'ALTER TABLE attempts ADD COLUMN time_spent_seconds INT UNSIGNED NOT NULL DEFAULT 0 AFTER xp_earned',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- users.avatar (upload de foto no perfil admin)
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'avatar') = 0,
    'ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL AFTER role',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- users.two_factor_secret (segredo TOTP cifrado)
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'two_factor_secret') = 0,
    'ALTER TABLE users ADD COLUMN two_factor_secret TEXT NULL',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- users.two_factor_recovery_codes (JSON de hashes)
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'two_factor_recovery_codes') = 0,
    'ALTER TABLE users ADD COLUMN two_factor_recovery_codes TEXT NULL',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- users.two_factor_confirmed_at (2FA ativo quando != NULL)
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'two_factor_confirmed_at') = 0,
    'ALTER TABLE users ADD COLUMN two_factor_confirmed_at DATETIME NULL',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- ─── Normalização: JSON/texto → tabelas (categories, plan_features, feedback) ──
-- As tabelas novas já foram criadas pelos CREATE TABLE lá em cima. Este bloco
-- migra bancos ANTIGOS: popula as tabelas novas a partir das colunas velhas e
-- então dropa as colunas velhas. Cada passo é idempotente (checa o estado antes),
-- então rodar de novo num banco já migrado é no-op.

-- 1) categories: popula a partir das categorias distintas em phrases.category
--    (só enquanto a coluna antiga ainda existir).
SET @sql := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'phrases' AND COLUMN_NAME = 'category') = 1,
    'INSERT IGNORE INTO categories (name) SELECT DISTINCT category FROM phrases WHERE category IS NOT NULL AND category <> ''''',
    'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- 2) phrases.category_id: adiciona como NULL primeiro (p/ conviver com linhas antigas).
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'phrases' AND COLUMN_NAME = 'category_id') = 0,
    'ALTER TABLE phrases ADD COLUMN category_id INT NULL AFTER difficulty',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- 3) backfill do category_id casando pelo nome da categoria antiga.
SET @sql := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'phrases' AND COLUMN_NAME = 'category') = 1,
    'UPDATE phrases p JOIN categories c ON c.name = p.category SET p.category_id = c.id WHERE p.category_id IS NULL',
    'SELECT 1');
PREPARE s FROM @sql; EXECUTE s; DEALLOCATE PREPARE s;

-- 4) torna category_id NOT NULL (só se ainda estiver anulável).
SET @ddl := IF(
    (SELECT IS_NULLABLE FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'phrases' AND COLUMN_NAME = 'category_id') = 'YES',
    'ALTER TABLE phrases MODIFY COLUMN category_id INT NOT NULL',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- 5) adiciona a foreign key (se ainda não existir).
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'phrases' AND CONSTRAINT_NAME = 'fk_phrases_category') = 0,
    'ALTER TABLE phrases ADD CONSTRAINT fk_phrases_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- 6) dropa a coluna antiga phrases.category.
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'phrases' AND COLUMN_NAME = 'category') = 1,
    'ALTER TABLE phrases DROP COLUMN category',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- 7) attempts: colunas escalares do feedback da IA.
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'attempts' AND COLUMN_NAME = 'overall_comment') = 0,
    'ALTER TABLE attempts ADD COLUMN overall_comment TEXT NULL AFTER answer_given',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'attempts' AND COLUMN_NAME = 'corrected_sentence') = 0,
    'ALTER TABLE attempts ADD COLUMN corrected_sentence TEXT NULL AFTER overall_comment',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- 8) dropa attempts.ai_feedback (o feedback antigo era só gravado, nunca lido —
--    por decisão, não é migrado; só novas tentativas populam as tabelas-filhas).
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'attempts' AND COLUMN_NAME = 'ai_feedback') = 1,
    'ALTER TABLE attempts DROP COLUMN ai_feedback',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- 9) dropa plans.features (as features agora vivem em plan_features; o seed abaixo
--    repõe os valores canônicos).
SET @ddl := IF(
    (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'plans' AND COLUMN_NAME = 'features') = 1,
    'ALTER TABLE plans DROP COLUMN features',
    'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

-- ─── Dados iniciais ───────────────────────────────────────────────────────────

-- Nada de TRUNCATE: o MySQL recusa truncar tabela referenciada por foreign key
-- (erro 1701), e `plans` e `courses` são referenciadas por `user_plan` e `lessons`.
--
-- ON DUPLICATE KEY UPDATE em vez de INSERT puro para o arquivo poder rodar de
-- novo sem quebrar: na primeira vez insere, nas seguintes atualiza o conteúdo.
-- É o que permite corrigir um texto de curso aqui e reaplicar no banco
-- compartilhado sem duplicar linha nem dar erro 1062.

INSERT INTO courses (slug, title, description, level, order_num) VALUES
('basico',       'Inglês Básico',        'Vocabulário essencial, cumprimentos e frases do dia a dia.',        'basico',       1),
('intermediario','Inglês Intermediário', 'Gramática, tempos verbais e conversação mais fluente.',             'intermediario',2),
('avancado',     'Inglês Avançado',      'Expressões idiomáticas, escrita formal e fluência avançada.',       'avancado',     3)
ON DUPLICATE KEY UPDATE
    title = VALUES(title), description = VALUES(description),
    level = VALUES(level), order_num = VALUES(order_num);

INSERT INTO plans (name, price, description, billing_period) VALUES
('Free', 0.00, 'Acesso gratuito com recursos básicos', 'monthly'),
('Pro',  4.99, 'Acesso completo vitalício',           'lifetime')
ON DUPLICATE KEY UPDATE
    price = VALUES(price), description = VALUES(description),
    billing_period = VALUES(billing_period);

-- Features de cada plano (antes eram JSON em plans.features). Resolve os ids dos
-- planos em variáveis (INSERT ... VALUES não aceita subquery na lista de valores).
SET @plan_free := (SELECT id FROM plans WHERE name = 'Free');
SET @plan_pro  := (SELECT id FROM plans WHERE name = 'Pro');

INSERT INTO plan_features (plan_id, label, included, highlight, order_num) VALUES
(@plan_free, 'Traduções ilimitadas por dia', 1, 0, 1),
(@plan_free, 'Explicação de erros com IA',   1, 0, 2),
(@plan_free, 'XP, níveis e ranking',         1, 0, 3),
(@plan_free, 'Escolha de categorias',        0, 0, 4),
(@plan_free, 'Videoaulas de inglês',         0, 0, 5),
(@plan_pro,  'Tudo do plano Free',           1, 0, 1),
(@plan_pro,  'Favoritos ilimitados',         1, 1, 2),
(@plan_pro,  'Escolha de categorias',        1, 1, 3),
(@plan_pro,  'Todas as videoaulas',          1, 1, 4),
(@plan_pro,  'Relatório semanal completo',   1, 1, 5)
ON DUPLICATE KEY UPDATE
    included = VALUES(included), highlight = VALUES(highlight), order_num = VALUES(order_num);

-- Categorias das frases. INSERT IGNORE: reaplica sem duplicar; o seed-phrases.sql
-- resolve category_id a partir daqui, então precisa vir antes dele.
INSERT IGNORE INTO categories (name) VALUES
('Cotidiano'), ('Trabalho'), ('Viagem'), ('Restaurante'), ('Estudo'),
('Tecnologia'), ('Saúde'), ('Compras'), ('Emoções'), ('Emergência');

-- Valores padrão das configurações. INSERT IGNORE (e não ON DUPLICATE KEY UPDATE)
-- de propósito: se o admin já alterou algo, reaplicar o schema NÃO reseta o valor.
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES
('app_name',          'FluencyLab'),
('app_description',   'Plataforma de aprendizado de inglês gamificada.'),
('xp_per_phrase',     '10'),
('streak_bonus',      '1.5'),
('ranking_public',    '1'),
('new_registrations', '1'),
('maintenance_mode',  '0');

-- ─── Seed: aulas de cada curso ───────────────────────────────────────────────
-- Guarda os ids dos cursos em variáveis (INSERT ... VALUES não aceita subquery
-- direto na lista de valores, então resolvemos o id antes).
SET @c_basico := (SELECT id FROM courses WHERE slug = 'basico');
SET @c_inter  := (SELECT id FROM courses WHERE slug = 'intermediario');
SET @c_avanc  := (SELECT id FROM courses WHERE slug = 'avancado');

-- duration em SEGUNDOS. is_free = 1 nas primeiras aulas (amostra grátis); as
-- demais ficam bloqueadas para quem não é Pro. Os youtube_id são exemplos —
-- troque pelos vídeos reais das aulas quando tiver.
INSERT INTO lessons (course_id, title, duration, youtube_id, is_free, order_num) VALUES
(@c_basico, 'Saudações e apresentações',        372, 'juKd26qkNAw', 1, 1),
(@c_basico, 'Números, cores e datas',           415, 'e8kA9oyMbSo', 1, 2),
(@c_basico, 'Verbo "to be" na prática',         488, 'koDkQveExzM', 0, 3),
(@c_basico, 'Vocabulário do dia a dia',         531, 'Y7fVe1Pm3Sw', 0, 4),
(@c_basico, 'Fazendo perguntas simples',        402, 'sQ7Nkq9bYqE', 0, 5),
(@c_inter,  'Present Perfect sem mistério',     466, 'yQm6Xql9m3E', 1, 1),
(@c_inter,  'Phrasal verbs essenciais',         523, 'p5nGZQyKz2A', 0, 2),
(@c_inter,  'Condicionais (if clauses)',        498, 'wZ8Kx1n3vQ0', 0, 3),
(@c_inter,  'Conversação: no restaurante',      447, 'r3Tqfm2LpXo', 0, 4),
(@c_avanc,  'Expressões idiomáticas comuns',    512, 'aB9dLm4nQpE', 1, 1),
(@c_avanc,  'Inglês para reuniões de trabalho', 605, 'tK1sVn7mQ2c', 0, 2),
(@c_avanc,  'Escrevendo e-mails formais',       558, 'gH4jWq8pL0s', 0, 3),
(@c_avanc,  'Pronúncia avançada e conexões',    534, 'nM6bYt3xQ9d', 0, 4)
ON DUPLICATE KEY UPDATE
    title = VALUES(title), duration = VALUES(duration),
    youtube_id = VALUES(youtube_id), is_free = VALUES(is_free);

-- ─── Seed: usuário demo com progresso ────────────────────────────────────────
-- Para as telas de progresso (curso e dashboard) exibirem dados sem precisar
-- treinar do zero. Login: demo@fluencylab.com / senha: 123456
INSERT INTO users (name, email, password_hash, role) VALUES
('Aluno Demo', 'demo@fluencylab.com', '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student')
ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash);

SET @demo := (SELECT id FROM users WHERE email = 'demo@fluencylab.com');

-- Limpa dados demo antigos para o arquivo poder ser reaplicado sem acumular.
DELETE FROM lesson_progress WHERE user_id = @demo;
DELETE FROM ranking_points  WHERE user_id = @demo;
DELETE FROM attempts        WHERE user_id = @demo;

-- Aulas concluídas: as 2 primeiras do básico + a 1ª do intermediário.
INSERT INTO lesson_progress (user_id, lesson_id)
SELECT @demo, id FROM lessons WHERE course_id = @c_basico AND order_num IN (1, 2)
UNION ALL
SELECT @demo, id FROM lessons WHERE course_id = @c_inter  AND order_num = 1;

-- Tentativas de prática espalhadas nos últimos ~24 dias — alimenta treinos,
-- taxa de acerto, tempo total e o heatmap de consistência do dashboard.
-- INSERT ... SELECT a partir de `phrases`: se o seed-phrases.sql ainda não tiver
-- rodado, nenhuma linha é inserida (sem erro de foreign key).
INSERT INTO attempts (user_id, phrase_id, answer_given, is_correct, score, xp_earned, time_spent_seconds, created_at)
SELECT @demo, p.id, 'resposta de demonstração',
       IF(d.n % 4 = 0, 0, 1),            -- ~75% de acerto
       IF(d.n % 4 = 0, 55, 90),          -- nota da IA
       IF(d.n % 4 = 0, 0, 10),           -- XP só quando acerta
       40 + (d.n * 7) % 80,              -- tempo variando entre 40s e ~120s
       DATE_SUB(NOW(), INTERVAL d.n DAY)
FROM (SELECT id FROM phrases ORDER BY id LIMIT 1) p
CROSS JOIN (
    SELECT 0 AS n UNION ALL SELECT 1  UNION ALL SELECT 2  UNION ALL SELECT 3  UNION ALL
    SELECT 5      UNION ALL SELECT 6  UNION ALL SELECT 8  UNION ALL SELECT 10 UNION ALL
    SELECT 12     UNION ALL SELECT 13 UNION ALL SELECT 15 UNION ALL SELECT 18 UNION ALL
    SELECT 20     UNION ALL SELECT 22 UNION ALL SELECT 24
) d;

-- XP no ranking nos mesmos dias em que houve acerto (fonte do xp_total e do
-- gráfico semanal). 10 pontos por exercício correto.
INSERT INTO ranking_points (user_id, points, reason, earned_at)
SELECT @demo, 10, 'Exercício correto', DATE_SUB(NOW(), INTERVAL d.n DAY)
FROM (
    SELECT 0 AS n UNION ALL SELECT 1  UNION ALL SELECT 2  UNION ALL SELECT 3  UNION ALL
    SELECT 5      UNION ALL SELECT 6  UNION ALL SELECT 8  UNION ALL SELECT 10 UNION ALL
    SELECT 12     UNION ALL SELECT 13 UNION ALL SELECT 15 UNION ALL SELECT 18 UNION ALL
    SELECT 20     UNION ALL SELECT 22 UNION ALL SELECT 24
) d
WHERE d.n % 4 <> 0;
