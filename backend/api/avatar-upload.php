<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/lib/url.php';

if (empty($_SESSION['user_id'])) {
    json_out(['error' => 'Não autenticado'], 401);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

if (empty($_FILES['avatar'])) {
    json_out(['error' => 'Nenhum arquivo enviado'], 400);
    exit;
}

$arquivo = $_FILES['avatar'];
$tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
$tamanhoMaximo = 2 * 1024 * 1024;

if ($arquivo['error'] !== UPLOAD_ERR_OK) {
    json_out(['error' => 'Erro no upload do arquivo'], 400);
    exit;
}
if ($arquivo['size'] > $tamanhoMaximo) {
    json_out(['error' => 'Imagem muito grande. Máximo 2MB.'], 422);
    exit;
}

// MIME detectado pelo CONTEÚDO (não confia no tipo enviado pelo cliente, que é
// forjável). getimagesize também garante que é uma imagem de verdade.
$infoImagem = getimagesize($arquivo['tmp_name']);
if ($infoImagem === false) {
    json_out(['error' => 'Arquivo não é uma imagem válida'], 422);
    exit;
}
$mime = $infoImagem['mime'] ?? '';
if (!in_array($mime, $tiposPermitidos, true)) {
    json_out(['error' => 'Formato inválido. Use JPG, PNG ou WEBP.'], 422);
    exit;
}

$userId = $_SESSION['user_id'];

try {
    // Extensão real a partir do MIME detectado (não do nome/tipo enviado)
    $extensao = match ($mime) {
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    };

    $nomeArquivo = "user_{$userId}_" . time() . "." . $extensao;
    $pastaFisica = __DIR__ . '/uploads/avatars/';
    $caminhoCompleto = $pastaFisica . $nomeArquivo;
    $caminhoRelativo = 'api/uploads/avatars/' . $nomeArquivo;

    if (!is_dir($pastaFisica)) {
        mkdir($pastaFisica, 0755, true);
    }

    // Sem GD por enquanto: só move o arquivo original pro destino, sem redimensionar
    if (!move_uploaded_file($arquivo['tmp_name'], $caminhoCompleto)) {
        json_out(['error' => 'Falha ao salvar o arquivo no servidor'], 500);
        exit;
    }

    // Remove o avatar antigo do disco, se existir
    $stmt = $pdo->prepare("SELECT avatar FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $avatarAntigo = $stmt->fetchColumn();
    if ($avatarAntigo) {
        $caminhoAntigoFisico = $pastaFisica . basename($avatarAntigo);
        if (file_exists($caminhoAntigoFisico)) {
            unlink($caminhoAntigoFisico);
        }
    }

    $stmt = $pdo->prepare("UPDATE users SET avatar = ? WHERE id = ?");
    $stmt->execute([$caminhoRelativo, $userId]);

    json_out(['success' => true, 'avatar_url' => avatar_url($caminhoRelativo)]);

} catch (Exception $e) {
    error_log($e->getMessage());
    json_out(['error' => 'Erro ao processar imagem'], 500);
}