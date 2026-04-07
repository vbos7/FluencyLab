import { cn } from "@/app/_lib/utils"
import { type Phrase, DIFFICULTY_STYLES, DIFFICULTY_LABELS } from "@/app/_lib/practice"

type Props = {
    // Frase a ser exibida
    phrase: Phrase
}

export function PhraseCard({ phrase }: Props) {
    return (
        <div className="mb-5 rounded-4xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-7">
            <div className="mb-3.5 flex items-center gap-2">
                {/* Badge de dificuldade com cor dinâmica via DIFFICULTY_STYLES */}
                <span
                    className={cn(
                        "inline-block rounded-full px-2.5 py-0.75 text-[11px] font-semibold tracking-[0.05em] uppercase",
                        DIFFICULTY_STYLES[phrase.difficulty]
                    )}
                >
                    {DIFFICULTY_LABELS[phrase.difficulty]}
                </span>
                <span className="text-xs font-medium text-slate-400">{phrase.category}</span>
            </div>
            <p id="current-phrase" className="text-[20px] leading-relaxed font-semibold tracking-tight text-slate-800">
                {phrase.pt}
            </p>
        </div>
    )
}
