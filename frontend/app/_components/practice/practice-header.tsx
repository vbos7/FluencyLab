import { StarIcon, Lock, ChevronDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
import { cn } from "@/app/_lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select"


type Props = {
    difficulty: string
    onChangeDifficulty: (value: string) => void
    category: string
    onChangeCategory: (value: string) => void
    categories: string[]
    isPremium: boolean
    isFav: boolean
    justFavorited: boolean
    onToggleFavorite: () => void
    showFavorite: boolean
}

export function PracticeHeader({
    difficulty,
    onChangeDifficulty,
    category,
    onChangeCategory,
    categories,
    isPremium,
    isFav,
    justFavorited,
    onToggleFavorite,
    showFavorite,
}: Props) {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
                <Tabs value={difficulty} onValueChange={onChangeDifficulty} className="w-fit">
                    <TabsList>
                        <TabsTrigger value="easy" className="px-5">Fácil</TabsTrigger>
                        <TabsTrigger value="medium" className="px-5">Médio</TabsTrigger>
                        <TabsTrigger value="hard" className="px-5">Difícil</TabsTrigger>
                    </TabsList>
                </Tabs>

                {isPremium ? (
                    <Select value={category} onValueChange={onChangeCategory}>
                        <SelectTrigger className="h-9 w-fit gap-2 rounded-xl border-slate-200 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:ring-offset-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as categorias</SelectItem>
                            {categories.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <a
                        href="/planos"
                        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                    >
                        <Lock size={13} />
                        Categorias — só no Pro
                    </a>
                )}
            </div>

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
                    <StarIcon className={cn("size-4 transition-all duration-200", isFav && "fill-white")} />
                    {isFav ? "Favoritada" : "Favoritar"}
                </button>
            )}
        </div>  
    )
}