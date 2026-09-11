import { redirect } from "next/navigation"
import { fetchFromApi } from "@/app/_lib/server-api"
import {
    buildCalendarMapFromApi,
    computeStatsFromApi,
    generateWeeks,
    type CalendarData,
    type StatsData,
    type WeeklyPoint,
} from "@/app/_lib/progress"
import { ConsistencyHeatmap } from "@/app/_components/progress/consistency-heatmap"
import { WeeklyChart } from "@/app/_components/progress/weekly-chart"
import { StatsCards } from "@/app/_components/progress/stats-cards"
import { ProLockCard } from "@/app/_components/pro-lock-card"
import NavLayout from "@/app/_layouts/nav-layout"

export default async function ProgressPage() {
    let statsData: StatsData
    let weeklyData: WeeklyPoint[]
    let calendarData: CalendarData[]
    let planStatus: { active: boolean }

    try {
        ;[statsData, weeklyData, calendarData, planStatus] = await Promise.all([
            fetchFromApi<StatsData>("/user/stats.php"),
            fetchFromApi<WeeklyPoint[]>("/user/progress-weekly.php"),
            fetchFromApi<CalendarData[]>("/user/calendar.php"),
            fetchFromApi<{ active: boolean }>("/my-plan.php").catch(() => ({ active: false })),
        ])
    } catch {
        redirect("/login") // sem sessão válida, manda pro login
    }

    const stats = computeStatsFromApi(statsData)
    const calendarMap = buildCalendarMapFromApi(calendarData)
    const { weeks, currentWeekIdx } = generateWeeks(calendarMap)

    return (
        <NavLayout>
            <main className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="mx-auto max-w-3xl space-y-6">
                    <div className="mb-8 text-center">
                        <div className="mb-2 flex items-center justify-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-600"></span>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                Seu progresso
                            </h1>

                            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                        </div>

                        <p className="text-sm font-medium text-slate-500">
                            Acompanhe sua evolução ao longo do tempo.
                        </p>
                    </div>

                    <ConsistencyHeatmap weeks={weeks} currentWeekIdx={currentWeekIdx} />
                    <StatsCards stats={stats} />

                    {/* Relatório semanal detalhado — exclusivo Pro */}
                    {planStatus.active ? (
                        <WeeklyChart data={weeklyData} />
                    ) : (
                        <ProLockCard
                            title="Relatório semanal detalhado"
                            description="Assinantes Pro acompanham XP e treinos das últimas 12 semanas em um gráfico completo."
                        />
                    )}
                </div>
            </main>
        </NavLayout>
    )
}
