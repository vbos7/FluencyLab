<?php

/**
 * POST   /api/admin/profile/avatar.php   (multipart, campo "avatar")  → envia/atualiza
 * DELETE /api/admin/profile/avatar.php                                → remove
 *
 * Salva o arquivo em backend/public/uploads/avatars/ e guarda o caminho relativo
 * (ex.: "public/uploads/avatars/u3_ab12.png") em users.avatar. Devolve sempre a
 * URL ABSOLUTA, pois o front está em outra origem.
 */

require_once __DIR__.'/../guard.php';
require_once __DIR__.'/../../lib/url.php';

requireAdmin();

$userId = (int) $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

// docroot é backend/, então tudo dentro de public/ fica acessível na web.
$publicDir = __DIR__.'/../../../public';
$uploadRel = 'public/uploads/avatars';       // prefixo guardado no banco
$uploadDir = $publicDir.'/uploads/avatars';  // pasta física

// Apaga do disco o avatar local anterior (ignora URLs externas). Silencioso.
$removerArquivo = static function (?string $stored) use ($publicDir): void {
    if ($stored && str_starts_with($stored, 'public/')) {
        $caminho = $publicDir.'/'.substr($stored, strlen('public/'));
        if (is_file($caminho)) {
            @unlink($caminho);
        }
    }
};

$avatarAtual = static function () use ($pdo, $userId): ?string {
    $stmt = $pdo->prepare('SELECT avatar FROM users WHERE id = ?');
    $stmt->execute([$userId]);

    return $stmt->fetchColumn() ?: null;
};

// ─── DELETE: remove o avatar atual ──────────────────────────────────────────
if ($method === 'DELETE') {
    $removerArquivo($avatarAtual());
    $pdo->prepare('UPDATE users SET avatar = NULL WHERE id = ?')->execute([$userId]);
    json_out(['success' => true, 'avatar' => null]);
    exit;
}

if ($method !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

// ─── POST: valida e grava o novo arquivo ────────────────────────────────────
$file = $_FILES['avatar'] ?? null;
if (! $file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    json_out(['errors' => ['Nenhum arquivo enviado ou upload falhou.']], 422);
    exit;
}

if ($file['size'] > 2 * 1024 * 1024) {
    json_out(['errors' => ['A imagem excede o limite de 2 MB.']], 422);
    exit;
}

// Confia no conteúdo (finfo), não na extensão nem no Content-Type do cliente.
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$extPorMime = ['image/png' => 'png', 'image/jpeg' => 'jpg'];
if (! isset($extPorMime[$mime])) {
    json_out(['errors' => ['Formato inválido. Use PNG ou JPEG.']], 422);
    exit;
}

if (! is_dir($uploadDir) && ! mkdir($uploadDir, 0775, true) && ! is_dir($uploadDir)) {
    json_out(['error' => 'Não foi possível criar a pasta de uploads.'], 500);
    exit;
}

$nome = 'u'.$userId.'_'.bin2hex(random_bytes(8)).'.'.$extPorMime[$mime];
if (! move_uploaded_file($file['tmp_name'], $uploadDir.'/'.$nome)) {
    json_out(['error' => 'Falha ao salvar o arquivo.'], 500);
    exit;
}

$removerArquivo($avatarAtual()); // limpa o anterior só depois de gravar o novo

$rel = $uploadRel.'/'.$nome;
$pdo->prepare('UPDATE users SET avatar = ? WHERE id = ?')->execute([$rel, $userId]);

json_out(['success' => true, 'avatar' => avatar_url($rel)]);
