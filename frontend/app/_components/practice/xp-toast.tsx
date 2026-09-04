"use client"

import { createPortal } from "react-dom"
import { Sparkles } from "lucide-react"
import { useMounted } from "@/app/_lib/use-mounted"
import { usePrefersReducedMotion } from "@/app/_lib/use-prefers-reduced-motion"

type Props = {
    earnedXp: number
    visible: boolean
}

// Toast de XP no topo CENTRAL. Renderiza via portal no <body> para o position:fixed
// valer sobre a viewport inteira (dentro da prática há um ancestral com transform,
// que o prenderia à coluna central).
export function XpToast({ earnedXp, visible }: Props) {
    const mounted = useMounted()
    const reduce = usePrefersReducedMotion()

    if (!mounted) return null

    return createPortal(
        // Sempre no DOM — aria-live anuncia a mudança de conteúdo ao leitor de tela
        <div
            aria-live="polite"
            aria-atomic="true"
            className="pointer-events-none fixed top-6 left-1/2 z-200 -translate-x-1/2"
        >
            {visible && (
                <div
                    className={`flex items-center gap-3 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 py-2.5 pr-6 pl-2.5 text-white shadow-[0_12px_32px_rgba(37,99,235,0.45)] ring-1 ring-white/20 ${reduce ? "" : "animate-in fade-in slide-in-from-top-4 zoom-in-95 duration-300"}`}
                >
                    <span className="flex size-9 items-center justify-center rounded-full bg-white/20">
                        <Sparkles className="size-5" aria-hidden="true" />
                    </span>
                    <span className="flex items-baseline gap-1">
                        <span className="text-xl font-extrabold tracking-tight">+{earnedXp}</span>
                        <span className="text-sm font-semibold text-blue-100">XP</span>
                    </span>
                </div>
            )}
        </div>,
        document.body
    )
}
