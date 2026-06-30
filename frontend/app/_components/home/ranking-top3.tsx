const TOP3 = [
    {
        pos: 1,
        name: "Lucas M.",
        level: 5,
        xp: "9.820 XP",
        avatar: "https://github.com/leerob.png",
        medal: "🥇",
        posColor: "text-amber-400",
        ringClass: "ring-amber-200 group-hover:ring-amber-400",
        hoverBg: "hover:bg-amber-50/50",
        xpClass: "text-amber-500 bg-amber-50 border-amber-100",
    },
    {
        pos: 2,
        name: "Carlos J.",
        level: 4,
        xp: "9.350 XP",
        avatar: "https://github.com/rauchg.png",
        medal: "🥈",
        posColor: "text-slate-600",
        ringClass: "ring-slate-200 group-hover:ring-slate-400",
        hoverBg: "hover:bg-slate-50",
        xpClass: "text-slate-600 bg-slate-100 border-slate-200",
    },
    {
        pos: 3,
        name: "Pedro H.",
        level: 4,
        xp: "8.980 XP",
        avatar: "https://github.com/timneutkens.png",
        medal: "🥉",
        posColor: "text-orange-600",
        ringClass: "ring-orange-200 group-hover:ring-orange-400",
        hoverBg: "hover:bg-orange-50/50",
        xpClass: "text-orange-600 bg-orange-50 border-orange-100",
    },
]

export function RankingTop3() {
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
                {TOP3.map((entry) => (
                    <li key={entry.pos}>
                    <a
                        href="/ranking"
                        aria-label={`${entry.pos}º lugar: ${entry.name}, Nível ${entry.level}, ${entry.xp}`}
                        className={`rank-row-${entry.pos} group flex items-center gap-3 px-4 py-3.5 ${entry.hoverBg} transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400`}
                    >
                        <span
                            className={`w-6 text-center text-sm font-bold ${entry.posColor} transition-transform duration-200 group-hover:scale-125`}
                        >
                            {entry.pos}
                        </span>

                        <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={entry.avatar}
                                alt={entry.name}
                                className={`h-9 w-9 rounded-full object-cover ring-2 ${entry.ringClass} transition-all duration-200 group-hover:scale-105`}
                            />
                            <span className="absolute -right-0.5 -bottom-0.5 text-[10px] leading-none">
                                {entry.medal}
                            </span>
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {entry.name}
                            </p>
                            <p className="text-xs text-slate-500">Nível {entry.level}</p>
                        </div>

                        <span
                            className={`xp-badge rounded-full border px-2 py-0.5 font-mono text-xs font-bold ${entry.xpClass}`}
                        >
                            {entry.xp}
                        </span>
                    </a>
                    </li>
                ))}
            </ul>
        </section>
    )
}
