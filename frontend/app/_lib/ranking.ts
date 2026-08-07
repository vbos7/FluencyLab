export type LeaderboardUser = {
    id: number
    name: string
    xp: number
    level: number
    github: string
    isCurrentUser?: boolean
}

// Dados fake do leaderboard — substituir pela query ao banco quando disponível
export const USERS_LEADERBOARD: LeaderboardUser[] = [
    { id: 1, name: "Lucas M.", xp: 9820, level: 12, github: "leerob" },
    { id: 2, name: "Carlos J.", xp: 9350, level: 11, github: "rauchg" },
    { id: 3, name: "Pedro H.", xp: 8980, level: 10, github: "timneutkens" },
    { id: 4, name: "Mariana S.", xp: 8540, level: 9, github: "shuding" },
    { id: 5, name: "Rafael O.", xp: 8100, level: 8, github: "maxleiter" },
    { id: 6, name: "Juliana F.", xp: 7670, level: 7, github: "evilrabbit" },
    { id: 7, name: "Gustavo L.", xp: 7200, level: 6, github: "pontusab" },
    { id: 8, name: "Camila R.", xp: 6850, level: 5, github: "shadcn" },
    { id: 9, name: "Thiago B.", xp: 6400, level: 4, github: "delba-oliveira" },
    { id: 10, name: "Fernanda K.", xp: 6100, level: 4, github: "nicholasgasior" },
    { id: 11, name: "Bruno A.", xp: 5800, level: 3, github: "wesbos" },
    { id: 12, name: "Letícia P.", xp: 5500, level: 3, github: "kentcdodds" },
    { id: 13, name: "Diego M.", xp: 5200, level: 3, github: "t3dotgg" },
    { id: 14, name: "Isabela T.", xp: 4900, level: 3, github: "gregberge" },
    { id: 15, name: "Vitor C.", xp: 4600, level: 2, github: "emilkowalski_" },
    { id: 16, name: "Natalia S.", xp: 4300, level: 2, github: "jaredpalmer" },
    { id: 17, name: "Felipe R.", xp: 4000, level: 2, github: "pacocoursey" },
    { id: 18, name: "Amanda G.", xp: 3700, level: 2, github: "anthonyshort" },
    { id: 19, name: "Eduardo N.", xp: 3400, level: 2, github: "pveyes" },
    { id: 20, name: "Patrícia L.", xp: 3100, level: 2, github: "arcanis" },
    { id: 21, name: "Carlos H.", xp: 2800, level: 1, github: "nicolo-ribaudo" },
    { id: 22, name: "Renata F.", xp: 2500, level: 1, github: "nickvdyck" },
    { id: 23, name: "André B.", xp: 2200, level: 1, github: "wooorm" },
    { id: 24, name: "Tatiane O.", xp: 1900, level: 1, github: "jonschlinkert" },
    { id: 25, name: "Sandro V.", xp: 1600, level: 1, github: "jamiebuilds" },
    { id: 26, name: "Priscila M.", xp: 1300, level: 1, github: "pastelsky" },
    { id: 27, name: "Você", xp: 980, level: 1, github: "", isCurrentUser: true },
    { id: 28, name: "Wellington S.", xp: 750, level: 1, github: "kitten" },
    { id: 29, name: "Cláudia R.", xp: 500, level: 1, github: "nicolo-ribaudo" },
    { id: 30, name: "Rodrigo T.", xp: 250, level: 1, github: "styfle" },
]

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
