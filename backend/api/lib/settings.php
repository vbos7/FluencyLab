<?php

/**
 * settings.php (lib) — leitura das configurações do painel (tabela `settings`).
 *
 * As configs são salvas em admin/settings.php e lidas aqui pelos endpoints que
 * dependem delas (XP, cadastro, ranking, manutenção...). Cache estático por
 * request: várias leituras = uma query só.
 */
function get_setting(PDO $pdo, string $chave, string $padrao = ''): string
{
    static $cache = null;

    if ($cache === null) {
        $cache = [];
        foreach ($pdo->query('SELECT setting_key, setting_value FROM settings')->fetchAll() as $row) {
            $cache[$row['setting_key']] = $row['setting_value'];
        }
    }

    return $cache[$chave] ?? $padrao;
}
