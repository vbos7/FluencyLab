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
