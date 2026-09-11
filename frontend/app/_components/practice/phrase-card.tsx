import { StarIcon } from "lucide-react"
import { cn } from "@/app/_lib/utils"
import { type Phrase, DIFFICULTY_STYLES, DIFFICULTY_LABELS } from "@/app/_lib/practice"

type Props = {
    // Frase a ser exibida
    phrase: Phrase
    isFav: boolean
    justFavorited: boolean
    onToggleFavorite: () => void
    showFavorite: boolean
}

export function PhraseCard({
    phrase,
    isFav,
    justFavorited,
    onToggleFavorite,
    showFavorite,
}: Props) {
    return (
        <div className="relative mb-5 rounded-4xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-7">
            {showFavorite && (
                <button
                    onClick={onToggleFavorite}
                    aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    className={cn(
                        "absolute top-5 right-5 cursor-pointer transition-transform duration-200 select-none",
                        justFavorited && "scale-125"
                    )}
                >
                    <StarIcon
                        className={cn(
                            "size-6 text-slate-300 transition-colors duration-200",
                            isFav && "fill-amber-400 text-amber-400"
                        )}
                    />
                </button>
            )}
            <div className="mb-3.5 flex items-center gap-2 pr-8">
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
            <p
                id="current-phrase"
                className="text-[20px] leading-relaxed font-semibold tracking-tight text-slate-800"
            >
                {phrase.pt}
            </p>
        </div>
    )
}
