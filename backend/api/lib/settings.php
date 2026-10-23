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

    $cache ??= todas_as_settings($pdo);

    return $cache[$chave] ?? $padrao;
}

// Todas as configurações como mapa chave => valor (sem cache: o painel lê de
// novo logo depois de gravar).
function todas_as_settings(PDO $pdo): array
{
    $out = [];

    foreach ($pdo->query('SELECT setting_key, setting_value FROM settings')->fetchAll() as $row) {
        $out[$row['setting_key']] = $row['setting_value'];
    }

    return $out;
}
