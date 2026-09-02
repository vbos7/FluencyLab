-- FluencyLab — Seed de usuários e atividade (para deixar o painel rico em apresentações)
--
-- Cria ~40 usuários fictícios espalhados ao longo de ~14 meses e gera, para cada um,
-- tentativas de prática, pontos de ranking, progresso de aulas e algumas assinaturas
-- Pro. Isso alimenta TODOS os gráficos do painel admin:
--   • growth.php     → curva de cadastros por mês (created_at dos usuários)
--   • activity.php   → sessões (attempts) e XP (ranking_points) dos últimos 14 dias
--   • stats.php      → totais, ativos hoje, taxa de acerto, novos no mês
--   • top-users.php  → ranking por XP
--
-- Como aplicar (rode DEPOIS de schema.sql e seed-phrases.sql — precisa de phrases,
-- categories, plans e lessons já existentes):
--   mysql -h SEU_HOST -u SEU_USUARIO -p --default-character-set=utf8mb4 \
--     SEU_BANCO < backend/sql/seed-users.sql
--
-- É SEGURO rodar de novo: todos os usuários deste seed usam o domínio
-- "@seed.fluencylab.com". O arquivo primeiro APAGA a atividade desses usuários e
-- então regenera tudo — nada de outros usuários (reais) é tocado. As datas são
-- relativas a NOW(), então a "janela" de dados acompanha o dia em que for rodado.
--
-- Login de qualquer usuário do seed: <email> / senha: 123456

SET NAMES utf8mb4;

-- ─── 1) Usuários ─────────────────────────────────────────────────────────────
-- password_hash é o bcrypt de "123456" (o mesmo do usuário demo). created_at é
-- relativo: DATE_SUB(NOW(), INTERVAL n DAY). Offsets menores = cadastros recentes
-- (a densidade aumenta perto do fim → curva de crescimento acelerando).
-- ON DUPLICATE KEY UPDATE deixa o arquivo reaplicável sem duplicar (email é UNIQUE).
INSERT INTO users (name, email, password_hash, role, created_at) VALUES
('Ana Beatriz Ramos',    'ana.ramos@seed.fluencylab.com',      '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 410 DAY)),
('Bruno Carvalho',       'bruno.carvalho@seed.fluencylab.com',  '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 395 DAY)),
('Carla Mendes',         'carla.mendes@seed.fluencylab.com',    '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'admin',   DATE_SUB(NOW(), INTERVAL 380 DAY)),
('Diego Fernandes',      'diego.fernandes@seed.fluencylab.com',  '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 360 DAY)),
('Eduarda Lima',         'eduarda.lima@seed.fluencylab.com',    '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 345 DAY)),
('Felipe Souza',         'felipe.souza@seed.fluencylab.com',    '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 325 DAY)),
('Gabriela Nunes',       'gabriela.nunes@seed.fluencylab.com',  '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 300 DAY)),
('Henrique Alves',       'henrique.alves@seed.fluencylab.com',  '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 285 DAY)),
('Isabela Costa',        'isabela.costa@seed.fluencylab.com',   '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 265 DAY)),
('João Pedro Rocha',     'joao.rocha@seed.fluencylab.com',      '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 250 DAY)),
('Karina Batista',       'karina.batista@seed.fluencylab.com',  '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 235 DAY)),
('Lucas Martins',        'lucas.martins@seed.fluencylab.com',   '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 220 DAY)),
('Mariana Teixeira',     'mariana.teixeira@seed.fluencylab.com','$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 205 DAY)),
('Nathan Oliveira',      'nathan.oliveira@seed.fluencylab.com', '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 190 DAY)),
('Olívia Cardoso',       'olivia.cardoso@seed.fluencylab.com',  '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 175 DAY)),
('Pedro Henrique Dias',  'pedro.dias@seed.fluencylab.com',      '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 160 DAY)),
('Queila Barbosa',       'queila.barbosa@seed.fluencylab.com',  '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 148 DAY)),
('Rafael Gomes',         'rafael.gomes@seed.fluencylab.com',    '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 136 DAY)),
('Sofia Ribeiro',        'sofia.ribeiro@seed.fluencylab.com',   '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'admin',   DATE_SUB(NOW(), INTERVAL 124 DAY)),
('Thiago Moraes',        'thiago.moraes@seed.fluencylab.com',   '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 112 DAY)),
('Ursula Pacheco',       'ursula.pacheco@seed.fluencylab.com',  '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 100 DAY)),
('Vinícius Araújo',      'vinicius.araujo@seed.fluencylab.com', '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 90 DAY)),
('Wesley Pinto',         'wesley.pinto@seed.fluencylab.com',    '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 80 DAY)),
('Yasmin Freitas',       'yasmin.freitas@seed.fluencylab.com',  '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 70 DAY)),
('Zeca Camargo',         'zeca.camargo@seed.fluencylab.com',    '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 62 DAY)),
('Amanda Vieira',        'amanda.vieira@seed.fluencylab.com',   '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 54 DAY)),
('Breno Cunha',          'breno.cunha@seed.fluencylab.com',     '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 47 DAY)),
('Camila Duarte',        'camila.duarte@seed.fluencylab.com',   '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 40 DAY)),
('Daniel Esteves',       'daniel.esteves@seed.fluencylab.com',  '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 34 DAY)),
('Elaine Farias',        'elaine.farias@seed.fluencylab.com',   '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 29 DAY)),
('Fábio Guimarães',      'fabio.guimaraes@seed.fluencylab.com', '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 24 DAY)),
('Giovana Henrique',     'giovana.henrique@seed.fluencylab.com','$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 20 DAY)),
('Hugo Ferreira',        'hugo.ferreira@seed.fluencylab.com',   '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 16 DAY)),
('Ingrid Lopes',         'ingrid.lopes@seed.fluencylab.com',    '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 12 DAY)),
('Jonas Machado',        'jonas.machado@seed.fluencylab.com',   '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 9 DAY)),
('Larissa Pires',        'larissa.pires@seed.fluencylab.com',   '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 6 DAY)),
('Marcelo Tavares',      'marcelo.tavares@seed.fluencylab.com', '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('Natália Brito',        'natalia.brito@seed.fluencylab.com',   '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Otávio Sampaio',       'otavio.sampaio@seed.fluencylab.com',  '$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Priscila Andrade',     'priscila.andrade@seed.fluencylab.com','$2y$12$Zorr4Fr.1HvhAM8zO5N/Lu7tyISYc3goHVGgIHSMHEqHwuTCqt/y2', 'student', NOW())
ON DUPLICATE KEY UPDATE
    name = VALUES(name), password_hash = VALUES(password_hash),
    role = VALUES(role), created_at = VALUES(created_at);

-- ─── 2) Limpeza da atividade anterior deste seed ─────────────────────────────
-- Regenera do zero sem multiplicar linhas a cada reaplicação. Só os usuários do
-- seed (domínio @seed.fluencylab.com) são afetados. As tabelas-filhas de attempts
-- (attempt_mistakes / attempt_positive_points) somem por ON DELETE CASCADE.
DELETE FROM attempts        WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@seed.fluencylab.com');
DELETE FROM ranking_points  WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@seed.fluencylab.com');
DELETE FROM lesson_progress WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@seed.fluencylab.com');
DELETE FROM user_plan       WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@seed.fluencylab.com');

-- Quantidade de frases disponível (para escolher uma frase válida por tentativa).
-- Se der 0 (seed-phrases não rodou), o JOIN em phrases não casa e nenhuma
-- tentativa é inserida — sem erro de foreign key.
SET @phrase_count := (SELECT COUNT(*) FROM phrases);

-- ─── 3) Tentativas de prática (últimos 30 dias) ──────────────────────────────
-- Cruza cada usuário do seed com uma tabela de dias 0..29. O filtro
-- (u.id + d.n) % 3 <> 0 abre buracos (nem todo dia tem prática), gerando ~2/3 de
-- dias ativos por usuário → curva de sessões variada nos últimos 14 dias.
-- is_correct é determinístico (~80% de acerto) para uma taxa de conclusão realista.
INSERT INTO attempts (user_id, phrase_id, answer_given, is_correct, score, xp_earned, time_spent_seconds, created_at)
SELECT
    u.id,
    p.id,
    'resposta de demonstração',
    IF((u.id + d.n) % 5 = 0, 0, 1),                                   -- ~80% corretas
    IF((u.id + d.n) % 5 = 0, 40 + (u.id * 3 + d.n) % 25,              -- erradas: 40–64
                              78 + (u.id * 3 + d.n) % 22),            -- corretas: 78–99
    -- XP por acerto × fator do usuário (1..6) → leaderboard e níveis com spread real
    IF((u.id + d.n) % 5 = 0, 0, (10 + ((u.id + d.n) % 3) * 5) * (1 + u.id % 6)),
    45 + (u.id * 7 + d.n * 11) % 90,                                  -- tempo: 45–134s
    DATE_SUB(NOW(), INTERVAL d.n DAY)
FROM (SELECT id FROM users WHERE email LIKE '%@seed.fluencylab.com') u
CROSS JOIN (
    SELECT t.t * 10 + o.o AS n
    FROM (SELECT 0 o UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
          UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) o
    CROSS JOIN (SELECT 0 t UNION ALL SELECT 1 UNION ALL SELECT 2) t
) d
JOIN phrases p ON p.id = 1 + ((u.id * 13 + d.n * 7) % @phrase_count)
WHERE (u.id + d.n) % 3 <> 0;

-- ─── 4) Pontos de ranking (mesma janela; só nos dias/acertos) ────────────────
-- Fonte única de XP dos gráficos e do ranking. Espelha exatamente as tentativas
-- corretas acima (mesmo filtro de dia + mesma condição de acerto e mesmo XP),
-- para o totalXP e a série de XP baterem com as sessões.
INSERT INTO ranking_points (user_id, points, reason, earned_at)
SELECT
    u.id,
    (10 + ((u.id + d.n) % 3) * 5) * (1 + u.id % 6),                   -- XP × fator do usuário
    'Exercício correto',
    DATE_SUB(NOW(), INTERVAL d.n DAY)
FROM (SELECT id FROM users WHERE email LIKE '%@seed.fluencylab.com') u
CROSS JOIN (
    SELECT t.t * 10 + o.o AS n
    FROM (SELECT 0 o UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
          UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) o
    CROSS JOIN (SELECT 0 t UNION ALL SELECT 1 UNION ALL SELECT 2) t
) d
WHERE (u.id + d.n) % 3 <> 0 AND (u.id + d.n) % 5 <> 0;

-- ─── 5) Progresso de aulas ───────────────────────────────────────────────────
-- Cada usuário conclui as primeiras aulas de cada curso (quantas variam por
-- usuário). INSERT IGNORE + UNIQUE(user_id, lesson_id) tornam isto idempotente.
INSERT IGNORE INTO lesson_progress (user_id, lesson_id, completed_at)
SELECT u.id, l.id, DATE_SUB(NOW(), INTERVAL (u.id % 25) DAY)
FROM (SELECT id FROM users WHERE email LIKE '%@seed.fluencylab.com') u
JOIN lessons l ON l.order_num <= 1 + (u.id % 4);

-- ─── 6) Assinaturas Pro ──────────────────────────────────────────────────────
-- Um em cada quatro usuários do seed é assinante Pro (vitalício → expires_at NULL).
SET @plan_pro := (SELECT id FROM plans WHERE name = 'Pro');
INSERT INTO user_plan (user_id, plan_id, started_at, expires_at, status)
SELECT u.id, @plan_pro, DATE_SUB(NOW(), INTERVAL (u.id % 90) DAY), NULL, 'active'
FROM (SELECT id FROM users WHERE email LIKE '%@seed.fluencylab.com') u
WHERE @plan_pro IS NOT NULL AND u.id % 4 = 0;
