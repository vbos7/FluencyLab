<?php

/**
 * Roteador do `php -S` (dev-backend.sh/.cmd). Fica FORA de backend/ de propósito,
 * para não ser servido como arquivo.
 *
 * A raiz web é backend/, então sem isto qualquer arquivo de lá sairia na web:
 * sql/ (com as senhas do seed), tests/ (executável), vendor/, composer.lock...
 * Mesma lista de permissão do backend/.htaccess (Docker/Apache) e das regras de
 * nginx de produção (docs/auditoria-2026-10.md, S3):
 *   /                      health check (index.php)
 *   /api/**.php            endpoints — menos api/lib/ e api/config/ (só includes)
 *   /public/uploads/...    avatares (imagens)
 * Todo o resto responde 404.
 */
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');

$permitido = !str_contains($path, '..') && (
    $path === '/'
    || $path === '/index.php'
    || (preg_match('#^/api/.+\.php$#', $path) && !preg_match('#^/api/(lib|config)/#', $path))
    || preg_match('#^/public/uploads/avatars/[^/]+\.(png|jpe?g|webp)$#i', $path)
);

if ($permitido) {
    return false; // o php -S serve o arquivo normalmente
}

http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Não encontrado'], JSON_UNESCAPED_UNICODE);

return true;
