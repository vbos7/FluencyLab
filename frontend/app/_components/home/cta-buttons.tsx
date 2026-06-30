"use client"

import { useRouter } from "next/navigation"

export function CtaButtons() {
    const router = useRouter()

    function enterAsGuest() {
        localStorage.setItem("fluency-lab:mode", "guest")
        router.push("/practice")
    }

    return (
        <div className="anim-2 flex flex-col gap-3">
            {/* Criar conta + Entrar lado a lado */}
            <div className="grid grid-cols-2 gap-3">
                <a
                    href="/register"
                    className="relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-br from-blue-500 to-blue-800 text-sm font-bold text-white shadow-md shadow-blue-400/35 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-400/45 active:scale-[0.98]"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    Criar conta
                    <span className="absolute inset-0 -translate-x-full animate-[shimmer_3s_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
                </a>

                <a
                    href="/login"
                    className="flex h-13 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-[#f0f4ff] text-sm font-bold text-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-sm hover:shadow-blue-100 active:scale-[0.98]"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Entrar
                </a>
            </div>

            {/* Botão convidado */}
            <div className="relative flex items-center gap-3">
                <div className="h-px flex-1 bg-blue-100" />
                <span className="text-[11px] font-medium tracking-wide text-blue-500 uppercase">
                    ou
                </span>
                <div className="h-px flex-1 bg-blue-100" />
            </div>
            <button
                onClick={enterAsGuest}
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-dashed border-blue-300 bg-white text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-blue-400 hover:text-blue-600 active:scale-[0.98]"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                </svg>
                Entrar como convidado
            </button>
        </div>
    )
}
