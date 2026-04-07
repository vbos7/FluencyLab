import { Sparkles } from "lucide-react"

type Props = {
    earnedXp: number
    visible: boolean
}

export function XpToast({ earnedXp, visible }: Props) {
    return (
        // Sempre no DOM — aria-live anuncia a mudança de conteúdo ao leitor de tela
        <div
            aria-live="polite"
            aria-atomic="true"
            className="pointer-events-none fixed top-5 left-1/2 z-100 -translate-x-1/2"
        >
            {visible && (
                <div className="flex items-center gap-1.5 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
                    <Sparkles className="size-4.5" aria-hidden="true" />
                    <span>+{earnedXp} XP</span>
                </div>
            )}
        </div>
    )
}
