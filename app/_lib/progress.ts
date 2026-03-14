// ─── Tipos ───────────────────────────────────────────────────────────────────

// Uma célula do calendário heatmap
export type CalendarCell = {
    date: string  // formato "YYYY-MM-DD"
    level: number // -1 = fora do intervalo, 0 = sem atividade, 1–3 = intensidade
}

// Retorno de generateWeeks: a matriz de colunas + o índice da semana atual
export type WeeksResult = {
    weeks: CalendarCell[][]
    currentWeekIdx: number
}

// ─── Dados fake ───────────────────────────────────────────────────────────────

// Gera atividade aleatória para todos os dias do ano (Jan 1 – Dez 31).
// Nível 1 (leve) → 2 (moderado) → 3 (intenso), com 25% de chance de nenhuma atividade.
// Cobre o ano inteiro para que o demo funcione mesmo em datas "futuras".
function generateCalendarData(): Record<string, number> {
    const data: Record<string, number> = {}
    const year      = 2026
    const startDate = new Date(year, 0, 1)   // 1º de janeiro
    const endDate   = new Date(year, 11, 31) // 31 de dezembro

    const current = new Date(startDate)
    while (current <= endDate) {
        const key  = current.toISOString().split("T")[0]
        const rand = Math.random()
        if (rand > 0.25) {
            data[key] = rand > 0.7 ? 3 : rand > 0.45 ? 2 : 1
        }
        current.setDate(current.getDate() + 1)
    }
    return data
}

// Mapa de datas para nível de atividade (gerado uma vez no módulo)
export const CALENDAR_DATA = generateCalendarData()

// Estatísticas fake para os cards — substituir pela query ao banco quando disponível
export const FAKE_STATS = {
    totalPracticed: 135,
    totalCorrect:   86,
    userXp:         1250,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Nomes dos meses em PT-BR
export const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

// Gera a matriz de colunas (semanas) do heatmap para o ano inteiro (Jan 1 – Dez 31).
// Cada coluna é um array de 7 células (seg → dom).
// Datas passadas com atividade: level 1–3. Passadas sem atividade: level 0.
// Datas fora do ano ou no futuro: level = -1 (célula transparente).
// Retorna também o índice da coluna que contém o dia de hoje (currentWeekIdx).
export function generateWeeks(): WeeksResult {
    const today     = new Date(2026, 2, 13) // trocar por new Date() em produção
    const startDate = new Date(today.getFullYear(), 0, 1)  // 1º de janeiro
    const endDate   = new Date(today.getFullYear(), 11, 31) // 31 de dezembro

    const weeks: CalendarCell[][] = []
    let currentWeekIdx = 0

    // Retrocede até a segunda-feira anterior (ou igual) a startDate
    const current = new Date(startDate)
    while (current.getDay() !== 1) current.setDate(current.getDate() - 1)

    while (current <= endDate) {
        const week: CalendarCell[] = []
        let containsToday = false

        for (let d = 0; d < 7; d++) {
            const date = new Date(current)
            date.setDate(date.getDate() + d)
            const key = date.toISOString().split("T")[0]

            // Células fora do ano ficam invisíveis; demais usam os dados fake normalmente
            const outOfYear = date < startDate || date > endDate

            week.push({
                date: key,
                level: outOfYear ? -1 : (CALENDAR_DATA[key] ?? 0),
            })

            if (date.toDateString() === today.toDateString()) containsToday = true
        }

        if (containsToday) currentWeekIdx = weeks.length
        weeks.push(week)
        current.setDate(current.getDate() + 7)
    }

    return { weeks, currentWeekIdx }
}

// Retorna o label do mês (ex: "Mar") se a semana contém o dia 1 do mês,
// ou null caso contrário. Inclui datas futuras para que meses futuros apareçam no desktop.
export function monthLabelForWeek(week: CalendarCell[]): string | null {
    const firstDay = week.find(cell => new Date(cell.date).getDate() === 1)
    return firstDay ? MONTH_NAMES[new Date(firstDay.date).getMonth()] : null
}
