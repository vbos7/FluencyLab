# FluencyLab — auditoria de desempenho

Data: 22/10/2026. Situação: primeira rodada em ambiente **local**, com o banco compartilhado. Não
mede produção. A auditoria geral (segurança, pagamentos, bugs, telas, limpeza) está em
[`auditoria-2026-10.md`](auditoria-2026-10.md).

Estados: **pendente**, **em medição**, **problema confirmado**, **corrigido**, **validado**, **não
aplicável**. Prioridades: P0 bloqueia publicação; P1 afeta jornadas centrais; P2 melhora eficiência;
P3 depende de crescimento. Um checkbox só é marcado com evidência.

## Ambiente e reprodução

| Item | Valor |
| --- | --- |
| Commit | `cac1cfa` + formatação Pint não commitada (sem mudança de comportamento) |
| Hardware | Mac (Apple Silicon), macOS 27 |
| Software | PHP 8.4.22 CLI (`php -S`, sem OPcache), Node 26.4.0, Next.js 16.1.6 (`next build` + `next start`) |
| Banco | MySQL compartilhado (DBaaS) — o mesmo que o time usa |
| Volume | 49 usuários, 100 frases, 3 cursos / 15 aulas |
| Concorrência | 1 requisição por vez, mais um teste de 4 em paralelo |

```bash
APP_ORIGIN=http://localhost:3091 PHP_CLI_SERVER_WORKERS=4 php -S localhost:8092 -t backend
# login com o usuário demo do schema (cookie em cj.txt), depois:
curl -s -b cj.txt -o /dev/null -w '%{http_code} %{time_total}s %{size_download}B\n' http://localhost:8092/api/dashboard.php
```

Use `PHP_CLI_SERVER_WORKERS` > 1. Sem isso o `php -S` atende uma requisição por vez e esconde a trava
de sessão (F-01).

## Medições (tempo total HTTP, 3–5 execuções, quente)

| Endpoint | Tempo | Resposta |
| --- | ---: | ---: |
| `status.php` | 43–88 ms (frio: 300 ms) | 45 B |
| `plans.php` | 51–54 ms | 948 B |
| `courses.php` | 42–72 ms | 557 B |
| `ranking.php` | 45–71 ms | 4,6 KB (todos os 49 usuários) |
| `practice/phrases.php` | 38–113 ms | 13,3 KB (todas as 100 frases, com a resposta `en`) |
| `profile.php` / `my-plan.php` / `user/stats.php` | 33–50 ms | < 140 B |
| `dashboard.php` | 69–93 ms | 1,1 KB |
| `user/calendar.php` | 54–337 ms | 513 B |

**Trava de sessão (F-01):** 4 chamadas em paralelo **com a mesma sessão** (como a Home faz no servidor)
terminaram em 64, 100, 147 e 187 ms, uma depois da outra. As mesmas 4 **sem sessão** terminaram
todas entre 43 e 80 ms. Repeti duas vezes, com o mesmo padrão.

Hoje tudo está abaixo de 100 ms porque há pouco dado. Os itens abaixo são o que cresce com o uso.

## Achados

| ID | Prio | Estado | Jornada / endpoint | Causa | Correção proposta |
| --- | --- | --- | --- | --- | --- |
| F-01 | P2 | problema confirmado | Todas as páginas logadas (Home faz `me` + `status` + `profile` + `dashboard`; Perfil faz 6 chamadas) | `session_start()` em `cors.php` segura a trava do arquivo de sessão até o fim do script, e as chamadas paralelas do mesmo usuário entram em fila. Com o banco remoto em produção, cada degrau fica maior. | `session_write_close()` logo depois de ler `$_SESSION` nos endpoints que só leem (opção em `cors.php`); manter aberta só em login, logout, 2FA, passkey e convidado. |
| F-02 | P2 | problema confirmado | `ranking.php` (Ranking, Perfil, Home top 3) | Devolve **todos** os usuários, sem limite. O Perfil baixa a lista inteira só para achar a posição do aluno. Cresce linearmente com a base. | Parâmetro `limit` (top N) + posição do usuário calculada no SQL (`COUNT(*)` de quem tem mais XP); top 3 da Home com `limit=3`. |
| F-03 | P2 | problema confirmado | `practice/phrases.php` | Devolve todas as frases (13 KB com 100) e o front sorteia uma. Manda também a tradução de referência (`en`), que é a resposta do exercício. | Paginar/sortear no servidor por dificuldade e categoria; não mandar `en` antes da resposta. |
| F-04 | P2 | pendente | `dashboard.php` → `consistencia` | Devolve todos os dias com atividade desde o cadastro; o calendário só usa um ano. | Limitar a 12 meses (como `user/calendar.php`) ou usar só o `calendar.php`. |
| F-05 | P3 | pendente | Painel: `admin/users.php`, `admin/phrases.php` | Listas sem paginação; `users.php` faz 2 subconsultas por linha; `phrases.php` junta todas as tentativas para contar. | Paginação + busca no servidor quando passar de algumas centenas. |
| F-06 | P3 | pendente | `attempts`, `ranking_points` | Só há índice de `user_id` (da FK). Os filtros usam `user_id` + data e `DATE(created_at) = CURDATE()` (`admin/stats.php`), que não usa índice. | Índices `(user_id, created_at)` e `(user_id, earned_at)`; trocar `DATE(x) = CURDATE()` por intervalo. Medir com `EXPLAIN` quando houver volume. |
| F-07 | P3 | pendente | `practice/check-answer.php` | Chamada síncrona à OpenAI (1–3 s, timeout de 30 s) e streak recalculado lendo todos os dias do aluno a cada resposta. | Timeout menor com mensagem clara; streak limitado aos últimos dias. |
| F-08 | P2 | problema confirmado | `/practice` | Erro de hidratação #418: o navegador descarta o HTML do servidor e renderiza de novo. | Ver B4 na auditoria geral. |
| F-09 | P3 | pendente | Home | Modal de upsell faz `GET /my-plan.php` no navegador, embora a página já possa saber no servidor. | Passar `isPro` do Server Component. |

## Checklist

### 1. Baseline e observabilidade — P1
- [x] Medir tempo e tamanho dos endpoints principais em ambiente local. *(tabela acima)*
- [ ] Repetir as mesmas medições em produção (latência real até o DBaaS e PHP-FPM com OPcache).
- [ ] Massa sintética maior (ex.: 5 mil usuários, 500 mil tentativas) em banco **local** separado, nunca no compartilhado.
- [ ] Log de tempo por request (endpoint, status, ms) sem dados pessoais; alerta para 5xx.

### 2. Backend PHP — P1
- [ ] F-01: liberar a sessão nos endpoints de leitura e medir de novo o teste paralelo.
- [ ] Conexão PDO: avaliar conexão persistente se a latência até o DBaaS for alta em produção.
- [ ] Confirmar OPcache ligado e `pm.max_children` dimensionado no PHP-FPM do Forge.

### 3. API e contratos — P1
- [ ] F-02, F-03, F-04: limitar coleções que crescem sem limite.
- [ ] F-05: paginação no painel.
- [ ] Unificar o formato de erro (ver auditoria geral, seção 6).

### 4. Banco — P2
- [ ] F-06: índices compostos, com `EXPLAIN` antes e depois.
- [ ] Rodar migrações de índice fora do horário de uso.

### 5. Frontend — P2
- [ ] F-08: corrigir a hidratação da prática.
- [x] Chamadas do servidor em paralelo (`Promise.all`) nas páginas. *(já é assim; o gargalo é o F-01)*
- [ ] F-09: evitar chamadas do navegador para dados que o servidor já tem.
- [ ] Medir LCP/INP/CLS no build de produção, em celular com CPU e rede limitadas.

### 6. Cache e consistência — P2
- [ ] `fetchFromApi` usa `cache: "no-store"` em tudo. Avaliar cache curto só para dados públicos (`plans`, `courses`, `status`) e nunca para dados do usuário.
- [ ] Dados que dependem da sessão nunca em cache compartilhado (conferir cabeçalhos `Cache-Control` da API).

## Ordem

1. F-01 (pequeno, ganho em todas as páginas logadas).
2. F-02 e F-03 (limites de coleção; F-03 também tira a resposta do navegador).
3. F-08 (hidratação).
4. Medir em produção; só então F-04 a F-07 conforme o volume real.
