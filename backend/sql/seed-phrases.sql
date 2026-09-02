-- FluencyLab — Frases de prática (seed da tabela `phrases`)
--
-- Gerado a partir de frontend/app/_lib/practice.ts, que era a fonte temporária
-- enquanto o endpoint de frases não existia. A partir daqui o banco é a fonte.
--
-- 100 frases em 10 categorias:
-- Cotidiano, Trabalho, Viagem, Restaurante, Estudo, Tecnologia, Saúde, Compras, Emoções, Emergência.
--
-- Como aplicar no banco compartilhado (rode o schema.sql ANTES — ele cria a
-- tabela `categories` e a semeia; aqui os category_id são resolvidos a partir dela):
--   mysql -h SEU_HOST -u SEU_USUARIO -p --default-character-set=utf8mb4 \
--     SEU_BANCO < backend/sql/seed-phrases.sql
--
-- Pode rodar mais de uma vez: o ON DUPLICATE KEY UPDATE atualiza a frase
-- existente em vez de duplicar ou dar erro de chave primária. Nenhuma linha é
-- apagada, então as tentativas já registradas em `attempts` continuam válidas.

-- Declara o encoding do arquivo. Sem isto o cliente mysql pode assumir latin1
-- e gravar "Saúde" como "SaÃºde".
SET NAMES utf8mb4;

-- Garante as categorias (idempotente) — caso o schema.sql não tenha sido rodado
-- antes, ainda assim conseguimos resolver os ids logo abaixo.
INSERT IGNORE INTO categories (name) VALUES
('Cotidiano'), ('Trabalho'), ('Viagem'), ('Restaurante'), ('Estudo'),
('Tecnologia'), ('Saúde'), ('Compras'), ('Emoções'), ('Emergência');

-- Resolve o id de cada categoria em variáveis (INSERT ... VALUES não aceita
-- subquery direto na lista de valores).
SET @cat_cotidiano   := (SELECT id FROM categories WHERE name = 'Cotidiano');
SET @cat_trabalho    := (SELECT id FROM categories WHERE name = 'Trabalho');
SET @cat_viagem      := (SELECT id FROM categories WHERE name = 'Viagem');
SET @cat_restaurante := (SELECT id FROM categories WHERE name = 'Restaurante');
SET @cat_estudo      := (SELECT id FROM categories WHERE name = 'Estudo');
SET @cat_tecnologia  := (SELECT id FROM categories WHERE name = 'Tecnologia');
SET @cat_saude       := (SELECT id FROM categories WHERE name = 'Saúde');
SET @cat_compras     := (SELECT id FROM categories WHERE name = 'Compras');
SET @cat_emocoes     := (SELECT id FROM categories WHERE name = 'Emoções');
SET @cat_emergencia  := (SELECT id FROM categories WHERE name = 'Emergência');

INSERT INTO phrases (id, pt, en, difficulty, category_id) VALUES
    (1, 'Eu sou bonito', 'I''m beautiful', 'easy', @cat_cotidiano),
    (2, 'Eu estou feliz', 'I am happy', 'easy', @cat_cotidiano),
    (3, 'Eu estou cansado', 'I am tired', 'easy', @cat_cotidiano),
    (4, 'Eu acordo cedo todos os dias', 'I wake up early every day', 'medium', @cat_cotidiano),
    (5, 'Eu gosto de ouvir música', 'I like listening to music', 'medium', @cat_cotidiano),
    (6, 'Eu moro com minha família', 'I live with my family', 'medium', @cat_cotidiano),
    (7, 'Eu tento melhorar um pouco a cada dia', 'I try to improve a little every day', 'hard', @cat_cotidiano),
    (8, 'Às vezes eu prefiro ficar em casa', 'Sometimes I prefer to stay at home', 'hard', @cat_cotidiano),
    (9, 'Eu sempre procuro aprender coisas novas', 'I always try to learn new things', 'hard', @cat_cotidiano),
    (10, 'Minha rotina muda dependendo do dia', 'My routine changes depending on the day', 'hard', @cat_cotidiano),
    (11, 'Eu estou no trabalho', 'I am at work', 'easy', @cat_trabalho),
    (12, 'Eu começo às oito', 'I start at eight', 'easy', @cat_trabalho),
    (13, 'Eu gosto do meu trabalho', 'I like my job', 'easy', @cat_trabalho),
    (14, 'Eu preciso terminar este relatório', 'I need to finish this report', 'medium', @cat_trabalho),
    (15, 'A reunião começa em dez minutos', 'The meeting starts in ten minutes', 'medium', @cat_trabalho),
    (16, 'Nós estamos trabalhando em um novo projeto', 'We are working on a new project', 'medium', @cat_trabalho),
    (17, 'Este projeto exige muita atenção', 'This project requires a lot of attention', 'hard', @cat_trabalho),
    (18, 'Precisamos melhorar nossa comunicação', 'We need to improve our communication', 'hard', @cat_trabalho),
    (19, 'O prazo final é no final da semana', 'The deadline is at the end of the week', 'hard', @cat_trabalho),
    (20, 'Estamos analisando novas estratégias', 'We are analyzing new strategies', 'hard', @cat_trabalho),
    (21, 'Onde fica o aeroporto?', 'Where is the airport?', 'easy', @cat_viagem),
    (22, 'Eu preciso de um táxi', 'I need a taxi', 'easy', @cat_viagem),
    (23, 'Meu voo sai hoje', 'My flight leaves today', 'easy', @cat_viagem),
    (24, 'Eu tenho uma reserva no hotel', 'I have a reservation at the hotel', 'medium', @cat_viagem),
    (25, 'Quanto custa esta passagem?', 'How much is this ticket?', 'medium', @cat_viagem),
    (26, 'O voo está atrasado', 'The flight is delayed', 'medium', @cat_viagem),
    (27, 'Eu perdi minha bagagem no aeroporto', 'I lost my luggage at the airport', 'hard', @cat_viagem),
    (28, 'Este é meu primeiro voo internacional', 'This is my first international flight', 'hard', @cat_viagem),
    (29, 'Preciso confirmar minha reserva', 'I need to confirm my reservation', 'hard', @cat_viagem),
    (30, 'Estamos esperando o embarque começar', 'We are waiting for boarding to start', 'hard', @cat_viagem),
    (31, 'Eu quero água', 'I want water', 'easy', @cat_restaurante),
    (32, 'O cardápio por favor', 'The menu please', 'easy', @cat_restaurante),
    (33, 'A conta por favor', 'The bill please', 'easy', @cat_restaurante),
    (34, 'Eu gostaria de um café', 'I would like a coffee', 'medium', @cat_restaurante),
    (35, 'Este prato é muito bom', 'This dish is very good', 'medium', @cat_restaurante),
    (36, 'Você tem sobremesa?', 'Do you have dessert?', 'medium', @cat_restaurante),
    (37, 'Este restaurante é muito famoso', 'This restaurant is very famous', 'hard', @cat_restaurante),
    (38, 'Eu gostaria de experimentar algo novo', 'I would like to try something new', 'hard', @cat_restaurante),
    (39, 'A comida demorou um pouco', 'The food took a while', 'hard', @cat_restaurante),
    (40, 'Você pode recomendar um prato?', 'Can you recommend a dish?', 'hard', @cat_restaurante),
    (41, 'Eu estudo inglês', 'I study English', 'easy', @cat_estudo),
    (42, 'Eu tenho uma prova', 'I have a test', 'easy', @cat_estudo),
    (43, 'Eu gosto de aprender', 'I like learning', 'easy', @cat_estudo),
    (44, 'Eu estou estudando para a prova', 'I am studying for the test', 'medium', @cat_estudo),
    (45, 'Eu preciso ler este livro', 'I need to read this book', 'medium', @cat_estudo),
    (46, 'A aula começa agora', 'The class starts now', 'medium', @cat_estudo),
    (47, 'Eu aprendi algo novo hoje', 'I learned something new today', 'hard', @cat_estudo),
    (48, 'Este exercício é um pouco difícil', 'This exercise is a little difficult', 'hard', @cat_estudo),
    (49, 'Eu preciso praticar todos os dias', 'I need to practice every day', 'hard', @cat_estudo),
    (50, 'Estudar idiomas abre muitas portas', 'Studying languages opens many doors', 'hard', @cat_estudo),
    (51, 'Meu celular acabou a bateria', 'My phone died', 'easy', @cat_tecnologia),
    (52, 'A internet caiu', 'The internet is down', 'easy', @cat_tecnologia),
    (53, 'Meu computador está lento', 'My computer is slow', 'easy', @cat_tecnologia),
    (54, 'Eu esqueci minha senha', 'I forgot my password', 'medium', @cat_tecnologia),
    (55, 'O aplicativo não abre', 'The app won''t open', 'medium', @cat_tecnologia),
    (56, 'Eu preciso atualizar o sistema', 'I need to update the system', 'medium', @cat_tecnologia),
    (57, 'Este site está fora do ar', 'This website is down', 'hard', @cat_tecnologia),
    (58, 'Eu preciso reiniciar o computador', 'I need to restart the computer', 'hard', @cat_tecnologia),
    (59, 'Eu baixei um arquivo grande', 'I downloaded a large file', 'hard', @cat_tecnologia),
    (60, 'Estamos testando uma nova ferramenta', 'We are testing a new tool', 'hard', @cat_tecnologia),
    (61, 'Eu estou doente', 'I am sick', 'easy', @cat_saude),
    (62, 'Eu tenho febre', 'I have a fever', 'easy', @cat_saude),
    (63, 'Eu tenho dor de cabeça', 'I have a headache', 'easy', @cat_saude),
    (64, 'Eu preciso descansar', 'I need to rest', 'medium', @cat_saude),
    (65, 'Eu estou me sentindo melhor', 'I am feeling better', 'medium', @cat_saude),
    (66, 'Eu preciso de um médico', 'I need a doctor', 'medium', @cat_saude),
    (67, 'Eu marquei uma consulta', 'I scheduled an appointment', 'hard', @cat_saude),
    (68, 'Eu preciso tomar este remédio', 'I need to take this medicine', 'hard', @cat_saude),
    (69, 'Estou tentando cuidar melhor da minha saúde', 'I am trying to take better care of my health', 'hard', @cat_saude),
    (70, 'Exercício físico é importante', 'Physical exercise is important', 'hard', @cat_saude),
    (71, 'Quanto custa isso?', 'How much is this?', 'easy', @cat_compras),
    (72, 'Eu quero comprar isso', 'I want to buy this', 'easy', @cat_compras),
    (73, 'Você aceita cartão?', 'Do you accept card?', 'easy', @cat_compras),
    (74, 'Tem desconto?', 'Is there a discount?', 'medium', @cat_compras),
    (75, 'Eu estou apenas olhando', 'I am just looking', 'medium', @cat_compras),
    (76, 'Você tem outro tamanho?', 'Do you have another size?', 'medium', @cat_compras),
    (77, 'Eu gostaria de experimentar isso', 'I would like to try this', 'hard', @cat_compras),
    (78, 'Este produto parece muito bom', 'This product looks very good', 'hard', @cat_compras),
    (79, 'Estou comparando os preços', 'I am comparing prices', 'hard', @cat_compras),
    (80, 'Eu volto depois para comprar', 'I will come back later to buy it', 'hard', @cat_compras),
    (81, 'Eu estou feliz', 'I am happy', 'easy', @cat_emocoes),
    (82, 'Eu estou triste', 'I am sad', 'easy', @cat_emocoes),
    (83, 'Eu estou nervoso', 'I am nervous', 'easy', @cat_emocoes),
    (84, 'Eu estou animado', 'I am excited', 'medium', @cat_emocoes),
    (85, 'Eu estou preocupado', 'I am worried', 'medium', @cat_emocoes),
    (86, 'Eu estou relaxado', 'I am relaxed', 'medium', @cat_emocoes),
    (87, 'Eu estou muito motivado hoje', 'I am very motivated today', 'hard', @cat_emocoes),
    (88, 'Estou tentando manter a calma', 'I am trying to stay calm', 'hard', @cat_emocoes),
    (89, 'Às vezes eu me sinto perdido', 'Sometimes I feel lost', 'hard', @cat_emocoes),
    (90, 'Eu estou aprendendo a controlar minhas emoções', 'I am learning to control my emotions', 'hard', @cat_emocoes),
    (91, 'Me ajude', 'Help me', 'easy', @cat_emergencia),
    (92, 'Chame a polícia', 'Call the police', 'easy', @cat_emergencia),
    (93, 'Chame uma ambulância', 'Call an ambulance', 'easy', @cat_emergencia),
    (94, 'Eu preciso de ajuda agora', 'I need help now', 'medium', @cat_emergencia),
    (95, 'Alguém está ferido', 'Someone is injured', 'medium', @cat_emergencia),
    (96, 'Há um incêndio', 'There is a fire', 'medium', @cat_emergencia),
    (97, 'Eu perdi meus documentos', 'I lost my documents', 'hard', @cat_emergencia),
    (98, 'Meu carro quebrou na estrada', 'My car broke down on the road', 'hard', @cat_emergencia),
    (99, 'Eu preciso falar com um policial', 'I need to speak to a police officer', 'hard', @cat_emergencia),
    (100, 'Por favor me ajude imediatamente', 'Please help me immediately', 'hard', @cat_emergencia)
ON DUPLICATE KEY UPDATE
    pt          = VALUES(pt),
    en          = VALUES(en),
    difficulty  = VALUES(difficulty),
    category_id = VALUES(category_id);
