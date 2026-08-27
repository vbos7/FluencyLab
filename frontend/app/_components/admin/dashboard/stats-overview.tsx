import { Users, MessageSquare, Zap, TrendingUp } from "lucide-react"
import type { DashboardStats } from "@/app/_lib/admin"
import { cn } from "@/app/_lib/utils"

// Configuração de cada card de estatística
type StatCard = {
    icon: React.ElementType
    color: string
    value: string
    label: string
    sub?: string
    subPositive?: boolean
}

function buildCards(stats: DashboardStats): StatCard[] {
    return [
        {
            icon: Users,
            color: "bg-blue-50 text-blue-600",
            value: stats.totalUsers.toLocaleString("pt-BR"),
            label: "Usuários cadastrados",
            sub: `+${stats.newThisMonth} este mês`,
            subPositive: stats.newThisMonth > 0,
        },
        {
            icon: MessageSquare,
            color: "bg-violet-50 text-violet-600",
            value: stats.totalPhrases.toLocaleString("pt-BR"),
            label: "Frases cadastradas",
        },
        {
            icon: TrendingUp,
            color: "bg-emerald-50 text-emerald-600",
            value: stats.activeToday.toLocaleString("pt-BR"),
            label: "Usuários ativos hoje",
        },
        {
            icon: Zap,
            color: "bg-amber-50 text-amber-500",
            value: stats.totalXP.toLocaleString("pt-BR"),
            label: "XP distribuído",
            sub: `${stats.avgCompletionRate}% taxa de acerto`,
        },
    ]
}

export function StatsOverview({ stats }: { stats: DashboardStats }) {
    const cards = buildCards(stats)
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon
                return (
                    <div
                        key={card.label}
                        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                    >
                        <div
                            className={cn(
                                "mb-3 flex size-9 items-center justify-center rounded-xl",
                                card.color
                            )}
                        >
                            <Icon size={18} />
                        </div>
                        <p className="font-mono text-2xl leading-none font-bold text-slate-800">
                            {card.value}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">{card.label}</p>
                        {card.sub && (
                            <p
                                className={cn(
                                    "mt-1.5 text-[11px] font-medium",
                                    card.subPositive ? "text-emerald-600" : "text-slate-400"
                                )}
                            >
                                {card.sub}
                            </p>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
