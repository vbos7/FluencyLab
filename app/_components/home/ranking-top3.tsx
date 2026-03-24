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
        posColor: "text-slate-400",
        ringClass: "ring-slate-200 group-hover:ring-slate-400",
        hoverBg: "hover:bg-slate-50",
        xpClass: "text-slate-500 bg-slate-50 border-slate-100",
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
        <div className="mt-7">
            <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-xl font-bold text-slate-900">Ranking Top 3</h2>
                <a href="/ranking" className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors">
                    Ver todos →
                </a>
            </div>

            <div className="flex flex-col divide-y divide-slate-100 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                {TOP3.map((entry) => (
                    <div
                        key={entry.pos}
                        className={`rank-row-${entry.pos} group flex items-center gap-3 px-4 py-3.5 ${entry.hoverBg} transition-colors duration-200 cursor-pointer`}
                    >
                        <span className={`w-6 text-sm font-bold text-center ${entry.posColor} group-hover:scale-125 transition-transform duration-200`}>
                            {entry.pos}
                        </span>

                        <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={entry.avatar}
                                alt={entry.name}
                                className={`w-9 h-9 rounded-full object-cover ring-2 ${entry.ringClass} group-hover:scale-105 transition-all duration-200`}
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 text-[10px] leading-none">{entry.medal}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{entry.name}</p>
                            <p className="text-xs text-slate-400">Nível {entry.level}</p>
                        </div>

                        <span className={`xp-badge text-xs font-bold font-mono px-2 py-0.5 rounded-full border ${entry.xpClass}`}>
                            {entry.xp}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
