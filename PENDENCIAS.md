# ✅ Pendências do FluencyLab

Lista simples pra o grupo acompanhar. Marque `[x]` quando terminar e coloque seu
nome do lado. Última atualização: 2026-10-22 (ver também `docs/auditoria-2026-10.md`).

> Como marcar: troque `- [ ]` por `- [x]` e adicione `— (seu nome)` no fim da linha.

---

## 🔌 Funcionalidades ainda não ligadas na API

- [ ] **Notificações do admin** — a tela existia sem backend (os interruptores não
  faziam nada) e foi removida na auditoria de 2026-10. Se voltar, precisa de API +
  envio de e-mail de verdade.
- [ ] **Sons de feedback e lembretes diários (aluno)** — também removidos das
  configurações por não terem efeito.

---

## 🎓 Gerenciamento de cursos e pessoas (falta praticamente inteiro)

O painel tem usuários (lista genérica), cursos e aulas, frases, categorias, dashboard
e configurações.

- [x] **Cursos** — criar, editar, excluir e listar cursos no painel.
- [x] **Aulas** — gerenciar as aulas de cada curso (título, vídeo, duração, ordem,
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

- [x] **Frases favoritadas de verdade** — hoje ficam só no `localStorage` do navegador
  (`fluency-lab:favorites`) e usam a lista estática `FRASES`, não o banco. Falta API +
  tabela pra favoritar **frases reais** e persistir por usuário.
  Arquivos: `frontend/app/_components/practice/practice-controller.tsx` e
  `frontend/app/_components/profile/favorite-questions.tsx`.
- [x] **Relatório de evolução semanal detalhado (Premium) no perfil** — o perfil só
  mostra o `PremiumCard`; falta o relatório semanal detalhado liberado **só pra
  assinantes Pro**. Dá pra reaproveitar o endpoint `backend/api/user/progress-weekly.php`
  e o `frontend/app/_components/progress/weekly-chart.tsx` (já usados em `/progress`).
- [x] **Escolher a categoria da questão na prática (Premium)** — a prática só deixa
  escolher **dificuldade**; falta o seletor de **categoria** liberado pra Pro.
  O backend `backend/api/practice/phrases.php` já aceita `?category=` / `?category_id=`,
  então falta só a UI + a trava de premium.

---

## 🧹 Limpeza / opcionais (não urgente)

- [x] Remover código morto (`plan-cards.tsx`, `login-form.tsx` antigo, lista estática
  `FRASES`, componentes de UI sem uso) — auditoria 2026-10.
- [x] Declarar licença no `backend/composer.json` (`"license": "proprietary"`).

---

## ✔️ Já concluído (pra referência)

- [x] Autenticação lê o papel (`role`) direto do banco, sem guardar na sessão (corrige o 403 do painel).
- [x] Padronização dos types do front (domínio em `_lib/*.ts`, `Props` locais inline).
- [x] Remoção dos dados fake (`const USER`) de home e perfil — tudo vem do banco.
- [x] Tempo de estudo real na página de progresso.
- [x] Normalização do banco implementada no código (schema + endpoints).
- [x] Anotações `@var PDO $pdo` e extensões declaradas no `composer.json` (pdo, pdo_mysql, fileinfo, mbstring).
- [x] Correção dos avisos de ESLint em `curso-client.tsx` (setState em efeito / deps).
- [x] **Sistema de subir de nível**: backend (`check-answer.php`) devolve `leveled_up`/`level`; modal de comemoração com confete e "tremidinha" a cada 2s, tudo respeitando `prefers-reduced-motion`.
- [x] **Fórmula de nível do admin** corrigida (`admin/users.php` e `admin/top-users.php`) para a triangular, batendo com `ranking.php` e o front.
- [x] **Prática como convidado** (sem login), limitada a 5 questões: teto no backend por sessão + por IP e UI de "modo convidado" com CTA de cadastro.
- [x] **"Manter conectado"** (sessão de 30 dias) no login + correção do logout automático (`session.gc_maxlifetime` estava em ~24min).
- [x] **Login do painel** (`/admin/login`) idêntico ao público, com passkey acima do e-mail; middleware redireciona `/admin/*` sem sessão para `/admin/login`.
- [x] **Logos atualizados** (login, sidebar do admin, hero da landing) para o logo real; título "Painel FluencyLab" na tela do painel.
- [x] **Toast de XP** redesenhado e **modal de level-up** via portal (fundo escuro cobrindo a tela inteira).
- [x] **`API_BASE_URL`** documentada no `.env.example` e com fallback para `NEXT_PUBLIC_API_URL` no `server-api.ts`.
- [x] Deploy full-stack no Forge (composer no backend, `.env` do front, `/etc/hosts` p/ latência) e rotação dos segredos expostos.
- [x] **Foto de perfil salva de verdade** (Marcos): endpoint `avatar-upload.php` (auth, valida MIME pelo conteúdo, limite 2MB, remove a antiga) + upload no perfil e avatares no ranking. Revisado: tirei o `console.log` de debug, o `any` do `catch`, o upload de teste que foi commitado e ajustei o `.gitignore` (`backend/api/uploads/`).
- [x] **Rate limiting de login** (por e-mail e IP) + validação de telefone no servidor e máscara no cliente; campos numéricos do painel bloqueando negativos.
- [x] **2FA endurecido**: input restrito (6 dígitos / código de recuperação), validação de formato no servidor e trava anti-força-bruta (5 tentativas).
- [x] **Esqueci minha senha** (equipe): fluxo ligado à API — `forgot-password.php` + `reset-password.php` + envio de e-mail via PHPMailer (`config/mail.php`); dialog do front sem os TODOs.
- [x] **Schema unificado**: `comments` e `lesson_notes` trazidos pro `schema.sql` (fonte única) e o dump `schema (2).sql` removido; corrige o 500 dos comentários.
- [x] **Configurações do painel agora têm efeito** (via `lib/settings.php`): `xp_per_phrase` (XP base escalado por qualidade), `streak_bonus` (XP ×bônus em streak ≥ 2 dias), `ranking_public` (desligado → só admin vê o ranking), `new_registrations` (bloqueia cadastro com 403), `maintenance_mode` (tela de manutenção no `NavLayout` p/ não-admins via `status.php`).
