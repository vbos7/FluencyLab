"use client"

import { useEffect } from "react"
import { PartyPopper, Sparkles } from "lucide-react"
import { levelLabel } from "@/app/_lib/ranking"

type Props = {
    // Nível recém-alcançado; null = modal fechado (nenhuma subida a comemorar)
    level: number | null
    onClose: () => void
}

// Comemoração exibida quando o aluno cruza o limiar de XP e sobe de nível.
// É disparado pelo practice-controller a partir do `leveled_up` que o backend devolve.
export function LevelUpModal({ level, onClose }: Props) {
    // Fecha no Esc enquanto o modal estiver aberto
    useEffect(() => {
        if (level === null) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [level, onClose])

    if (level === null) return null

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="levelup-title"
            className="fixed inset-0 z-200 flex items-center justify-center p-4"
        >
            {/* Fundo escurecido — clicar fora fecha */}
            <div
                className="absolute inset-0 animate-in fade-in bg-black/50 backdrop-blur-sm duration-200"
                onClick={onClose}
            />

            <div className="animate-in fade-in zoom-in-95 relative w-full max-w-sm overflow-hidden rounded-3xl bg-white text-center shadow-[0_24px_64px_rgba(37,99,235,0.35)] duration-300">
                {/* Faixa superior com o troféu */}
                <div className="relative flex flex-col items-center gap-3 bg-gradient-to-br from-blue-600 to-indigo-600 px-6 pt-9 pb-8 text-white">
                    <Sparkles
                        className="absolute top-5 left-6 size-5 animate-pulse text-white/70"
                        aria-hidden="true"
                    />
                    <Sparkles
                        className="absolute top-8 right-7 size-4 animate-pulse text-white/60"
                        aria-hidden="true"
                    />
                    <div className="flex size-20 items-center justify-center rounded-2xl bg-white/15 shadow-inner">
                        <PartyPopper className="size-10" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-medium tracking-wide text-blue-100 uppercase">
                        Você subiu de nível!
                    </p>
                </div>

                {/* Corpo */}
                <div className="flex flex-col items-center gap-1 px-6 pt-6 pb-7">
                    <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                        Nível
                    </span>
                    <h2 id="levelup-title" className="text-5xl font-extrabold text-gray-900">
                        {level}
                    </h2>
                    <p className="mt-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                        {levelLabel(level)}
                    </p>
                    <p className="mt-3 text-sm text-gray-500">
                        Continue praticando para chegar ainda mais longe.
                    </p>

                    <button
                        onClick={onClose}
                        autoFocus
                        className="mt-5 w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    )
}
