import { generateWeeks, FAKE_STATS, computeStats, FAKE_WEEKLY_DATA } from "@/app/_lib/progress"
import { ConsistencyHeatmap } from "@/app/_components/progress/consistency-heatmap"
import { StatsCards } from "@/app/_components/progress/stats-cards"
import { WeeklyChart } from "@/app/_components/progress/weekly-chart"
import NavLayout from "@/app/_layouts/nav-layout"

export default function ProgressPage() {
    // Gera as semanas do ano atual e o índice da semana corrente
    const { weeks, currentWeekIdx } = generateWeeks()

    // Deriva os valores dos cards a partir dos dados brutos
    const stats = computeStats(FAKE_STATS)

    return (
        <NavLayout>
            <main className="page-enter mx-auto flex max-w-5xl flex-col gap-6 px-4 pt-8 pb-24">
                <div className="flex flex-col items-center gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Consistência
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">Seu histórico de atividade</p>
                </div>

                <ConsistencyHeatmap weeks={weeks} currentWeekIdx={currentWeekIdx} />

                <StatsCards stats={stats} />

                <WeeklyChart data={FAKE_WEEKLY_DATA} />
            </main>
        </NavLayout>
    )
}
