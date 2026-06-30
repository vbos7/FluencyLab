# Guia de Desenvolvimento — Backend FluencyLab

## 1. Introdução

Este guia existe para alinhar como o time (3 pessoas) vai construir o backend do FluencyLab em Laravel **e conectá-lo ao frontend em Next.js já existente**. Duas pessoas do time tiveram contato com PHP recentemente e estão começando agora com Laravel — e nenhuma delas é especialista em Next.js também — por isso este documento (e principalmente o site de tarefas linkado abaixo) explica os conceitos dos dois lados antes de simplesmente listar tarefas. Se você já conhece Laravel e Next.js, pode pular direto para a seção 8 (Divisão de tarefas).

O que este guia cobre: arquitetura do projeto, conceitos básicos de Laravel, como rodar o ambiente, convenções de código, fluxo de Git, um checklist para criar qualquer feature do zero, a divisão de trabalho entre o time e a modelagem de dados de referência. As tarefas práticas (incluindo a integração com o Next.js) ficam no site de tarefas linkado logo abaixo.

O que ele **não** cobre: deploy em produção (assunto para mais adiante).

> 👉 Se você só quer começar a programar, vá direto para o **[site de tarefas guiadas](tarefas/index.html)** — uma página por tarefa, em ordem, cobrindo tanto o backend (Laravel) quanto a integração no frontend (Next.js), com passo a passo e comparação com o que vocês já sabem (PHP puro / JavaScript básico). Este documento aqui é a referência de processo/ambiente/convenções por trás daquelas tarefas.

## 2. Visão geral da arquitetura

```
Navegador → Next.js (porta 3000) → Nginx (porta 8000) → PHP-FPM (Laravel) → MySQL (porta 3306)
```

Cada peça roda em um container Docker separado (veja `docker-compose.yml` na raiz do projeto):

- **frontend**: a aplicação Next.js, serve as páginas que o usuário vê.
- **nginx**: recebe as requisições HTTP na porta 8000 e repassa para o PHP-FPM via protocolo FastCGI.
- **backend**: o PHP-FPM rodando o código Laravel. Ele não escuta uma porta HTTP diretamente — é o Nginx quem fala com ele.
- **mysql**: o banco de dados.

**Por que existe um Nginx separado, e não só `php artisan serve`?** O `php artisan serve` é um servidor de desenvolvimento simples, de um único processo, bom para rodar localmente sem Docker. Em um ambiente com múltiplos containers, é mais realista (e mais parecido com produção) ter um servidor web de verdade (Nginx) na frente do PHP, falando o protocolo FastCGI com o `php-fpm`. É por isso que o `docker-compose.yml` tem um serviço `nginx` e um serviço `backend` separados — o Nginx é a "porta de entrada", o backend é quem executa o código PHP.

O frontend fala com a API através de `NEXT_PUBLIC_API_URL=http://localhost:8000/api` (configurado no `docker-compose.yml`).

## 3. Conceitos básicos de Laravel

Se você nunca usou um framework PHP, os termos abaixo vão aparecer o tempo todo. Uma analogia rápida para cada um:

- **Migration**: um arquivo PHP que descreve uma alteração na estrutura do banco de dados (criar uma tabela, adicionar uma coluna). Pense como um "commit do Git", mas para o schema do banco — cada migration é um passo, e rodar `php artisan migrate` aplica todos os passos pendentes em ordem.

- **Model**: uma classe PHP que representa uma tabela do banco. Por exemplo, a classe `User` representa a tabela `users`. Você não escreve SQL na mão — interage com a tabela através de métodos do Model.

- **Eloquent ORM**: é o "tradutor" do Laravel entre PHP e SQL. Em vez de escrever `SELECT * FROM users WHERE id = 1`, você escreve `User::find(1)`. O Eloquent monta o SQL por trás dos panos.

- **Controller**: uma classe que recebe a requisição HTTP (depois que ela já passou pela rota) e decide o que fazer — buscar dados, validar, salvar, e devolver uma resposta (geralmente JSON, no nosso caso).

- **Rota**: a "ponte" entre uma URL e um Controller. Fica definida em `routes/api.php`. Exemplo: `Route::get('/cursos', [CourseController::class, 'index']);` diz "quando alguém fizer GET em /api/cursos, chame o método `index` do `CourseController`".

- **Middleware**: uma camada que intercepta a requisição antes (ou depois) dela chegar no Controller. O exemplo mais importante para nós é `auth:sanctum` — ele verifica se a requisição tem um token válido antes de deixar passar. Se não tiver, a requisição nem chega no Controller, e o middleware já responde com 401.

- **Sanctum**: o pacote que cuida de autenticação por token. Pense num token como um "crachá": quando o usuário faz login, a API gera um crachá (uma string aleatória) e devolve para o frontend. Em toda requisição seguinte, o frontend manda esse crachá no header (`Authorization: Bearer <token>`), e o Sanctum confere se o crachá é válido para saber quem é o usuário.

- **Relacionamentos Eloquent** (`hasMany` / `belongsTo`): forma de declarar, no próprio Model, como duas tabelas se relacionam. Exemplo: um `Course` tem várias `Lesson`s, e cada `Lesson` pertence a um `Course`:

```php
// app/Models/Course.php
public function lessons()
{
    return $this->hasMany(Lesson::class);
}

// app/Models/Lesson.php
public function course()
{
    return $this->belongsTo(Course::class);
}
```

Com isso, `$course->lessons` já devolve a lista de aulas daquele curso, sem você escrever nenhum JOIN manualmente.

## 4. Ambiente de desenvolvimento

### Pré-requisitos

- Docker Desktop instalado e rodando.
- Git.

### Primeiro setup

```bash
git clone git@github.com:vbos7/FluencyLab.git
cd FluencyLab
cp backend/.env.example backend/.env
docker compose up --build -d
docker compose exec backend php artisan migrate
```

Depois disso:
- Frontend: http://localhost:3000
- API: http://localhost:8000/api

### Comandos do dia a dia

```bash
# Rodar qualquer comando artisan dentro do container
docker compose exec backend php artisan migrate
docker compose exec backend php artisan migrate:fresh   # apaga tudo e recria as tabelas
docker compose exec backend php artisan tinker           # console interativo para testar código PHP/Eloquent

# Ver logs de um serviço
docker compose logs -f backend

# Depois de mexer no composer.json (adicionar uma lib nova)
docker compose exec backend composer install

# Parar tudo
docker compose down

# Subir de novo (sem rebuild, se não mudou Dockerfile)
docker compose up -d
```

### Pegadinha comum: a pasta `vendor/`

O `docker-compose.yml` monta `./backend:/var/www/html` como volume — ou seja, o container enxerga os mesmos arquivos que você edita no seu editor, em tempo real (por isso não precisa rebuildar a imagem toda vez que você muda um arquivo PHP). Só que a pasta `vendor/` (onde ficam as dependências do Composer) é tratada separadamente: ela vive **dentro do container**, isolada do seu computador. Isso evita conflito entre dependências instaladas no seu Mac/Linux e as instaladas dentro do container Linux do Docker.

Na prática, isso significa: **sempre que adicionar uma dependência nova no `composer.json`, rode `composer install` (ou `composer require`) DENTRO do container** (`docker compose exec backend composer ...`), não no seu terminal local. Se você rodar localmente, o `vendor/` vai existir no seu computador mas não vai aparecer dentro do container.

## 5. Convenções de código

- **Tabelas**: plural, snake_case (`courses`, `personal_access_tokens`).
- **Models**: singular, PascalCase (`Course`, `User`). O Eloquent já assume essa convenção automaticamente — `Course` mapeia para `courses` sem precisar configurar nada.
- **Validação**: use Form Requests (`php artisan make:request StoreCourseRequest`) em vez de validar dentro do Controller. Mantém o Controller enxuto e a validação reutilizável.
- **Resposta da API**: use API Resources (`php artisan make:resource CourseResource`) para formatar o JSON de saída. Isso garante que os 3 módulos (Auth, Cursos, Progress/Ranking) devolvam respostas com um formato consistente, mesmo sendo pessoas diferentes implementando.

## 6. Padrão de commits e branches

O frontend já usa um padrão — vamos manter o mesmo no backend:

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- **Branches**: `feature/LAB-XX-descricao-curta`, onde `LAB-XX` é o número do ticket.
- **Merge**: via Pull Request no GitHub, com pelo menos uma revisão de outra pessoa do time antes de mergear em `develop`.

## 7. Checklist: como criar uma feature do zero

Essa é a receita genérica que cada pessoa vai repetir para o seu módulo. Use como checklist:

1. Criar a branch: `git checkout -b feature/LAB-XX-nome-da-feature`
2. Criar a migration: `docker compose exec backend php artisan make:migration create_courses_table`
3. Editar a migration (definir as colunas) e rodar: `docker compose exec backend php artisan migrate`
4. Criar o Model: `docker compose exec backend php artisan make:model Course` — definir `$fillable` e relacionamentos
5. Se a rota recebe dados do usuário (POST/PUT), criar um Form Request: `docker compose exec backend php artisan make:request StoreCourseRequest`
6. Criar o Controller: `docker compose exec backend php artisan make:controller CourseController --api` (o `--api` já gera os métodos `index`, `store`, `show`, `update`, `destroy`)
7. Registrar a rota em `routes/api.php`
8. Testar manualmente com `curl`, Postman ou Insomnia
9. (Opcional nesta fase — ver seção 11) Escrever um teste com PHPUnit
10. Commit, push, abrir Pull Request, pedir review de outra pessoa do time

## 8. Divisão de tarefas e sprints

Divisão por **módulo de domínio**: cada pessoa fica responsável por um conjunto de funcionalidades fim-a-fim — migration → model → controller → rotas **e depois a integração daquele pedaço no frontend Next.js** (tarefas 24 a 36 do site de tarefas) — não por uma camada técnica isolada, e não parando no backend.

### Quem cuida do quê

**Pessoa A — Auth + Users + Profile + Admin**
`users` + coluna `role`, Sanctum (login/registro/logout), edição de perfil, rotas de admin protegidas por `role:admin`.

**Pessoa B — Cursos + Practice**
`courses`, `lessons`, `phrases`, `attempts`. Listagem de cursos, serviço de correção por IA (`AiCorrectionService`, adaptado de `~/Developer/english-practice`), submissão de traduções.

**Pessoa C — Progress + Ranking + Planos**
Progress (derivado das tentativas de B), `ranking_points` (pontuação), `plans`/`user_plan` (assinaturas).

### Por que essa ordem de dependência

A dependência real **não** é "Auth precisa estar 100% pronto antes de tudo". O que precisa estar pronto cedo é só a **estrutura** da tabela `users` (com a coluna `role`) e o Sanctum instalado — porque os módulos de B e C vão referenciar `user_id` em chaves estrangeiras desde a primeira migration deles. Isso já está pronto (ver seção 9).

### Sprints sugeridas

- **Sprint 1** (paralelo, baixo acoplamento): A implementa registro/login/logout/me. B cria `courses`/`lessons`/`phrases` com dados de teste e rotas públicas de listagem, e já adianta o `AiCorrectionService` (testável isolado via `tinker`, sem depender de rota nem de Auth). C cria `plans`/`user_plan` (não depende de quase nada) e alinha com B o formato exato da tabela `attempts` antes dela ser criada.

- **Sprint 2** (integração com Auth): B implementa a rota de submissão de tradução (`POST /api/practice/check-answer`), agora protegida por `auth:sanctum`, usando o `AiCorrectionService` e gravando o `user_id` do usuário logado. C implementa as queries de Progress e a tabela `ranking_points` — uma boa forma de creditar pontos automaticamente é usar um [Eloquent Observer](https://laravel.com/docs/eloquent#observers) no model `Attempt`, que dispara sempre que uma tentativa é criada. A implementa as rotas de Admin.

- **Sprint 3** (polimento do backend): revisão cruzada entre módulos (cada pessoa revisa pelo menos um módulo de outra pessoa), leaderboard paginado, fluxo de assinatura de plano.

- **Sprint 4** (integração no frontend, tarefas 24-36 do site de tarefas): cada pessoa conecta no Next.js exatamente o módulo que construiu no backend. Começa pela tarefa 24 (setup do cliente de API — feito uma vez só, por quem fizer primeiro). Só faz sentido começar essa sprint depois que a rota correspondente já existe e foi testada via `curl`/Postman.

## 9. Modelagem de dados de referência

Convenção: tabelas plural snake_case, models singular PascalCase. Esta não é uma lista exaustiva — só o suficiente para cada pessoa começar.

| Módulo | Tabela | Campos principais | Observações |
|---|---|---|---|
| Auth/Users | `users` | `name`, `email`, `password`, **`role`** (`admin`/`student`, default `student`) | Já criada (ver seção 10). Perfil fica na própria tabela `users` por enquanto — sem `profiles` separada, para reduzir joins. |
| Auth/Users | `personal_access_tokens` | — | Criada automaticamente pelo Sanctum. |
| Cursos | `courses` | `slug`, `title`, `description`, `level`, `order` | |
| Cursos | `lessons` | `course_id`, `title`, `duration`, `youtube_id`, `order` | Um único nível dentro de `courses` por enquanto (sem `modules` intermediário). |
| Practice | `phrases` | `pt`, `en` (tradução de referência), `difficulty`, `category` | Não é múltipla escolha — são frases para o usuário traduzir. |
| Practice | `attempts` | `user_id`, `phrase_id`, `answer_given`, `ai_feedback` (JSON), `is_correct`, `score`, `xp_earned` | A correção é **por IA** (ver `AiCorrectionService`, adaptado de `~/Developer/english-practice`), não por similaridade de texto. `ai_feedback` guarda a resposta completa da IA; `score` (0-100) alimenta o cálculo de XP. Tabela-ponte: Progress e Ranking consomem ela. |
| Progress | — | — | **Sem tabela própria** por enquanto — calcular via query agregada sobre `attempts` (ex: % de acerto por curso). Evita manter duas fontes de verdade sincronizadas. |
| Ranking | `ranking_points` | `user_id`, `points`, `reason`, `earned_at` | Ao contrário de Progress, esta tabela **deve** existir desde o início — é um log de eventos auditável (cada linha = um motivo de pontuação), o que facilita implementar regras como bônus por sequência de dias. |
| Planos | `plans` | `name`, `price`, `description`, `features` (JSON), `billing_period` | |
| Planos | `user_plan` | `user_id`, `plan_id`, `started_at`, `expires_at`, `status` | Tabela pivot. |
| Admin | — | — | Sem tabelas próprias — é uma camada de autorização (`role` em `users`) + rotas que consultam os outros módulos. |

## 10. O que já está pronto

- Laravel 13 instalado em `backend/`, rodando em PHP 8.4-fpm via Docker.
- Laravel Sanctum instalado e configurado em **modo API token (Bearer)** — não modo SPA com cookies. Isso é mais simples (não exige configuração fina de CORS/cookies same-site) e adequado a um frontend Next.js como cliente separado.
- Migration de `users` com a coluna `role` (`admin`/`student`, default `student`).
- `routes/api.php` já tem a rota de exemplo `GET /api/user` (protegida por `auth:sanctum`), que serve como referência de rota autenticada.
- Requisições não autenticadas para `/api/*` sempre devolvem JSON 401 (configurado em `AppServiceProvider`), independente do cliente mandar ou não o header `Accept: application/json` — evita uma pegadinha comum ao testar a API com `curl` puro.

## 11. FAQ / Problemas comuns

**"Class not found" depois de mudar dependências no `composer.json`**
Você provavelmente rodou `composer install`/`composer require` no seu terminal local em vez de dentro do container. Rode `docker compose exec backend composer install` (veja a seção 4, "Pegadinha comum").

**Erro de permissão na pasta `storage/` ou `bootstrap/cache/`**
`docker compose exec backend chown -R www-data:www-data storage bootstrap/cache`

**`/api/user` (ou outra rota protegida) sempre retorna 401 mesmo mandando o token**
Confira se o header está exatamente `Authorization: Bearer <token>` (com "Bearer " antes do token) e se o token não expirou/foi revogado.

**MySQL não sobe / backend não conecta no banco**
O `docker-compose.yml` já tem um healthcheck que faz o `backend` esperar o `mysql` estar pronto antes de subir. Se mesmo assim der erro de conexão, rode `docker compose logs mysql` para ver se o container do banco realmente terminou de inicializar.

**Migration não roda / "table already exists"**
Use `docker compose exec backend php artisan migrate:fresh` para apagar todas as tabelas e rodar as migrations do zero (cuidado: isso apaga os dados).

## 12. Fase 2 / próximos passos

Itens conscientemente adiados para depois que o time estiver mais confortável com Laravel:

- **L5-Swagger**: documentação automática da API (OpenAPI/Swagger UI).
- **Pest**: framework de testes mais moderno (por enquanto, o PHPUnit que já vem padrão no Laravel é suficiente).
- Avaliar se vale a pena extrair uma tabela `profiles` separada de `users`, caso o número de campos de perfil cresça muito.
- Avaliar se `progress` precisa virar uma tabela própria, caso as queries agregadas sobre `attempts` fiquem lentas.
