<?php

namespace App\Providers;

use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Projeto é uma API pura (sem telas de login em Blade), então uma
        // requisição não autenticada nunca deve ser redirecionada — sempre
        // responde com JSON 401, mesmo sem o cliente enviar Accept: application/json.
        Authenticate::redirectUsing(fn () => null);
    }
}
