import { cookies } from "next/headers"


const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/api";

export type AuthUser = {
    id: number
    name: string
    email: string
    role: string
}

export async function fetchFromApi<T>(path: string): Promise<T> {
    const cookieStore = await cookies();

    const res = await fetch(`${API_BASE_URL}${path}`, {
       cache: "no-store",
        headers: {
            Cookie: cookieStore.toString(), // sempre busca dado fresco; troque depois se quiser cache
        },
    });

    if (!res.ok) {
        throw new Error(`Erro ao buscar ${path}: ${res.status}`);
    }

    return res.json();
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
