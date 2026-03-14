import { Trophy } from "lucide-react"

type Props = {
    position: number
}

export function PositionFooter({ position }: Props) {
    if (position <= 3) return null

    return (
        <div className="flex items-center justify-center gap-1.5 text-sm text-slate-400">
            <Trophy size={14} className="text-blue-400" />
            <span>Você está em <strong className="text-blue-600">{position}° lugar</strong></span>
        </div>
    )
}
