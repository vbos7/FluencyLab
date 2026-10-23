<?php

require_once __DIR__ . '/../cors.php';

require_once __DIR__ . '/../db.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */

require_once __DIR__ . '/../lib/url.php';

// Não existe "quem sou eu?" sem sessão ativa.
// o cookie PHPSESSID existe pra qualquer visitante — o que importa
// é ter $_SESSION['user_id'], que só é gravado no login/registro.
if (!isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);

    exit;
}

// Busca os dados atuais no banco (nome/email podem ter mudado desde o login)
$stmt = $pdo->prepare('SELECT id, name, email, role, avatar FROM users WHERE id = ?');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

// A sessão aponta pra um usuário que não existe mais (ex: conta deletada).
// db.php já esvaziou essa sessão (validar_sessao_logada).
if (!$user) {
    json_out(['error' => 'Não autenticado'], 401);

    exit;
}

json_out([
    'id'     => (int) $user['id'],
    'name'   => $user['name'],
    'email'  => $user['email'],
    'role'   => $user['role'],
    'avatar' => avatar_url($user['avatar']),
]);
