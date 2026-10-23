<?php

require_once __DIR__ . '/cors.php';

require_once __DIR__ . '/db.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */
require_once __DIR__ . '/lib/url.php';

if (!isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);

    exit;
}

$userId = $_SESSION['user_id'];

// ─── GET: devolve os dados do perfil ────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare('SELECT id, name, email, phone, role, avatar, created_at FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $perfil = $stmt->fetch();

    if ($perfil) {
        $perfil['avatar'] = avatar_url($perfil['avatar']); // caminho → URL absoluta
    }
    json_out($perfil);

    exit;
}

// ─── PUT: atualiza nome, email, telefone e (opcionalmente) a senha ──────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body  = json_decode(file_get_contents('php://input'), true);
    $name  = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');
    $phone = trim($body['phone'] ?? '');

    $errors = [];

    if (empty($name)) {
        $errors[] = 'Nome é obrigatório';
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Email inválido';
    }

    // Telefone é opcional; se vier, tem que ter 10 (fixo) ou 11 (celular) dígitos.
    // Validamos pela contagem de dígitos, tolerando a máscara "(11) 99999-9999".
    $phoneDigits = preg_replace('/\D/', '', $phone);

    if ($phone !== '' && (strlen($phoneDigits) < 10 || strlen($phoneDigits) > 11)) {
        $errors[] = 'Telefone inválido';
    }

    // Email precisa ser único — mas o próprio usuário pode manter o dele (id != ?)
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
    $stmt->execute([$email, $userId]);

    if ($stmt->fetch()) {
        $errors[] = 'Este email já está em uso';
    }

    // Troca de senha é OPCIONAL: só entra no fluxo se "new_password" veio preenchido.
    $newPassword      = $body['new_password'] ?? '';
    $changingPassword = $newPassword !== '';

    $stmt = $pdo->prepare('SELECT email, password_hash FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $row = $stmt->fetch();

    // Trocar e-mail OU senha exige a senha ATUAL: com uma sessão roubada, trocar
    // o e-mail e pedir "Esqueci minha senha" bastaria para tomar a conta.
    $changingEmail = strcasecmp($email, $row['email']) !== 0;

    if (($changingEmail || $changingPassword)
        && !password_verify((string) ($body['current_password'] ?? ''), $row['password_hash'])) {
        $errors[] = $changingEmail && !$changingPassword
            ? 'Informe sua senha atual para trocar o e-mail'
            : 'Senha atual incorreta';
    }

    if ($changingPassword) {
        $confirm = $body['new_password_confirmation'] ?? '';

        if (strlen($newPassword) < 8) {
            $errors[] = 'A nova senha precisa ter pelo menos 8 caracteres';
        }

        if ($newPassword !== $confirm) {
            $errors[] = 'A confirmação da nova senha não coincide';
        }
    }

    if (!empty($errors)) {
        json_out(['errors' => $errors], 422);

        exit;
    }

    // Monta o UPDATE incluindo a senha só quando ela está sendo trocada
    if ($changingPassword) {
        $hash = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('UPDATE users SET name = ?, email = ?, phone = ?, password_hash = ? WHERE id = ?');
        $stmt->execute([$name, $email, $phone, $hash, $userId]);
        // As outras sessões caem (a impressão da senha mudou); esta continua.
        $_SESSION['auth_imp'] = auth_impressao($pdo, (int) $userId);
    } else {
        $stmt = $pdo->prepare('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?');
        $stmt->execute([$name, $email, $phone, $userId]);
    }

    // Devolve o perfil atualizado (sem o hash, claro)
    $stmt = $pdo->prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    json_out(['success' => true, 'user' => $stmt->fetch()]);

    exit;
}

// ─── DELETE: o usuário exclui a própria conta ───────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Trava de segurança: não deixa sumir com o último admin (trancaria o painel).
    $stmt = $pdo->prepare('SELECT role FROM users WHERE id = ?');
    $stmt->execute([$userId]);

    if ($stmt->fetchColumn() === 'admin') {
        $totalAdmins = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();

        if ($totalAdmins <= 1) {
            json_out(['error' => 'Não é possível excluir o único administrador'], 422);

            exit;
        }
    }

    // ON DELETE CASCADE limpa attempts, ranking_points, user_plan etc. do usuário.
    $pdo->prepare('DELETE FROM users WHERE id = ?')->execute([$userId]);
    session_destroy();
    json_out(null, 204);

    exit;
}

json_out(['error' => 'Método não permitido'], 405);
