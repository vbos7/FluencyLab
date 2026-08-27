// ─── Tipos ───────────────────────────────────────────────────────────────────

export type CalendarCell = {
    date: string
    level: number // -1 = fora do intervalo, 0 = sem atividade, 1–3 = intensidade
}

export type WeeksResult = {
    weeks: CalendarCell[][]
    currentWeekIdx: number
}

export type WeeklyPoint = {
    week: string
    xp: number
    treinos: number
}

export type StatsData = {
    totalPracticed: number
    totalCorrect: number
    userXp: number
    totalSeconds: number
}

export type CalendarData = {
    date: string
    level: number
}

// Formato que vem direto do dashboard.php
export type DashboardData = {
    total_treinos: number
    taxa_acerto: number
    tempo_total_segundos: number
    xp_total: number
    consistencia: { dia: string; atividades: number }[]
    weekly: WeeklyPoint[]
}

export type ComputedStats = {
    totalPracticed: number
    completionRate: number
    totalHours: number
    totalMinutes: number
    userXp: number
}

// ─── Cálculos a partir do dado real ────────────────────────────────────────────

// Deriva os valores dos cards a partir da resposta real da API (sem fórmula estimada)
export function computeStats(data: DashboardData): ComputedStats {
    const totalMinutosCheios = Math.floor(data.tempo_total_segundos / 60)

    return {
        totalPracticed: data.total_treinos,
        completionRate: data.taxa_acerto,
        totalHours: Math.floor(totalMinutosCheios / 60),
        totalMinutes: totalMinutosCheios % 60,
        userXp: data.xp_total,
    }
}

export function computeStatsFromApi(data: StatsData): ComputedStats {
    const totalMinutosCheios = Math.floor(data.totalSeconds / 60)

    return {
        totalPracticed: data.totalPracticed,
        completionRate:
            data.totalPracticed > 0
                ? Math.round((data.totalCorrect / data.totalPracticed) * 100)
                : 0,
        totalHours: Math.floor(totalMinutosCheios / 60),
        totalMinutes: totalMinutosCheios % 60,
        userXp: data.userXp,
    }
}

// Converte a contagem bruta de atividades/dia em nível de intensidade (0–3) para o heatmap
function activityLevel(atividades: number): number {
    if (atividades <= 0) return 0
    if (atividades <= 2) return 1
    if (atividades <= 5) return 2
    return 3
}

// Transforma a lista [{dia, atividades}] da API num mapa {data: nível}, pronto pro generateWeeks
export function buildCalendarMap(consistencia: DashboardData["consistencia"]): Record<string, number> {
    const map: Record<string, number> = {}
    for (const item of consistencia) {
        map[item.dia] = activityLevel(item.atividades)
    }
    return map
}

export function buildCalendarMapFromApi(calendar: CalendarData[]): Record<string, number> {
    return Object.fromEntries(calendar.map((item) => [item.date, item.level]))
}

// ─── Helpers do calendário ──────────────────────────────────────────────────────

export const MONTH_NAMES = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
]

// Gera a matriz de colunas (semanas) do ano, agora recebendo o mapa real de atividade
export function generateWeeks(
    calendarData: Record<string, number>,
    year: number = new Date().getFullYear()
): WeeksResult {
    const today = new Date()
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)

    const weeks: CalendarCell[][] = []
    let currentWeekIdx = 0

    const current = new Date(startDate)
    while (current.getDay() !== 1) current.setDate(current.getDate() - 1)

    while (current <= endDate) {
        const week: CalendarCell[] = []
        let containsToday = false

        for (let d = 0; d < 7; d++) {
            const date = new Date(current)
            date.setDate(date.getDate() + d)
            const key = date.toISOString().split("T")[0]
            const outOfYear = date < startDate || date > endDate

            week.push({
                date: key,
                level: outOfYear ? -1 : (calendarData[key] ?? 0),
            })

            if (date.toDateString() === today.toDateString()) containsToday = true
        }

        if (containsToday) currentWeekIdx = weeks.length
        weeks.push(week)
        current.setDate(current.getDate() + 7)
    }

    return { weeks, currentWeekIdx }
}

export function monthLabelForWeek(week: CalendarCell[]): string | null {
    const firstDay = week.find((cell) => new Date(cell.date).getDate() === 1)
    return firstDay ? MONTH_NAMES[new Date(firstDay.date).getMonth()] : null
}
