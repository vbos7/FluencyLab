import { type LucideIcon } from "lucide-react"

type Stat = {
    icon: LucideIcon
    iconColor: string
    iconBg: string
    value: string
    label: string
}

type Props = { stats: Stat[] }

export function StatsGrid({ stats }: Props) {
    return (
        <section aria-labelledby="stats-title">
            <h2 id="stats-title" className="sr-only">
                Estatísticas
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="hover-lift rounded-2xl border border-[#dce8ff] bg-white p-3.5 text-center shadow-[0_2px_16px_rgba(37,99,235,0.08)] hover:bg-[#f8faff] sm:p-5"
                    >
                        <div
                            className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${s.iconBg} sm:h-10 sm:w-10`}
                        >
                            <s.icon className={`size-5 ${s.iconColor}`} aria-hidden="true" />
                        </div>
                        <div className="text-xl font-black text-[#1e293b] sm:text-2xl">{s.value}</div>
                        <div className="mt-1 text-[10px] font-semibold tracking-wide text-slate-500 uppercase sm:text-xs">
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
