import { generateWeeks } from "@/app/_lib/progress"
import { ConsistencyHeatmap } from "@/app/_components/progress/consistency-heatmap"

export default function ProgressPage() {
    // Gera as semanas do ano atual e o índice da semana corrente
    const { weeks, currentWeekIdx } = generateWeeks()

    return (
        <main className="mx-auto px-4 pt-8 pb-16 flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Consistência</h1>
                <p className="text-sm text-slate-400 mt-1">Seu histórico de atividade</p>
            </div>

            <ConsistencyHeatmap weeks={weeks} currentWeekIdx={currentWeekIdx} />
        </main>
    )
}
