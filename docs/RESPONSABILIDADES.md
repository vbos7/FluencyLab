# Divisão de Responsabilidades — FluencyLab

O projeto foi dividido em quatro módulos, um por aluno. Cada aluno é responsável
pela parte completa da sua área: escreve os endpoints em PHP e depois conecta as
telas do Next.js que consomem esses endpoints.

## Vinicius — Configurações Iniciais, Prática e Correção por Inteligência Artificial

Responsável pela fundação do projeto e por todo o fluxo de acesso do usuário.
Criou a estrutura do banco de dados (tabelas, chaves primárias e estrangeiras) e
os arquivos compartilhados que todos os outros módulos utilizam: a conexão com o
banco via PDO e o tratamento de CORS e sessão. 

Implementa a listagem de frases de prática com filtros por
categoria e dificuldade, o serviço de integração com a API da OpenAI usando cURL
sem bibliotecas externas, e o endpoint que recebe a tradução do aluno, envia para
a IA avaliar, registra a tentativa no banco e calcula a pontuação obtida. No
frontend, conecta a tela de prática e a exibição do resultado da correção.

## Marcos — Cursos e Aulas

Responsável pelo catálogo de conteúdo da plataforma. Implementa a listagem de
cursos e a página de detalhe de cada curso, que traz as aulas associadas através
de uma consulta com JOIN entre as tabelas de cursos e aulas. No frontend, conecta
a página de listagem de cursos e a página de detalhe individual. Como tarefa
extra, implementa o sistema de comentários por aula.

## Pedro — Autenticação, Perfil e Administração

Implementa o registro de usuário
com hash de senha, o login com sessão PHP, o logout e a visualização e edição do
perfil. No frontend, conecta os formulários de login e registro, o botão de sair
e a proteção de rotas por middleware, além da tela de perfil. Como tarefas
extras, desenvolve o painel administrativo com estatísticas globais e o
gerenciamento de usuários e frases.


## Maurício — Progresso, Ranking e Planos

Responsável por toda a camada de agregação de dados e pela monetização.
Implementa as estatísticas do usuário, o progresso semanal agrupado por período,
o calendário de atividade com níveis de intensidade e o ranking geral com cálculo
de nível — consultas que envolvem COUNT, SUM, GROUP BY e LEFT JOIN. Também
implementa a listagem de planos de assinatura e o processo de contratação. No
frontend, conecta as páginas de progresso, ranking e planos.
