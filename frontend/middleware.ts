import { NextRequest, NextResponse } from "next/server"

const ROTAS_PUBLICAS = ["/login", "/register", "/", "/cursos", "/planos"]

export function middleware(request: NextRequest) {
    const sessao = request.cookies.get("PHPSESSID")?.value
    const { pathname } = request.nextUrl

    const ehPublica = ROTAS_PUBLICAS.some(
        (r) => pathname === r || pathname.startsWith(r + "/")
    )

    if (!sessao && !ehPublica) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
