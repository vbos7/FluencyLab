@echo off
REM Sobe o backend PHP no Windows (PowerShell ou cmd), servindo a pasta backend\
REM
REM Uso:  scripts\dev-backend.cmd          (ou: scripts\dev-backend.cmd 8001)
REM
REM No outro terminal, o frontend:  cd frontend  e  npm run dev

setlocal enabledelayedexpansion

REM %~dp0 = pasta deste .cmd; sobe um nivel para a raiz do projeto
cd /d "%~dp0.."

set "PORTA=%~1"
if "%PORTA%"=="" set "PORTA=8000"

if not exist ".env" (
    echo Erro: .env nao encontrado na raiz.
    echo Rode:  copy .env.example .env    e preencha as credenciais do banco.
    exit /b 1
)

REM Procura o PHP na mesma ordem do dev-backend.sh:
REM   1. PHP_BIN do .env   2. php no PATH   3. caminhos padrao do XAMPP
set "PHP_BIN="
for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
    if /i "%%a"=="PHP_BIN" set "PHP_BIN=%%b"
)

if not defined PHP_BIN (
    where php >nul 2>nul && set "PHP_BIN=php"
)

if not defined PHP_BIN (
    if exist "C:\xampp\php\php.exe" set "PHP_BIN=C:\xampp\php\php.exe"
)

if not defined PHP_BIN (
    echo Erro: nao encontrei o PHP.
    echo Defina o caminho no .env, por exemplo:
    echo   PHP_BIN=C:\xampp\php\php.exe
    exit /b 1
)

REM O servidor embutido do PHP atende UMA requisicao por vez por padrao. Durante
REM o SSR o Next dispara varias chamadas a API na mesma pagina, e elas ficariam
REM em fila. Com workers elas rodam em paralelo.
set PHP_CLI_SERVER_WORKERS=4

echo PHP: %PHP_BIN%
echo Backend em http://localhost:%PORTA%  (Ctrl+C para parar)

"%PHP_BIN%" -S localhost:%PORTA% -t backend
