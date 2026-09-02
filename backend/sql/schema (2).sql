-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: fluencylab.mysql.dbaas.com.br
-- Generation Time: 21-Ago-2026 às 20:04
-- Versão do servidor: 5.7.32-35-log
-- PHP Version: 5.6.40-0+deb8u12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fluencylab`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `attempts`
--

CREATE TABLE `attempts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `phrase_id` int(11) NOT NULL,
  `answer_given` text NOT NULL,
  `ai_feedback` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `is_correct` tinyint(1) NOT NULL,
  `score` tinyint(3) UNSIGNED NOT NULL,
  `xp_earned` smallint(5) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `time_spent_seconds` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `is_approved` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `comments`
--

INSERT INTO `comments` (`id`, `lesson_id`, `user_id`, `parent_id`, `content`, `is_approved`, `created_at`) VALUES
(1, 4, 1, NULL, 'oi', 1, '2026-08-14 00:54:58'),
(2, 1, 1, NULL, 'teste', 1, '2026-08-14 00:55:28'),
(3, 3, 1, NULL, 'marcus', 1, '2026-08-14 23:57:20'),
(4, 1, 7, NULL, 'dahora', 1, '2026-08-15 01:19:11'),
(5, 1, 5, NULL, 'aprendi bastante', 1, '2026-08-19 00:18:52');

-- --------------------------------------------------------

--
-- Estrutura da tabela `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text,
  `level` enum('basico','intermediario','avancado') NOT NULL,
  `order_num` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `courses`
--

INSERT INTO `courses` (`id`, `slug`, `title`, `description`, `level`, `order_num`) VALUES
(1, 'basico', 'Inglês Iniciante', 'Vocabulário essencial, cumprimentos e frases do dia a dia.', 'basico', 1),
(2, 'intermediario', 'Inglês Intermediário', 'Gramática, tempos verbais e conversação mais fluente.', 'intermediario', 2),
(3, 'avancado', 'Inglês Avançado', 'Expressões idiomáticas, escrita formal e fluência avançada.', 'avancado', 3);

-- --------------------------------------------------------

--
-- Estrutura da tabela `lessons`
--

CREATE TABLE `lessons` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `duration` varchar(20) DEFAULT NULL,
  `youtube_id` varchar(50) DEFAULT NULL,
  `order_num` int(11) DEFAULT '0',
  `is_free` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `lessons`
--

INSERT INTO `lessons` (`id`, `course_id`, `title`, `duration`, `youtube_id`, `order_num`, `is_free`) VALUES
(1, 1, 'Alfabeto em inglês', '400', 'X5TdMsc4YCg', 1, 1),
(2, 1, 'Números de 1 a 20', '240', 'abc123xyz', 2, 0),
(3, 1, 'Apresentando-se em inglês', '360', 'def456uvw', 3, 0),
(4, 2, 'Vocabularios', '300', 'tDRsbPBbY_E&t=248s', 4, 0),
(5, 3, 'Verbo to be', '400', '', 5, 0),
(6, 1, 'Alfabeto e sons do inglês', '480', 'SUBSTITUA_PELO_ID_1', 1, 0),
(7, 1, 'Cumprimentos e apresentações', '360', 'SUBSTITUA_PELO_ID_2', 2, 0),
(8, 1, 'Números, cores e dias da semana', '420', 'SUBSTITUA_PELO_ID_3', 3, 0),
(9, 1, 'Frases do dia a dia', '540', 'SUBSTITUA_PELO_ID_4', 4, 0),
(10, 2, 'Tempos verbais no presente', '600', 'SUBSTITUA_PELO_ID_5', 1, 1),
(11, 2, 'Passado simples e contínuo', '540', 'SUBSTITUA_PELO_ID_6', 2, 0),
(12, 2, 'Conversação: pedindo informações', '480', 'SUBSTITUA_PELO_ID_7', 3, 0),
(13, 2, 'Phrasal verbs essenciais', '510', 'SUBSTITUA_PELO_ID_8', 4, 0),
(14, 3, 'Expressões idiomáticas', '600', 'SUBSTITUA_PELO_ID_9', 1, 1),
(15, 3, 'Escrita formal e e-mails', '660', 'SUBSTITUA_PELO_ID_10', 2, 0),
(16, 3, 'Debate e argumentação', '720', 'SUBSTITUA_PELO_ID_11', 3, 0),
(17, 3, 'Fluência em conversação real', '600', 'SUBSTITUA_PELO_ID_12', 4, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `lesson_notes`
--

CREATE TABLE `lesson_notes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `lesson_notes`
--

INSERT INTO `lesson_notes` (`id`, `user_id`, `lesson_id`, `content`, `updated_at`) VALUES
(1, 5, 1, 'O Alfabeto em inglês  e bem legal.', '2026-08-20 23:08:54');

-- --------------------------------------------------------

--
-- Estrutura da tabela `lesson_progress`
--

CREATE TABLE `lesson_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `completed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estrutura da tabela `phrases`
--

CREATE TABLE `phrases` (
  `id` int(11) NOT NULL,
  `pt` text NOT NULL,
  `en` text NOT NULL,
  `difficulty` enum('easy','medium','hard') NOT NULL,
  `category` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `phrases`
--

INSERT INTO `phrases` (`id`, `pt`, `en`, `difficulty`, `category`) VALUES
(1, 'Eu sou bonito', 'I\'m beautiful', 'easy', 'Cotidiano'),
(2, 'Eu estou feliz', 'I am happy', 'easy', 'Cotidiano'),
(3, 'Eu estou cansado', 'I am tired', 'easy', 'Cotidiano'),
(4, 'Eu acordo cedo todos os dias', 'I wake up early every day', 'medium', 'Cotidiano'),
(5, 'Eu gosto de ouvir música', 'I like listening to music', 'medium', 'Cotidiano'),
(6, 'Eu moro com minha família', 'I live with my family', 'medium', 'Cotidiano'),
(7, 'Eu tento melhorar um pouco a cada dia', 'I try to improve a little every day', 'hard', 'Cotidiano'),
(8, 'Às vezes eu prefiro ficar em casa', 'Sometimes I prefer to stay at home', 'hard', 'Cotidiano'),
(9, 'Eu sempre procuro aprender coisas novas', 'I always try to learn new things', 'hard', 'Cotidiano'),
(10, 'Minha rotina muda dependendo do dia', 'My routine changes depending on the day', 'hard', 'Cotidiano'),
(11, 'Eu estou no trabalho', 'I am at work', 'easy', 'Trabalho'),
(12, 'Eu começo às oito', 'I start at eight', 'easy', 'Trabalho'),
(13, 'Eu gosto do meu trabalho', 'I like my job', 'easy', 'Trabalho'),
(14, 'Eu preciso terminar este relatório', 'I need to finish this report', 'medium', 'Trabalho'),
(15, 'A reunião começa em dez minutos', 'The meeting starts in ten minutes', 'medium', 'Trabalho'),
(16, 'Nós estamos trabalhando em um novo projeto', 'We are working on a new project', 'medium', 'Trabalho'),
(17, 'Este projeto exige muita atenção', 'This project requires a lot of attention', 'hard', 'Trabalho'),
(18, 'Precisamos melhorar nossa comunicação', 'We need to improve our communication', 'hard', 'Trabalho'),
(19, 'O prazo final é no final da semana', 'The deadline is at the end of the week', 'hard', 'Trabalho'),
(20, 'Estamos analisando novas estratégias', 'We are analyzing new strategies', 'hard', 'Trabalho'),
(21, 'Onde fica o aeroporto?', 'Where is the airport?', 'easy', 'Viagem'),
(22, 'Eu preciso de um táxi', 'I need a taxi', 'easy', 'Viagem'),
(23, 'Meu voo sai hoje', 'My flight leaves today', 'easy', 'Viagem'),
(24, 'Eu tenho uma reserva no hotel', 'I have a reservation at the hotel', 'medium', 'Viagem'),
(25, 'Quanto custa esta passagem?', 'How much is this ticket?', 'medium', 'Viagem'),
(26, 'O voo está atrasado', 'The flight is delayed', 'medium', 'Viagem'),
(27, 'Eu perdi minha bagagem no aeroporto', 'I lost my luggage at the airport', 'hard', 'Viagem'),
(28, 'Este é meu primeiro voo internacional', 'This is my first international flight', 'hard', 'Viagem'),
(29, 'Preciso confirmar minha reserva', 'I need to confirm my reservation', 'hard', 'Viagem'),
(30, 'Estamos esperando o embarque começar', 'We are waiting for boarding to start', 'hard', 'Viagem'),
(31, 'Eu quero água', 'I want water', 'easy', 'Restaurante'),
(32, 'O cardápio por favor', 'The menu please', 'easy', 'Restaurante'),
(33, 'A conta por favor', 'The bill please', 'easy', 'Restaurante'),
(34, 'Eu gostaria de um café', 'I would like a coffee', 'medium', 'Restaurante'),
(35, 'Este prato é muito bom', 'This dish is very good', 'medium', 'Restaurante'),
(36, 'Você tem sobremesa?', 'Do you have dessert?', 'medium', 'Restaurante'),
(37, 'Este restaurante é muito famoso', 'This restaurant is very famous', 'hard', 'Restaurante'),
(38, 'Eu gostaria de experimentar algo novo', 'I would like to try something new', 'hard', 'Restaurante'),
(39, 'A comida demorou um pouco', 'The food took a while', 'hard', 'Restaurante'),
(40, 'Você pode recomendar um prato?', 'Can you recommend a dish?', 'hard', 'Restaurante'),
(41, 'Eu estudo inglês', 'I study English', 'easy', 'Estudo'),
(42, 'Eu tenho uma prova', 'I have a test', 'easy', 'Estudo'),
(43, 'Eu gosto de aprender', 'I like learning', 'easy', 'Estudo'),
(44, 'Eu estou estudando para a prova', 'I am studying for the test', 'medium', 'Estudo'),
(45, 'Eu preciso ler este livro', 'I need to read this book', 'medium', 'Estudo'),
(46, 'A aula começa agora', 'The class starts now', 'medium', 'Estudo'),
(47, 'Eu aprendi algo novo hoje', 'I learned something new today', 'hard', 'Estudo'),
(48, 'Este exercício é um pouco difícil', 'This exercise is a little difficult', 'hard', 'Estudo'),
(49, 'Eu preciso praticar todos os dias', 'I need to practice every day', 'hard', 'Estudo'),
(50, 'Estudar idiomas abre muitas portas', 'Studying languages opens many doors', 'hard', 'Estudo'),
(51, 'Meu celular acabou a bateria', 'My phone died', 'easy', 'Tecnologia'),
(52, 'A internet caiu', 'The internet is down', 'easy', 'Tecnologia'),
(53, 'Meu computador está lento', 'My computer is slow', 'easy', 'Tecnologia'),
(54, 'Eu esqueci minha senha', 'I forgot my password', 'medium', 'Tecnologia'),
(55, 'O aplicativo não abre', 'The app won\'t open', 'medium', 'Tecnologia'),
(56, 'Eu preciso atualizar o sistema', 'I need to update the system', 'medium', 'Tecnologia'),
(57, 'Este site está fora do ar', 'This website is down', 'hard', 'Tecnologia'),
(58, 'Eu preciso reiniciar o computador', 'I need to restart the computer', 'hard', 'Tecnologia'),
(59, 'Eu baixei um arquivo grande', 'I downloaded a large file', 'hard', 'Tecnologia'),
(60, 'Estamos testando uma nova ferramenta', 'We are testing a new tool', 'hard', 'Tecnologia'),
(61, 'Eu estou doente', 'I am sick', 'easy', 'Saúde'),
(62, 'Eu tenho febre', 'I have a fever', 'easy', 'Saúde'),
(63, 'Eu tenho dor de cabeça', 'I have a headache', 'easy', 'Saúde'),
(64, 'Eu preciso descansar', 'I need to rest', 'medium', 'Saúde'),
(65, 'Eu estou me sentindo melhor', 'I am feeling better', 'medium', 'Saúde'),
(66, 'Eu preciso de um médico', 'I need a doctor', 'medium', 'Saúde'),
(67, 'Eu marquei uma consulta', 'I scheduled an appointment', 'hard', 'Saúde'),
(68, 'Eu preciso tomar este remédio', 'I need to take this medicine', 'hard', 'Saúde'),
(69, 'Estou tentando cuidar melhor da minha saúde', 'I am trying to take better care of my health', 'hard', 'Saúde'),
(70, 'Exercício físico é importante', 'Physical exercise is important', 'hard', 'Saúde'),
(71, 'Quanto custa isso?', 'How much is this?', 'easy', 'Compras'),
(72, 'Eu quero comprar isso', 'I want to buy this', 'easy', 'Compras'),
(73, 'Você aceita cartão?', 'Do you accept card?', 'easy', 'Compras'),
(74, 'Tem desconto?', 'Is there a discount?', 'medium', 'Compras'),
(75, 'Eu estou apenas olhando', 'I am just looking', 'medium', 'Compras'),
(76, 'Você tem outro tamanho?', 'Do you have another size?', 'medium', 'Compras'),
(77, 'Eu gostaria de experimentar isso', 'I would like to try this', 'hard', 'Compras'),
(78, 'Este produto parece muito bom', 'This product looks very good', 'hard', 'Compras'),
(79, 'Estou comparando os preços', 'I am comparing prices', 'hard', 'Compras'),
(80, 'Eu volto depois para comprar', 'I will come back later to buy it', 'hard', 'Compras'),
(81, 'Eu estou feliz', 'I am happy', 'easy', 'Emoções'),
(82, 'Eu estou triste', 'I am sad', 'easy', 'Emoções'),
(83, 'Eu estou nervoso', 'I am nervous', 'easy', 'Emoções'),
(84, 'Eu estou animado', 'I am excited', 'medium', 'Emoções'),
(85, 'Eu estou preocupado', 'I am worried', 'medium', 'Emoções'),
(86, 'Eu estou relaxado', 'I am relaxed', 'medium', 'Emoções'),
(87, 'Eu estou muito motivado hoje', 'I am very motivated today', 'hard', 'Emoções'),
(88, 'Estou tentando manter a calma', 'I am trying to stay calm', 'hard', 'Emoções'),
(89, 'Às vezes eu me sinto perdido', 'Sometimes I feel lost', 'hard', 'Emoções'),
(90, 'Eu estou aprendendo a controlar minhas emoções', 'I am learning to control my emotions', 'hard', 'Emoções'),
(91, 'Me ajude', 'Help me', 'easy', 'Emergência'),
(92, 'Chame a polícia', 'Call the police', 'easy', 'Emergência'),
(93, 'Chame uma ambulância', 'Call an ambulance', 'easy', 'Emergência'),
(94, 'Eu preciso de ajuda agora', 'I need help now', 'medium', 'Emergência'),
(95, 'Alguém está ferido', 'Someone is injured', 'medium', 'Emergência'),
(96, 'Há um incêndio', 'There is a fire', 'medium', 'Emergência'),
(97, 'Eu perdi meus documentos', 'I lost my documents', 'hard', 'Emergência'),
(98, 'Meu carro quebrou na estrada', 'My car broke down on the road', 'hard', 'Emergência'),
(99, 'Eu preciso falar com um policial', 'I need to speak to a police officer', 'hard', 'Emergência'),
(100, 'Por favor me ajude imediatamente', 'Please help me immediately', 'hard', 'Emergência');

-- --------------------------------------------------------

--
-- Estrutura da tabela `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `billing_period` enum('monthly','lifetime') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `plans`
--

INSERT INTO `plans` (`id`, `name`, `slug`, `price`, `description`, `features`, `billing_period`) VALUES
(1, 'Free', 'free', 0.00, 'Acesso gratuito com recursos básicos', NULL, 'monthly'),
(2, 'Pro', 'pro', 4.99, 'Acesso completo vitalício', NULL, 'lifetime');

-- --------------------------------------------------------

--
-- Estrutura da tabela `ranking_points`
--

CREATE TABLE `ranking_points` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `points` smallint(5) UNSIGNED NOT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `earned_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('student','admin') NOT NULL DEFAULT 'student',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `phone`, `role`, `created_at`) VALUES
(1, 'Teste', 'teste@manivela.com', '$2y$12$j1n1gDadn9ix8G4CLgOrGOnx.tMvmpuGpNmSeKh7bABceSc56i8zG', NULL, 'student', '2026-07-01 23:47:26'),
(2, 'Ana', 'teste@teste.com', '$2y$12$VD9Cu4uihe/VLgLFxjMgMOsOUQs68J/YxhQMAb9icmPIkbNYxmHXG', NULL, 'student', '2026-08-05 19:36:10'),
(3, 'asd', 'teste2@teste.com', '$2y$12$cB1uMeV3ZePNpXF5hQ6bquW.ay3B66gB63/1gY3oRIAmjd29cWYea', NULL, 'student', '2026-08-05 19:37:04'),
(4, 'Vinicius Boschetti', 'admin@admin.com', '$2y$12$lrSa1Zfs0nMH23pl.8Us0OuomTntUJobLHxyx/ZC3BC0dENqxRJTi', '', 'student', '2026-08-05 20:01:19'),
(5, 'Marcus Vinicius', 'marcus@gmail.com', '$2y$10$OxEGc17b0XQNCiNyaagokeTax7rpiIVFCEci4Pr5EoXd3mcNoxRPa', NULL, 'student', '2026-08-12 22:02:25'),
(6, 'João Silva', 'joao@example.com', '$2y$12$XeUuESQ8DgBnVmkbamW/IOHbG0nx8U5ZDBYLzNcPlIsZGcU273d2K', NULL, 'student', '2026-08-12 23:15:28'),
(7, 'Gabriel', 'gabriel@gmail.com', '$2y$10$v6WRmptCCgsHnOP9ykTrJ.gcJOGA0DJTW8M.DvNT0rTaVbjL2LBwm', NULL, 'student', '2026-08-14 21:42:35'),
(8, 'Pedro Moura', 'pedro_viado@gmail.com', '$2y$12$2Kc7SGB66uiCuOBsZyIzy.4RUyHPyJBMawtkd3QHrkj5YWKS9Nnxu', NULL, 'student', '2026-08-18 20:09:07'),
(9, 'Maurício Giovani', 'mauricio.santos.giovani@gmail.com', '$2y$10$Aq1EzBVBpApMkzrRDTzpOehVHrtZygXXRMcdqrLOB9RlNb8mVM34W', NULL, 'student', '2026-08-20 21:07:01');

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_plan`
--

CREATE TABLE `user_plan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `started_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime DEFAULT NULL,
  `status` enum('active','canceled','expired') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Extraindo dados da tabela `user_plan`
--

INSERT INTO `user_plan` (`id`, `user_id`, `plan_id`, `started_at`, `expires_at`, `status`) VALUES
(1, 7, 2, '2026-08-17 22:03:10', NULL, 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attempts`
--
ALTER TABLE `attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `phrase_id` (`phrase_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lesson_id` (`lesson_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `lesson_notes`
--
ALTER TABLE `lesson_notes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_note` (`user_id`,`lesson_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_progress` (`user_id`,`lesson_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `phrases`
--
ALTER TABLE `phrases`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `ranking_points`
--
ALTER TABLE `ranking_points`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_plan`
--
ALTER TABLE `user_plan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attempts`
--
ALTER TABLE `attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `lesson_notes`
--
ALTER TABLE `lesson_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `phrases`
--
ALTER TABLE `phrases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ranking_points`
--
ALTER TABLE `ranking_points`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user_plan`
--
ALTER TABLE `user_plan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `attempts`
--
ALTER TABLE `attempts`
  ADD CONSTRAINT `attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_2` FOREIGN KEY (`phrase_id`) REFERENCES `phrases` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `lesson_notes`
--
ALTER TABLE `lesson_notes`
  ADD CONSTRAINT `lesson_notes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lesson_notes_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD CONSTRAINT `lesson_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lesson_progress_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `ranking_points`
--
ALTER TABLE `ranking_points`
  ADD CONSTRAINT `ranking_points_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `user_plan`
--
ALTER TABLE `user_plan`
  ADD CONSTRAINT `user_plan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_plan_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
