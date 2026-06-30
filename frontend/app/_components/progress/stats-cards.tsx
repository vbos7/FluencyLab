import { CheckCircle, Sparkles, Clock, Zap } from "lucide-react"
import { type ComputedStats } from "@/app/_lib/progress"
import { cn } from "@/app/_lib/utils"

type Props = {
    // Estatísticas já computadas por computeStats()
    stats: ComputedStats
    limit?: number
}

// Configuração de cada card — ícone, cor, valor derivado e rótulo
type CardConfig = {
    icon: React.ElementType
    color: string // classes de cor do ícone e fundo
    value: string // valor formatado para exibição
    label: string
    span?: "half" | "full" // half = metade da grid, full = largura total
}

function buildCards(stats: ComputedStats): CardConfig[] {
    return [
        {
            icon: CheckCircle,
            color: "bg-blue-50 text-blue-600",
            value: stats.totalPracticed.toString(),
            label: "Treinos feitos",
            span: "half",
        },
        {
            icon: Sparkles,
            color: "bg-violet-50 text-violet-600",
            value: `${stats.completionRate}%`,
            label: "Taxa de acerto",
            span: "half",
        },
        {
            icon: Clock,
            color: "bg-emerald-50 text-emerald-600",
            value: `${stats.totalHours}h ${stats.totalMinutes}m`,
            label: "Tempo total de estudo",
            span: "full",
        },
        {
            icon: Zap,
            color: "bg-amber-50 text-amber-500",
            value: stats.userXp.toLocaleString(),
            label: "XP acumulado",
            span: "full",
        },
    ]
}

export function StatsCards({ stats, limit }: Props) {
    // Constrói a lista de cards com os valores já formatados

    const cards = limit ? buildCards(stats).slice(0, limit) : buildCards(stats)

    return (
        <div className="grid grid-cols-2 gap-3 ">
            {cards.map((card) => {
                const Icon = card.icon

                return (
                    <div
                        key={card.label}
                        className={cn(
                            "flex flex-col items-center rounded-2xl border border-[#dce8ff] bg-white p-4 shadow-[0_2px_16px_rgba(37,99,235,0.08)] sm:p-6  text-center",
                            // Cards "full" ocupam as duas colunas da grid
                            card.span === "full" &&
                                "col-span-2 flex-row items-center gap-4 text-left"
                        )}
                    >
                        {/* Ícone com fundo colorido */}
                        <div
                            className={cn(
                                "flex size-9 shrink-0 items-center justify-center rounded-xl",
                                card.span === "half" ? "mb-3" : "",
                                card.color
                            )}
                        >
                            <Icon size={18} />
                        </div>

                        <div>
                            {/* Valor em fonte mono destacada */}
                            <p className="font-mono text-[26px] leading-none font-bold text-slate-800">
                                {card.value}
                            </p>
                            {/* Rótulo descritivo */}
                            <p className="mt-1 text-xs text-slate-600">{card.label}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
