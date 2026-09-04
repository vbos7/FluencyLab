<?php

require_once __DIR__.'/../cors.php';

require_once __DIR__.'/../db.php';
require_once __DIR__.'/../lib/login-throttle.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);

    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';
// "Manter conectado": sessão de 30 dias em vez de morrer ao fechar o navegador.
$remember = ! empty($body['remember']);

if (empty($email) || empty($password)) {
    json_out(['errors' => ['Email e senha são obrigatórios']], 422);

    exit;
}

// Anti-força-bruta: barra se e-mail ou IP já estourou o limite de falhas recentes.
$ip = client_ip();
if (login_bloqueado($pdo, $email, $ip)) {
    json_out(['errors' => ['Muitas tentativas de login. Aguarde alguns minutos e tente novamente.']], 429);

    exit;
}

$stmt = $pdo->prepare('SELECT id, name, email, password_hash, role, two_factor_confirmed_at FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

// password_verify() compara a senha com o hash salvo
if (! $user || ! password_verify($password, $user['password_hash'])) {
    login_registrar_falha($pdo, $email, $ip);
    json_out(['errors' => ['Credenciais inválidas']], 401);

    exit;
}

// Senha correta → zera o contador de falhas desse e-mail.
login_limpar($pdo, $email);

// Admin com 2FA ativo: a senha sozinha NÃO loga. Guardamos um estado
// "pendente" e o front precisa completar em /auth/two-factor-challenge.php com
// o código do autenticador. Usuários comuns nunca entram aqui (só email+senha).
if ($user['role'] === 'admin' && $user['two_factor_confirmed_at'] !== null) {
    // Não gravamos user_id ainda — sessão só vira "logada" após o 2º fator.
    // A preferência de "manter conectado" fica guardada para o 2º fator aplicar.
    unset($_SESSION['user_id']);
    $_SESSION['2fa_pending_user_id'] = (int) $user['id'];
    $_SESSION['remember_pref'] = $remember;

    json_out(['two_factor' => true]);

    exit;
}

// O papel NÃO é guardado na sessão: a autorização de admin lê users.role do banco
// (ver admin/guard.php e /auth/me.php), fonte única de verdade.
$_SESSION['user_id'] = $user['id'];
aplicar_remember($remember);

json_out([
    'success' => true,
    'user' => [
        'id' => (int) $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
    ],
]);
