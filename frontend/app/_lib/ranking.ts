export type LeaderboardUser = {
    id: number
    name: string
    xp: number
    level: number
    avatar?: string | null 
    github?: string
    isCurrentUser?: boolean
}

// XP necessário para completar um nível específico (nível N exige N×150)
export function xpForLevel(lvl: number): number {
    return lvl * 150
}

// Deriva nível atual + XP dentro do nível a partir do XP total acumulado.
// Mesma lógica usada no backend (ranking.php) para manter os números consistentes
// entre Home, Perfil e Ranking.
export function getLevel(xp: number) {
    let lvl = 1,
        rem = xp
    while (rem >= xpForLevel(lvl)) {
        rem -= xpForLevel(lvl)
        lvl++
    }
    return { level: lvl, currentXp: rem, needed: xpForLevel(lvl) }
}

// Rótulo de patamar por nível (usado no perfil e no ranking)
export function levelLabel(level: number): string {
    if (level >= 10) return "Mestre"
    if (level >= 7) return "Avançado"
    if (level >= 4) return "Expert"
    if (level >= 2) return "Intermediário"
    return "Iniciante"
}

export function initials(name: string) {
    const parts = name.trim().split(" ")
    return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase()
}