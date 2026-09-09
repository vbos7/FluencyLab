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
import { Lock } from "lucide-react"
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
                        <div className="rounded-2xl border border-[#dce8ff] bg-white p-6 shadow-[0_2px_16px_rgba(37,99,235,0.08)]">
                            <div className="flex flex-col items-center gap-3 py-4 text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                                    <Lock size={20} className="text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Relatório semanal detalhado</p>
                                    <p className="mt-1 max-w-xs text-sm text-gray-500">
                                        Assinantes Pro acompanham XP e treinos das últimas 12 semanas em um gráfico completo.
                                    </p>
                                </div>
                                <a
                                    href="/planos"
                                    className="mt-1 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Assinar plano Pro
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </NavLayout>
    )
}