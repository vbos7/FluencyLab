<?php

/**
 * url.php — monta URLs absolutas do backend.
 *
 * O front (localhost:3000) e a API (localhost:8000) são origens diferentes, então
 * o avatar precisa sair daqui como URL absoluta para a tag <img> do Next.js
 * carregar. Deriva sempre do host da própria requisição — NÃO usar APP_URL
 * aqui, pois aquela variável é a URL pública do FRONT, não do backend que
 * de fato serve o arquivo.
 */

require_once __DIR__ . '/../env.php';

// request_is_https() vem do cors.php, sempre incluído antes pelos endpoints.
function app_url(): string
{
    return (request_is_https() ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost:8000');
}

/** Caminho relativo salvo no banco → URL absoluta (ou null se não houver avatar). */
function avatar_url(?string $stored): ?string
{
    if (!$stored) {
        return null;
    }

    if (str_starts_with($stored, 'http://') || str_starts_with($stored, 'https://')) {
        return $stored;
    }

    return app_url() . '/' . ltrim($stored, '/');
}
