<?php

/**
 * POST /api/auth/passkey/login-options.php
 *
 * Passo 1 do login PRÓPRIO do painel (sem email/senha). Devolve os args para o
 * navigator.credentials.get() com lista de credenciais VAZIA → o navegador
 * oferece qualquer passkey descobrível (residente) do dispositivo. Guarda o
 * desafio na sessão. É público de propósito: é a porta de entrada do painel.
 */

require_once __DIR__.'/../../cors.php';
require_once __DIR__.'/../../lib/webauthn.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Método não permitido'], 405);
    exit;
}

$wa = webauthn_server();
$args = $wa->getGetArgs(
    [],     // vazio → credenciais descobríveis (resident keys)
    60,     // timeout (s)
    true, true, true, true, true, // usb, nfc, ble, hybrid, internal
    true    // requireUserVerification (biometria/PIN)
);

webauthn_store_challenge($wa);

json_out($args);
