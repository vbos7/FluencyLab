<?php

/**
 * avatar.php — foto de perfil (aluno e admin usam a mesma regra).
 *
 * O arquivo vai para backend/public/uploads/avatars/ e o banco guarda o caminho
 * relativo (ex.: "public/uploads/avatars/u3_ab12.png"). A imagem é REPROCESSADA
 * com o GD: isso descarta metadados (EXIF, inclusive localização GPS de fotos de
 * celular) e reduz para no máximo 512 px de lado.
 */
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const AVATAR_LADO_MAX  = 512;
const AVATAR_REL       = 'public/uploads/avatars';
const AVATAR_TIPOS     = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

function avatar_dir(): string
{
    return __DIR__ . '/../../' . AVATAR_REL;
}

/**
 * Valida, reprocessa e grava o novo avatar; apaga o anterior.
 *
 * @return array{0: ?string, 1: ?string} [caminho relativo salvo, mensagem de erro]
 */
function avatar_salvar(PDO $pdo, int $userId, ?array $file): array
{
    if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return [null, 'Nenhum arquivo enviado ou o upload falhou.'];
    }

    if ($file['size'] > AVATAR_MAX_BYTES) {
        return [null, 'A imagem excede o limite de 2 MB.'];
    }

    // Tipo pelo CONTEÚDO (o tipo e o nome enviados pelo cliente são forjáveis).
    $info = @getimagesize($file['tmp_name']);
    $mime = $info['mime'] ?? '';

    if (!isset(AVATAR_TIPOS[$mime])) {
        return [null, 'Formato inválido. Use JPG, PNG ou WEBP.'];
    }

    if (!is_dir(avatar_dir()) && !mkdir(avatar_dir(), 0775, true) && !is_dir(avatar_dir())) {
        return [null, 'Não foi possível criar a pasta de uploads.'];
    }

    $nome    = 'u' . $userId . '_' . bin2hex(random_bytes(8)) . '.' . AVATAR_TIPOS[$mime];
    $destino = avatar_dir() . '/' . $nome;

    if (!avatar_reprocessar($file['tmp_name'], $mime, $destino)) {
        return [null, 'Não foi possível processar a imagem.'];
    }

    avatar_apagar_arquivo(avatar_atual($pdo, $userId)); // só depois de gravar o novo

    $rel = AVATAR_REL . '/' . $nome;
    $pdo->prepare('UPDATE users SET avatar = ? WHERE id = ?')->execute([$rel, $userId]);

    return [$rel, null];
}

// Remove o avatar (arquivo e referência no banco).
function avatar_remover(PDO $pdo, int $userId): void
{
    avatar_apagar_arquivo(avatar_atual($pdo, $userId));
    $pdo->prepare('UPDATE users SET avatar = NULL WHERE id = ?')->execute([$userId]);
}

function avatar_atual(PDO $pdo, int $userId): ?string
{
    $stmt = $pdo->prepare('SELECT avatar FROM users WHERE id = ?');
    $stmt->execute([$userId]);

    return $stmt->fetchColumn() ?: null;
}

// Apaga o arquivo local (ignora URLs externas e qualquer caminho fora da pasta).
function avatar_apagar_arquivo(?string $rel): void
{
    if ($rel && str_starts_with($rel, AVATAR_REL . '/')) {
        $caminho = avatar_dir() . '/' . basename($rel);

        if (is_file($caminho)) {
            @unlink($caminho);
        }
    }
}

// Decodifica e grava de novo (sem metadados), reduzindo se passar do lado máximo.
function avatar_reprocessar(string $origem, string $mime, string $destino): bool
{
    if (!function_exists('imagecreatefromstring')) {
        // Sem GD no servidor: grava o original (com metadados) para não quebrar o upload.
        error_log('[avatar] extensão GD ausente — imagem salva sem reprocessar');

        return move_uploaded_file($origem, $destino);
    }

    $img = @imagecreatefromstring((string) file_get_contents($origem));

    if ($img === false) {
        return false;
    }

    $largura = imagesx($img);
    $altura  = imagesy($img);
    $escala  = min(1, AVATAR_LADO_MAX / max($largura, $altura));

    if ($escala < 1) {
        $menor = imagescale($img, max(1, (int) round($largura * $escala)), max(1, (int) round($altura * $escala)));
        imagedestroy($img);
        $img = $menor;
    }

    imagesavealpha($img, true); // mantém transparência de PNG/WEBP

    $ok = match ($mime) {
        'image/png'  => imagepng($img, $destino, 6),
        'image/webp' => imagewebp($img, $destino, 85),
        default      => imagejpeg($img, $destino, 85),
    };
    imagedestroy($img);

    return $ok;
}
