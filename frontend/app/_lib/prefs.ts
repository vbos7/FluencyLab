// Preferências da prática guardadas em cookie (não em localStorage) para o
// servidor também enxergar: a página já renderiza com a dificuldade/categoria
// certas e o HTML do servidor bate com o do navegador (sem erro de hidratação).
export const PREF_DIFFICULTY = "fl_difficulty"
export const PREF_CATEGORY = "fl_category"
export const PREF_GUEST_USED = "fl_guest_used"

const UM_ANO = 60 * 60 * 24 * 365

export function setPref(nome: string, valor: string): void {
    document.cookie = `${nome}=${encodeURIComponent(valor)}; path=/; max-age=${UM_ANO}; SameSite=Lax`
}

export function clearPref(nome: string): void {
    document.cookie = `${nome}=; path=/; max-age=0; SameSite=Lax`
}

// Índice aleatório em [0, n). Fora dos componentes de propósito: sortear é efeito
// colateral, então só roda no servidor (uma vez) ou em handlers de clique.
export function sortearIndice(n: number, evitar = -1): number {
    if (n <= 1) return 0
    let i
    do {
        i = Math.floor(Math.random() * n)
    } while (i === evitar)
    return i
}
