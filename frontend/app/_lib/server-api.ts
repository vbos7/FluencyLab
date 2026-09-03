import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Só roda no servidor. Prioriza API_BASE_URL (pode apontar pro backend local, sem
// passar por CDN); se faltar, cai no NEXT_PUBLIC_API_URL (também legível aqui), pra
// bastar setar UMA variável. Último recurso: o backend de dev.
const API_BASE_URL =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Usuário autenticado, no formato devolvido por /auth/me.php
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

    // 401 = sessão ausente/expirada. O middleware só checa a PRESENÇA do cookie
    // PHPSESSID, então um cookie velho passa por ele e só aqui descobrimos que a
    // sessão do backend não vale mais. Como todas as chamadas de fetchFromApi
    // vêm de páginas protegidas (Server Components), o certo é mandar pro login
    // em vez de estourar a página com um erro.
    if (res.status === 401) {
        redirect("/login")
    }

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
        const res = await fetch(`${API_BASE_URL}/auth/me.php`, {
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
