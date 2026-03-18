import { CheckCircle, Sparkles, Clock, Zap } from "lucide-react"
import { type ComputedStats } from "@/app/_lib/progress"
import { cn } from "@/app/_lib/utils"

type Props = {
    // Estatísticas já computadas por computeStats()
    stats: ComputedStats
}

// Configuração de cada card — ícone, cor, valor derivado e rótulo
type CardConfig = {
    icon:  React.ElementType
    color: string       // classes de cor do ícone e fundo
    value: string       // valor formatado para exibição
    label: string
    span?: "half" | "full" // half = metade da grid, full = largura total
}

function buildCards(stats: ComputedStats): CardConfig[] {
    return [
        {
            icon:  CheckCircle,
            color: "bg-blue-50 text-blue-600",
            value: stats.totalPracticed.toString(),
            label: "Treinos feitos",
            span:  "half",
        },
        {
            icon:  Sparkles,
            color: "bg-violet-50 text-violet-600",
            value: `${stats.completionRate}%`,
            label: "Taxa de acerto",
            span:  "half",
        },
        {
            icon:  Clock,
            color: "bg-emerald-50 text-emerald-600",
            value: `${stats.totalHours}h ${stats.totalMinutes}m`,
            label: "Tempo total de estudo",
            span:  "full",
        },
        {
            icon:  Zap,
            color: "bg-amber-50 text-amber-500",
            value: stats.userXp.toLocaleString(),
            label: "XP acumulado",
            span:  "full",
        },
    ]
}

export function StatsCards({ stats }: Props) {
    // Constrói a lista de cards com os valores já formatados
    const cards = buildCards(stats)

    return (
        <div className="grid grid-cols-2 gap-3">
            {cards.map((card) => {
                const Icon = card.icon

                return (
                    <div
                        key={card.label}
                        className={cn(
                            "bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col items-center text-center",
                            // Cards "full" ocupam as duas colunas da grid
                            card.span === "full" && "col-span-2 flex-row gap-4 text-left items-center"
                        )}
                    >
                        {/* Ícone com fundo colorido */}
                        <div className={cn(
                            "size-9 rounded-xl flex items-center justify-center shrink-0",
                            card.span === "half" ? "mb-3" : "",
                            card.color
                        )}>
                            <Icon size={18} />
                        </div>

                        <div>
                            {/* Valor em fonte mono destacada */}
                            <p className="text-[26px] font-bold font-mono text-slate-800 leading-none">
                                {card.value}
                            </p>
                            {/* Rótulo descritivo */}
                            <p className="text-xs text-slate-400 mt-1">
                                {card.label}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
