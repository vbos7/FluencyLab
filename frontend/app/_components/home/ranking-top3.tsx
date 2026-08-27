import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import { fetchFromApi } from "@/app/_lib/server-api"
import { type LeaderboardUser, initials } from "@/app/_lib/ranking"
import { cn } from "@/app/_lib/utils"

// Configuração visual de cada posição do pódio (índice 0, 1, 2)
const MEDAL_CONFIG = [
    {
        medal: "🥇",
        posColor: "text-amber-400",
        ringClass: "ring-amber-200 group-hover:ring-amber-400",
        hoverBg: "hover:bg-amber-50/50",
        xpClass: "text-amber-500 bg-amber-50 border-amber-100",
        fallbackBg: "bg-amber-500 text-white",
    },
    {
        medal: "🥈",
        posColor: "text-slate-600",
        ringClass: "ring-slate-200 group-hover:ring-slate-400",
        hoverBg: "hover:bg-slate-50",
        xpClass: "text-slate-600 bg-slate-100 border-slate-200",
        fallbackBg: "bg-slate-500 text-white",
    },
    {
        medal: "🥉",
        posColor: "text-orange-600",
        ringClass: "ring-orange-200 group-hover:ring-orange-400",
        hoverBg: "hover:bg-orange-50/50",
        xpClass: "text-orange-600 bg-orange-50 border-orange-100",
        fallbackBg: "bg-orange-500 text-white",
    },
]

export async function RankingTop3() {
    const leaderboard = await fetchFromApi<LeaderboardUser[]>("/ranking.php")
    const top3 = leaderboard.slice(0, 3)

    if (top3.length === 0) {
        return null // sem participantes ainda, não mostra a seção
    }

    return (
        <section aria-labelledby="ranking-title" className="mt-7">
            <div className="mb-3.5 flex items-center justify-between">
                <h2 id="ranking-title" className="text-xl font-bold text-slate-900">Ranking Top 3</h2>
                <a
                    href="/ranking"
                    className="text-xs font-bold text-blue-500 transition-colors hover:text-blue-700"
                >
                    Ver todos →
                </a>
            </div>

            <ul className="flex flex-col divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm" role="list">
                {top3.map((user, i) => {
                    const config = MEDAL_CONFIG[i]
                    const pos = i + 1

                    return (
                        <li key={user.id}>
                            <a
                                href="/ranking"
                                aria-label={`${pos}º lugar: ${user.name}, Nível ${user.level}, ${user.xp.toLocaleString()} XP`}
                                className={cn(
                                    "group flex items-center gap-3 px-4 py-3.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400",
                                    config.hoverBg
                                )}
                            >
                                <span
                                    className={cn(
                                        "w-6 text-center text-sm font-bold transition-transform duration-200 group-hover:scale-125",
                                        config.posColor
                                    )}
                                >
                                    {pos}
                                </span>

                                <div className="relative">
                                    <Avatar className={cn("size-9 ring-2 transition-all duration-200 group-hover:scale-105", config.ringClass)}>
                                        {user.github ? (
                                            <AvatarImage src={`https://github.com/${user.github}.png`} alt={`@${user.github}`} />
                                        ) : null}
                                        <AvatarFallback className={cn("text-xs font-semibold", config.fallbackBg)}>
                                            {initials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute -right-0.5 -bottom-0.5 text-[10px] leading-none">
                                        {config.medal}
                                    </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-slate-800">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-slate-500">Nível {user.level}</p>
                                </div>

                                <span className={cn("rounded-full border px-2 py-0.5 font-mono text-xs font-bold", config.xpClass)}>
                                    {user.xp.toLocaleString()} XP
                                </span>
                            </a>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}