<?php

/**
 * url.php — monta URLs absolutas do backend.
 *
 * O front (localhost:3000) e a API (localhost:8000) são origens diferentes, então
 * o avatar precisa sair daqui como URL absoluta para a tag <img> do Next.js
 * carregar. Prioriza APP_URL do .env; sem ela, deriva do próprio request.
 */

require_once __DIR__.'/../env.php';

function app_url(): string
{
    $configured = env('APP_URL');
    if ($configured !== '') {
        return rtrim($configured, '/');
    }

    $https = ($_SERVER['HTTPS'] ?? '') === 'on'
        || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';

    return ($https ? 'https' : 'http').'://'.($_SERVER['HTTP_HOST'] ?? 'localhost:8000');
}

/** Caminho relativo salvo no banco → URL absoluta (ou null se não houver avatar). */
function avatar_url(?string $stored): ?string
{
    if (! $stored) {
        return null;
    }
    if (str_starts_with($stored, 'http://') || str_starts_with($stored, 'https://')) {
        return $stored;
    }

    return app_url().'/'.ltrim($stored, '/');
}
