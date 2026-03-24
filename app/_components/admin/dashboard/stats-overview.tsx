import { Users, MessageSquare, Zap, TrendingUp } from 'lucide-react'
import { DASHBOARD_STATS } from '@/app/_lib/admin'
import { cn } from '@/app/_lib/utils'

// Configuração de cada card de estatística
type StatCard = {
    icon: React.ElementType
    color: string
    value: string
    label: string
    sub?: string
    subPositive?: boolean
}

function buildCards(): StatCard[] {
    return [
        {
            icon: Users,
            color: 'bg-blue-50 text-blue-600',
            value: DASHBOARD_STATS.totalUsers.toLocaleString('pt-BR'),
            label: 'Usuários cadastrados',
            sub: `+${DASHBOARD_STATS.newThisMonth} este mês`,
            subPositive: true,
        },
        {
            icon: MessageSquare,
            color: 'bg-violet-50 text-violet-600',
            value: DASHBOARD_STATS.totalPhrases.toLocaleString('pt-BR'),
            label: 'Frases cadastradas',
            sub: 'Atualizado hoje',
        },
        {
            icon: TrendingUp,
            color: 'bg-emerald-50 text-emerald-600',
            value: DASHBOARD_STATS.activeToday.toLocaleString('pt-BR'),
            label: 'Usuários ativos hoje',
            sub: 'vs 76 ontem',
            subPositive: true,
        },
        {
            icon: Zap,
            color: 'bg-amber-50 text-amber-500',
            value: DASHBOARD_STATS.totalXP.toLocaleString('pt-BR'),
            label: 'XP distribuído',
            sub: `${DASHBOARD_STATS.avgCompletionRate}% taxa de acerto`,
        },
    ]
}

export function StatsOverview() {
    const cards = buildCards()
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon
                return (
                    <div
                        key={card.label}
                        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                    >
                        <div className={cn('mb-3 size-9 rounded-xl flex items-center justify-center', card.color)}>
                            <Icon size={18} />
                        </div>
                        <p className="text-2xl font-bold font-mono text-slate-800 leading-none">
                            {card.value}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">{card.label}</p>
                        {card.sub && (
                            <p className={cn(
                                'mt-1.5 text-[11px] font-medium',
                                card.subPositive ? 'text-emerald-600' : 'text-slate-400'
                            )}>
                                {card.sub}
                            </p>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
