export type LeaderboardUser = {
    id: number
    name: string
    xp: number
    level: number
    github?: string
    isCurrentUser?: boolean
}

// XP necessário por nível. Fórmula única, igual à do backend
// (ranking.php, admin/users.php, admin/top-users.php): cada nível exige 150 XP,
// então nível = floor(xp / 150) + 1.
export const XP_PER_LEVEL = 150

// Deriva nível e progresso a partir do XP total, batendo com o backend.
export function getLevel(totalXp: number) {
    const level = Math.floor(totalXp / XP_PER_LEVEL) + 1
    const currentXp = totalXp % XP_PER_LEVEL // progresso dentro do nível atual
    return { level, currentXp, needed: XP_PER_LEVEL }
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
