import { StarIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
import { cn } from "@/app/_lib/utils"

type Props = {
    difficulty: string
    onChangeDifficulty: (value: string) => void
    isFav: boolean
    justFavorited: boolean
    onToggleFavorite: () => void
    showFavorite: boolean
}

export function PracticeHeader({
    difficulty,
    onChangeDifficulty,
    isFav,
    justFavorited,
    onToggleFavorite,
    showFavorite,
}: Props) {
    return (
        <div className="mb-6 flex items-center justify-between">
            {/* Tabs de dificuldade — controladas e persistidas no localStorage */}
            <Tabs value={difficulty} onValueChange={onChangeDifficulty} className="w-fit">
                <TabsList>
                    <TabsTrigger value="easy" className="px-5">
                        Fácil
                    </TabsTrigger>
                    <TabsTrigger value="medium" className="px-5">
                        Médio
                    </TabsTrigger>
                    <TabsTrigger value="hard" className="px-5">
                        Difícil
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Badge de favoritar — oculto no modo convidado */}
            {showFavorite && (
                <button
                    onClick={onToggleFavorite}
                    className={cn(
                        "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 select-none",
                        isFav
                            ? "border-blue-600 bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]"
                            : "border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600",
                        justFavorited && "scale-125"
                    )}
                >
                    <StarIcon
                        className={cn("size-4 transition-all duration-200", isFav && "fill-white")}
                    />
                    {isFav ? "Favoritada" : "Favoritar"}
                </button>
            )}
        </div>
    )
}
