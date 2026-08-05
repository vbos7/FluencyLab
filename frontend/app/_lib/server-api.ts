import { cookies } from "next/headers"

export async function fetchFromApi<T = unknown>(path: string): Promise<T> {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString() // ex: "PHPSESSID=abc123"

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
        headers: {
            Accept: "application/json",
            Cookie: cookieHeader, // repassa o cookie do usuário pro PHP
        },
        cache: "no-store",
    })

    if (!res.ok) throw new Error(`Erro ao buscar ${path}: ${res.status}`)
    return res.json()
}

export type AuthUser = {
    id: number
    name: string
    email: string
    role: "student" | "admin"
}

/**
 * Retorna o usuário logado (lendo a sessão PHP via /auth/me.php) ou null.
 * Diferente do fetchFromApi, NÃO lança erro no 401 — devolve null,
 * porque "não está logado" é uma resposta esperada, não uma falha.
 *
 * Use em Server Components para proteger rotas:
 *   const user = await getCurrentUser()
 *   if (user) redirect("/home")     // nas páginas de login/registro
 *   if (!user) redirect("/login")   // nas páginas internas
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies()

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me.php`, {
            headers: {
                Accept: "application/json",
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        })

        if (!res.ok) return null // 401 = não logado
        return res.json()
    } catch {
        // Backend fora do ar / inacessível: trata como "não logado" em vez de quebrar a página
        return null
    }
}
