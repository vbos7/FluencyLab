import { NextRequest, NextResponse } from "next/server"

// /practice é público para permitir o modo convidado (praticar sem login). O
// abuso é contido no backend (check-answer.php: teto por sessão + por IP), não aqui.
// /admin/login também é público, senão cairia em loop de redirect.
const ROTAS_PUBLICAS = ["/login", "/register", "/", "/cursos", "/planos", "/practice", "/admin/login"]

export function middleware(request: NextRequest) {
    const sessao = request.cookies.get("PHPSESSID")?.value
    const { pathname } = request.nextUrl

    const ehPublica = ROTAS_PUBLICAS.some(
        (r) => pathname === r || pathname.startsWith(r + "/")
    )

    if (!sessao && !ehPublica) {
        // Rotas do painel têm login próprio; o resto vai pro login do aluno.
        const destino = pathname.startsWith("/admin") ? "/admin/login" : "/login"
        return NextResponse.redirect(new URL(destino, request.url))
    }

    return NextResponse.next()
}

export const config = {
    // Ignora assets internos do Next e QUALQUER arquivo estático do /public
    // (caminhos com extensão, ex.: /img/logo.png). Sem isso, o fetch interno
    // do otimizador de next/image cai no redirect de login e retorna "received null".
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
