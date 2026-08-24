<?php

// Health check — acesse http://localhost:8000 para confirmar que o backend está no ar
header('Content-Type: application/json');
echo json_encode([
    'status' => 'ok',
    'message' => 'FluencyLab API — PHP '.PHP_VERSION,
    'docs' => 'Veja docs/tarefas/index.html para o guia de desenvolvimento',
]);
