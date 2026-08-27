<?php

require_once __DIR__.'/cors.php';
require_once __DIR__.'/db.php';

if (! isset($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);
    exit;
}

$userId = $_SESSION['user_id'];

// ─── GET: devolve os dados do perfil ────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    json_out($stmt->fetch());
    exit;
}

// ─── PUT: atualiza nome, email, telefone e (opcionalmente) a senha ──────────
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body = json_decode(file_get_contents('php://input'), true);
    $name = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');
    $phone = trim($body['phone'] ?? '');

    $errors = [];

    if (empty($name)) {
        $errors[] = 'Nome é obrigatório';
    }
    if (empty($email) || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Email inválido';
    }

    // Email precisa ser único — mas o próprio usuário pode manter o dele (id != ?)
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
    $stmt->execute([$email, $userId]);
    if ($stmt->fetch()) {
        $errors[] = 'Este email já está em uso';
    }

    // Troca de senha é OPCIONAL: só entra no fluxo se "new_password" veio preenchido.
    $newPassword = $body['new_password'] ?? '';
    $changingPassword = $newPassword !== '';

    if ($changingPassword) {
        $currentPassword = $body['current_password'] ?? '';
        $confirm = $body['new_password_confirmation'] ?? '';

        // Confere a senha ATUAL antes de deixar trocar (segurança básica)
        $stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $row = $stmt->fetch();

        if (! password_verify($currentPassword, $row['password_hash'])) {
            $errors[] = 'Senha atual incorreta';
        }
        if (strlen($newPassword) < 6) {
            $errors[] = 'A nova senha precisa ter pelo menos 6 caracteres';
        }
        if ($newPassword !== $confirm) {
            $errors[] = 'A confirmação da nova senha não coincide';
        }
    }

    if (! empty($errors)) {
        json_out(['errors' => $errors], 422);
        exit;
    }

    // Monta o UPDATE incluindo a senha só quando ela está sendo trocada
    if ($changingPassword) {
        $hash = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('UPDATE users SET name = ?, email = ?, phone = ?, password_hash = ? WHERE id = ?');
        $stmt->execute([$name, $email, $phone, $hash, $userId]);
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
