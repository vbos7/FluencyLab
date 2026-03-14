import { Sparkles } from "lucide-react"

type Props = {
    // XP ganho na última verificação
    earnedXp: number
    // Controla a visibilidade do toast
    visible: boolean
}

export function XpToast({ earnedXp, visible }: Props) {
    if (!visible) return null

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-100">
            <div className="flex items-center gap-1.5 bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-semibold text-sm shadow-[0_8px_24px_rgba(37,99,235,0.3)]">
                <Sparkles className="size-4.5" />
                +{earnedXp} XP
            </div>
        </div>
    )
}
