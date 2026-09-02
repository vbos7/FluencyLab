# ✅ Pendências do FluencyLab

Lista simples pra o grupo acompanhar. Marque `[x]` quando terminar e coloque seu
nome do lado. Última atualização: 2026-08-28.

> Como marcar: troque `- [ ]` por `- [x]` e adicione `— (seu nome)` no fim da linha.

---

## 🔌 Funcionalidades ainda não ligadas na API

Telas que existem no front mas ainda têm `TODO` sem backend:

- [ ] **Esqueci minha senha** (`frontend/app/_components/auth/forgot-password-dialog.tsx`)
  — 3 passos sem API: enviar código, validar código e atualizar a senha.
- [ ] **Foto de perfil não salva** (`frontend/app/_components/profile/avatar-upload.tsx:27`)
  — ao escolher a foto e clicar em **Atualizar** não acontece nada: só mostra o
  preview local, o arquivo nunca é enviado pra API nem persistido.
  (O painel admin já tem `backend/api/admin/profile/avatar.php` como referência.)
- [ ] **Notificações do admin** (`frontend/app/admin/(panel)/notificacoes/page.tsx:51`)
  — falta o `PATCH /api/admin/notifications` para marcar como lida.

---

## 🎮 Configurações do painel que não têm efeito no sistema

As telas de configuração salvam na tabela `settings`, mas **nenhum endpoint lê esses
valores** — ou seja, mudar no painel só altera o banco e não muda nada no jogo/plataforma.
Falta ligar cada configuração à lógica de verdade.

Arquivos: `frontend/app/admin/(panel)/configuracoes/page.tsx` + `backend/api/admin/settings.php`.

- [ ] **Gamificação → `xp_per_phrase`** — o XP hoje é fixo em `calcularXp($score)`
  (`backend/api/practice/check-answer.php`), ignora a configuração.
- [ ] **Gamificação → `streak_bonus`** — não é aplicado em nenhum cálculo de sequência.
- [ ] **Acesso → `ranking_public`** — o ranking (`backend/api/ranking.php`) não checa isso.
- [ ] **Acesso → `new_registrations`** — o cadastro (`backend/api/auth/register.php`)
  não bloqueia novos registros quando desativado.
- [ ] **Acesso → `maintenance_mode`** — não existe nenhuma barreira de manutenção; o
  valor é ignorado.

---

## 🎓 Gerenciamento de cursos e pessoas (falta praticamente inteiro)

Hoje o painel só tem: usuários (lista genérica), frases, categorias, dashboard, config,
notificações. **Não existe** gestão de cursos. Precisamos de um CRUD completo:

- [ ] **Cursos** — criar, editar, excluir e listar cursos no painel.
- [ ] **Aulas** — gerenciar as aulas de cada curso (título, vídeo, duração, ordem,
  aula gratuita x Pro/bloqueada).
- [ ] **Alunos** — visão dedicada de alunos (progresso, plano, atividade), separada da
  lista genérica de usuários.
- [ ] **Professores** — cadastrar/gerenciar professores e o papel `professor`
  (hoje só existem `student`/`admin`).
- [ ] **Papéis/permissões** — definir o que cada papel (aluno, professor, admin) pode
  fazer no painel.
- [ ] **Moderação de comentários** — listar, responder e excluir comentários das aulas
  (tabela `comments` já existe; falta a tela e a API de moderação).
- [ ] **Verificação da plataforma** — fluxo de revisão/aprovação de conteúdo
  (cursos/aulas/frases) antes de ficar público. *(Confirmar com o grupo o escopo exato
  do que é "verificação".)*

---

## 🎯 Progressão, favoritas e recursos Premium

- [ ] **Sistema de subir de nível conforme o XP** — hoje o nível é apenas
  calculado/exibido (`level = floor(xp/150)+1`); falta o **evento de subir de nível**
  (feedback/animação/notificação quando o usuário cruza o limiar de XP e muda de nível).
- [ ] **Frases favoritadas de verdade** — hoje ficam só no `localStorage` do navegador
  (`fluency-lab:favorites`) e usam a lista estática `FRASES`, não o banco. Falta API +
  tabela pra favoritar **frases reais** e persistir por usuário.
  Arquivos: `frontend/app/_components/practice/practice-controller.tsx` e
  `frontend/app/_components/profile/favorite-questions.tsx`.
- [ ] **Relatório de evolução semanal detalhado (Premium) no perfil** — o perfil só
  mostra o `PremiumCard`; falta o relatório semanal detalhado liberado **só pra
  assinantes Pro**. Dá pra reaproveitar o endpoint `backend/api/user/progress-weekly.php`
  e o `frontend/app/_components/progress/weekly-chart.tsx` (já usados em `/progress`).
- [ ] **Escolher a categoria da questão na prática (Premium)** — a prática só deixa
  escolher **dificuldade**; falta o seletor de **categoria** liberado pra Pro.
  O backend `backend/api/practice/phrases.php` já aceita `?category=` / `?category_id=`,
  então falta só a UI + a trava de premium.

---

## 🧹 Limpeza / opcionais (não urgente)

- [ ] Remover código morto: `frontend/app/_components/pricing/plan-cards.tsx`
  (`PlanCards`) não é usado em lugar nenhum.
- [ ] Declarar licença no `backend/composer.json` (`"license": "proprietary"`) —
  o `composer validate` avisa que está faltando. Cosmético.

---

## ✔️ Já concluído (pra referência)

- [x] Autenticação lê o papel (`role`) direto do banco, sem guardar na sessão (corrige o 403 do painel).
- [x] Padronização dos types do front (domínio em `_lib/*.ts`, `Props` locais inline).
- [x] Remoção dos dados fake (`const USER`) de home e perfil — tudo vem do banco.
- [x] Tempo de estudo real na página de progresso.
- [x] Normalização do banco implementada no código (schema + endpoints).
- [x] Anotações `@var PDO $pdo` e extensões declaradas no `composer.json` (pdo, pdo_mysql, fileinfo, mbstring).
- [x] Correção dos avisos de ESLint em `curso-client.tsx` (setState em efeito / deps).
