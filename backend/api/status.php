<?php

require_once __DIR__.'/cors.php';
require_once __DIR__.'/db.php';
require_once __DIR__.'/lib/settings.php';

/** @var PDO $pdo Conexão criada em db.php (incluído acima). */

// Status público da plataforma (sem autenticação). O front usa pra decidir se
// mostra a tela de manutenção. Só expõe flags inofensivas.
json_out([
    'maintenance' => get_setting($pdo, 'maintenance_mode', '0') === '1',
    'app_name' => get_setting($pdo, 'app_name', 'FluencyLab'),
]);
