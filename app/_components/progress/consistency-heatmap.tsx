import { type CalendarCell, monthLabelForWeek } from "@/app/_lib/progress"
import { cn } from "@/app/_lib/utils"

type Props = {
    // Matriz de colunas gerada por generateWeeks()
    weeks: CalendarCell[][]
    // Índice da coluna que contém o dia de hoje
    currentWeekIdx: number
}

// Mapeia o nível de atividade para a classe de cor Tailwind
function cellClass(level: number): string {
    if (level === -1) return "opacity-0 pointer-events-none"
    if (level === 0) return "bg-slate-100"
    if (level === 1) return "bg-blue-200"
    if (level === 2) return "bg-blue-400"
    return "bg-blue-600"
}

// Labels dos dias da semana — apenas seg, qua, sex para não poluir
const DAY_LABELS = ["Seg", "", "Qua", "", "Sex", "", ""]

export function ConsistencyHeatmap({ weeks, currentWeekIdx }: Props) {
    return (
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex gap-2">
                {/* Labels dos dias à esquerda — fixas, fora do scroll */}
                <div className="flex shrink-0 flex-col gap-[3px] pt-5">
                    {DAY_LABELS.map((label, i) => (
                        <span
                            key={i}
                            className="text-[10px] font-medium text-slate-500"
                            style={{ height: 14, lineHeight: "14px" }}
                        >
                            {label}
                        </span>
                    ))}
                </div>

                {/* Grade de semanas com scroll horizontal e barra oculta */}
                <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-[3px]">
                        {weeks.map((week, wi) => {
                            const label = monthLabelForWeek(week)
                            const isCurrentWeek = wi === currentWeekIdx

                            return (
                                <div key={wi} className="flex shrink-0 flex-col gap-[3px]">
                                    {/* Label do mês — ocupa espaço fixo; visível só na semana do dia 1 */}
                                    <div className="mb-1 h-4">
                                        {label && (
                                            <span className="text-[11px] leading-none font-medium text-slate-600">
                                                {label}
                                            </span>
                                        )}
                                    </div>

                                    {/* 7 células (seg → dom) */}
                                    {week.map((cell, di) => (
                                        <div
                                            key={di}
                                            title={
                                                cell.level > 0
                                                    ? `${cell.date} · nível ${cell.level}`
                                                    : undefined
                                            }
                                            className={cn(
                                                "size-[14px] rounded-[3px]",
                                                cellClass(cell.level),
                                                // Sutil anel para marcar a semana atual
                                                isCurrentWeek &&
                                                    cell.level === 0 &&
                                                    "ring-1 ring-blue-300 ring-inset"
                                            )}
                                        />
                                    ))}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Legenda de intensidade */}
            <div className="mt-4 flex items-center justify-end gap-1.5">
                <span className="text-[11px] text-slate-600">Menos</span>
                {[0, 1, 2, 3].map((lvl) => (
                    <div key={lvl} className={cn("size-[11px] rounded-[2px]", cellClass(lvl))} />
                ))}
                <span className="text-[11px] text-slate-600">Mais</span>
            </div>
        </div>
    )
}
