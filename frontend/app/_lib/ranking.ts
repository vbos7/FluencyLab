export type LeaderboardUser = {
    id: number
    name: string
    xp: number
    level: number
    github?: string
    isCurrentUser?: boolean
}

export function xpForLevel(lvl: number): number {
    return lvl * 150
}

// Rótulo de patamar por nível (usado no perfil).
export function levelLabel(level: number): string {
    if (level >= 10) return "Expert"
    if (level >= 6) return "Avançado"
    if (level >= 3) return "Intermediário"
    return "Iniciante"
}

export function initials(name: string) {
    const parts = name.trim().split(" ")
    return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase()
}

// Rótulo textual pra cada faixa de nível
export function getLevelLabel(level: number): string {
    if (level >= 10) return "Mestre"
    if (level >= 7) return "Avançado"
    if (level >= 4) return "Expert"
    if (level >= 2) return "Intermediário"
    return "Iniciante"
}
