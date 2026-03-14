import { cn } from "@/app/_lib/utils"
import { type Phrase, DIFFICULTY_STYLES, DIFFICULTY_LABELS } from "@/app/_lib/practice"

type Props = {
    // Frase a ser exibida
    phrase: Phrase
}

export function PhraseCard({ phrase }: Props) {
    return (
        <div className="bg-linear-to-br from-blue-50 to-white border border-blue-100 rounded-4xl p-7 mb-5">
            <div className="flex gap-2 mb-3.5 items-center">
                {/* Badge de dificuldade com cor dinâmica via DIFFICULTY_STYLES */}
                <span className={cn(
                    "inline-block px-2.5 py-0.75 rounded-full text-[11px] font-semibold uppercase tracking-[0.05em]",
                    DIFFICULTY_STYLES[phrase.difficulty]
                )}>
                    {DIFFICULTY_LABELS[phrase.difficulty]}
                </span>
                <span className="text-xs text-slate-400 font-medium">{phrase.category}</span>
            </div>
            <p className="text-[20px] font-semibold text-slate-800 leading-relaxed tracking-tight">
                {phrase.pt}
            </p>
        </div>
    )
}
