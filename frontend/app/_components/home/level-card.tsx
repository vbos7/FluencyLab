type Props = {
    level: number
    xp: number
    xpNeeded: number
    streak: number
}

export function LevelCard({ level, xp, xpNeeded, streak }: Props) {
    const pct = (xp / xpNeeded) * 100

    return (
        <div className="relative mb-1 overflow-hidden rounded-2xl bg-linear-to-br from-blue-700 to-blue-600 p-7 text-white shadow-xl shadow-blue-900/40">
            {/* Orbs decorativos */}
            <div className="pointer-events-none absolute -top-14 -right-14 h-52 w-52 rounded-full bg-white/6" />
            <div className="pointer-events-none absolute right-16 -bottom-16 h-40 w-40 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute bottom-28 -left-28 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative z-10">
                {/* Nível + streak */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <p className="mb-1 text-[0.65rem] font-bold tracking-widest uppercase opacity-70">
                            Nível Atual
                        </p>
                        <p className="font-mono text-5xl leading-none font-medium">
                            {String(level).padStart(2, "0")}
                        </p>
                    </div>

                    {/* Badge streak com chama animada */}
                    <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/15 px-3.5 py-2 text-sm font-bold backdrop-blur-sm">
                        <FlameIcon />
                        {streak} dias streak
                    </div>
                </div>

                {/* Labels XP */}
                <div className="mb-2 flex justify-between text-xs font-semibold opacity-75">
                    <span>{xp} XP</span>
                    <span>Meta: {xpNeeded} XP</span>
                </div>

                {/* Barra de progresso */}
                <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
                    <div
                        className="relative h-full rounded-full bg-linear-to-r from-white/90 to-white/60 transition-all duration-1000 ease-out"
                        style={{ width: `${pct}%` }}
                    >
                        <span className="absolute top-1/2 right-0 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    </div>
                </div>

                <p className="mt-2.5 text-left text-[0.7rem] font-medium opacity-60">
                    Faltam <strong className="opacity-100">{xpNeeded - xp} XP</strong> para o Nível{" "}
                    {level + 1}
                </p>
            </div>
        </div>
    )
}

function FlameIcon() {
    return (
        <svg
            viewBox="0 0 32 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 drop-shadow-[0_0_6px_rgba(251,146,60,0.9)]"
            style={{
                animation: "flameSway 1.8s ease-in-out infinite alternate",
                transformOrigin: "50% 95%",
            }}
        >
            <defs>
                <linearGradient
                    id="flameOuter"
                    x1="16"
                    y1="38"
                    x2="16"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="40%" stopColor="#f97316" />
                    <stop offset="75%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#fde68a" />
                </linearGradient>
                <linearGradient
                    id="flameInner"
                    x1="16"
                    y1="38"
                    x2="16"
                    y2="4"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="35%" stopColor="#fbbf24" />
                    <stop offset="70%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
                <linearGradient
                    id="flameCore"
                    x1="16"
                    y1="38"
                    x2="16"
                    y2="12"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#fef9c3" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                </linearGradient>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Chama externa */}
            <path
                d="M16 2 C16 2 22 8 23 14 C24.5 11 24 7 22 4 C26 7 28 12 27.5 18 C28.5 16 29 13 28 10 C31 15 31 21 29 26 C27.5 30 23.5 34 16 36 C8.5 34 4.5 30 3 26 C1 21 1 15 4 10 C3 13 3.5 16 4.5 18 C4 12 6 7 10 4 C8 7 7.5 11 9 14 C10 8 12 2 16 2Z"
                fill="url(#flameOuter)"
                filter="url(#glow)"
                style={{
                    animation: "flameBreath 0.9s ease-in-out infinite alternate",
                    transformOrigin: "16px 36px",
                }}
            />
            {/* Chama intermediária */}
            <path
                d="M16 8 C16 8 20 13 20.5 18 C21.5 15.5 21 12 19.5 10 C22 13 23 17.5 22 22 C22.5 20.5 23 18 22.5 16 C24.5 19.5 24 24 22 28 C20.5 31 18.5 33 16 34 C13.5 33 11.5 31 10 28 C8 24 7.5 19.5 9.5 16 C9 18 9.5 20.5 10 22 C9 17.5 10 13 12.5 10 C11 12 10.5 15.5 11.5 18 C12 13 13.5 8 16 8Z"
                fill="url(#flameInner)"
                style={{
                    animation: "flameBreath 0.7s 0.1s ease-in-out infinite alternate",
                    transformOrigin: "16px 34px",
                }}
            />
            {/* Núcleo */}
            <path
                d="M16 14 C16 14 18.5 17.5 18.5 21 C19 19.5 18.5 17.5 17.5 16 C19 18 19.5 21 18.5 24 C18 26.5 17 28.5 16 29.5 C15 28.5 14 26.5 13.5 24 C12.5 21 13 18 14.5 16 C13.5 17.5 13 19.5 13.5 21 C13.5 17.5 14.5 14 16 14Z"
                fill="url(#flameCore)"
                style={{
                    animation: "coreFlicker 0.5s 0.05s ease-in-out infinite alternate",
                    transformOrigin: "16px 29px",
                }}
            />
            {/* Faíscas */}
            <circle
                cx="9"
                cy="10"
                r="1"
                fill="#fb923c"
                style={{ animation: "sparkFloat 1.4s 0.0s ease-out infinite", opacity: 0 }}
            />
            <circle
                cx="23"
                cy="8"
                r="0.8"
                fill="#fbbf24"
                style={{ animation: "sparkFloat 1.2s 0.3s ease-out infinite", opacity: 0 }}
            />
            <circle
                cx="7"
                cy="15"
                r="0.7"
                fill="#f97316"
                style={{ animation: "sparkFloat 1.6s 0.6s ease-out infinite", opacity: 0 }}
            />
            <circle
                cx="25"
                cy="13"
                r="1"
                fill="#fde68a"
                style={{ animation: "sparkFloat 1.1s 0.9s ease-out infinite", opacity: 0 }}
            />
            <circle
                cx="13"
                cy="6"
                r="0.6"
                fill="#fb923c"
                style={{ animation: "sparkFloat 1.3s 0.2s ease-out infinite", opacity: 0 }}
            />
        </svg>
    )
}
