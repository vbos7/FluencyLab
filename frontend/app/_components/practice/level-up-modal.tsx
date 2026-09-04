"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { PartyPopper, Sparkles } from "lucide-react"
import { levelLabel } from "@/app/_lib/ranking"
import { useMounted } from "@/app/_lib/use-mounted"

type Props = {
    // Nível recém-alcançado; null = modal fechado (nenhuma subida a comemorar)
    level: number | null
    onClose: () => void
}

// Peças de confete (valores fixos p/ não haver mismatch de hidratação). Ficam nas
// laterais: metade à esquerda (2–24%) e metade à direita (76–98%) do modal.
const CONFETTI = [
    { left: 4, delay: 0, dur: 2.6, color: "#2563eb", round: true },
    { left: 9, delay: 0.5, dur: 3.1, color: "#f59e0b", round: false },
    { left: 15, delay: 1.1, dur: 2.9, color: "#6366f1", round: false },
    { left: 20, delay: 0.2, dur: 3.4, color: "#38bdf8", round: true },
    { left: 24, delay: 1.4, dur: 2.7, color: "#8b5cf6", round: false },
    { left: 12, delay: 1.9, dur: 3.2, color: "#22c55e", round: true },
    { left: 6, delay: 2.3, dur: 3.0, color: "#6366f1", round: false },
    { left: 18, delay: 0.8, dur: 3.5, color: "#f59e0b", round: true },
    { left: 78, delay: 0.3, dur: 3.0, color: "#f59e0b", round: false },
    { left: 83, delay: 1.0, dur: 2.7, color: "#2563eb", round: true },
    { left: 88, delay: 0.6, dur: 3.3, color: "#8b5cf6", round: false },
    { left: 93, delay: 1.6, dur: 2.8, color: "#38bdf8", round: true },
    { left: 97, delay: 0.1, dur: 3.4, color: "#22c55e", round: false },
    { left: 81, delay: 2.1, dur: 3.1, color: "#6366f1", round: true },
    { left: 90, delay: 2.5, dur: 2.9, color: "#f59e0b", round: false },
    { left: 95, delay: 1.3, dur: 3.2, color: "#2563eb", round: true },
]

// Comemoração exibida quando o aluno cruza o limiar de XP e sobe de nível.
// É disparado pelo practice-controller a partir do `leveled_up` que o backend devolve.
// Renderiza via portal no <body> para o fundo escuro cobrir a tela inteira (dentro
// da árvore da prática há um ancestral com transform, que prenderia o position:fixed).
export function LevelUpModal({ level, onClose }: Props) {
    const mounted = useMounted()

    // Fecha no Esc enquanto o modal estiver aberto
    useEffect(() => {
        if (level === null) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [level, onClose])

    if (level === null || !mounted) return null

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="levelup-title"
            className="fixed inset-0 z-200 flex items-center justify-center p-4"
        >
            {/* Fundo escurecido — cobre a viewport inteira; clicar fora fecha */}
            <div
                className="absolute inset-0 animate-in fade-in bg-black/50 backdrop-blur-sm duration-200"
                onClick={onClose}
            />

            {/* Confete caindo nas laterais */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                {CONFETTI.map((c, i) => (
                    <span
                        key={i}
                        className="absolute top-0 block"
                        style={{
                            left: `${c.left}%`,
                            width: c.round ? 8 : 7,
                            height: c.round ? 8 : 12,
                            backgroundColor: c.color,
                            borderRadius: c.round ? "9999px" : "1px",
                            animation: `confettiFall ${c.dur}s ${c.delay}s linear infinite`,
                        }}
                    />
                ))}
            </div>

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
        </div>,
        document.body
    )
}
