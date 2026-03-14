import { StarIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
import { cn } from "@/app/_lib/utils"

type Props = {
    // Dificuldade atualmente selecionada
    difficulty: string
    // Callback ao trocar a dificuldade
    onChangeDifficulty: (value: string) => void
    // Se a frase atual está favoritada
    isFav: boolean
    // Se a animação de pop do favorito está ativa
    justFavorited: boolean
    // Callback ao clicar no botão de favoritar
    onToggleFavorite: () => void
}

export function PracticeHeader({ difficulty, onChangeDifficulty, isFav, justFavorited, onToggleFavorite }: Props) {
    return (
        <div className="flex justify-between items-center mb-6">
            {/* Tabs de dificuldade — controladas e persistidas no localStorage */}
            <Tabs value={difficulty} onValueChange={onChangeDifficulty} className="w-fit">
                <TabsList>
                    <TabsTrigger value="easy" className="px-5">Fácil</TabsTrigger>
                    <TabsTrigger value="medium" className="px-5">Médio</TabsTrigger>
                    <TabsTrigger value="hard" className="px-5">Difícil</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Badge clicável que alterna entre "Favoritar" e "Favoritada" */}
            <button
                onClick={onToggleFavorite}
                className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border cursor-pointer select-none transition-all duration-200",
                    isFav
                        ? "bg-blue-600 text-white border-blue-600 shadow-[0_2px_8px_rgba(37,99,235,0.3)]"
                        : "bg-white text-slate-500 border-slate-300 hover:border-blue-400 hover:text-blue-500",
                    justFavorited && "scale-125",
                )}
            >
                <StarIcon className={cn("size-4 transition-all duration-200", isFav && "fill-white")} />
                {isFav ? "Favoritada" : "Favoritar"}
            </button>
        </div>
    )
}
