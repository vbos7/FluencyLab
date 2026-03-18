import { generateWeeks, FAKE_STATS, computeStats } from "@/app/_lib/progress"
import { ConsistencyHeatmap } from "@/app/_components/progress/consistency-heatmap"
import { StatsCards } from "@/app/_components/progress/stats-cards"

export default function ProgressPage() {
    // Gera as semanas do ano atual e o índice da semana corrente
    const { weeks, currentWeekIdx } = generateWeeks()

    // Deriva os valores dos cards a partir dos dados brutos
    const stats = computeStats(FAKE_STATS)

    return (
        <main className="mx-auto px-4 pt-8 pb-24 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Consistência</h1>
                <p className="text-sm text-slate-400 mt-1">Seu histórico de atividade</p>
            </div>

            <ConsistencyHeatmap weeks={weeks} currentWeekIdx={currentWeekIdx} />

            <StatsCards stats={stats} />
        </main>
    )
}
