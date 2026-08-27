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

export function getLevel(xp: number) {
    let lvl = 1,
        rem = xp
    while (rem >= xpForLevel(lvl)) {
        rem -= xpForLevel(lvl)
        lvl++
    }
    return { level: lvl, currentXp: rem, needed: xpForLevel(lvl) }
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
