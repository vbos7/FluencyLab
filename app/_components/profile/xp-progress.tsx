type Props = {
    current: number
    max: number
    level: number
    levelLabel: string
}

export function XpProgress({ current, max, level, levelLabel }: Props) {
    const pct = Math.min(Math.round((current / max) * 100), 100)
    const remaining = max - current

    return (
        <section aria-labelledby="xp-title">
        <div className="rounded-2xl border border-[#dce8ff] bg-white p-4 shadow-[0_2px_16px_rgba(37,99,235,0.08)] sm:p-6">
            <h2 id="xp-title" className="mb-3 text-sm font-extrabold text-[#1e293b] sm:mb-4 sm:text-base">
                ⚡ Progresso para o Próximo Nível
            </h2>

            <div className="mb-2 flex justify-between text-[11px] font-bold text-[#7a94b8] sm:text-[.82rem]">
                <span>
                    Nível {level} — {levelLabel}
                </span>
                <span>
                    {current} / {max} XP
                </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-[#e8f0fe] sm:h-3">
                {/* Animação via CSS puro: @keyframes xpFill { from { width: 0% } }
                    O estado final (width: pct%) é lido do inline style após a animação */}
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${pct}%`,
                        background: "linear-gradient(90deg,#2563eb,#60a5fa)",
                        animation: "xpFill 1s 0.2s ease-out both",
                    }}
                />
            </div>

            <div className="mt-1.5 text-right text-[10px] text-[#7a94b8] sm:text-[.78rem]">
                Faltam {remaining} pts para o Nível {level + 1}
            </div>
        </div>
        </section>
    )
}
