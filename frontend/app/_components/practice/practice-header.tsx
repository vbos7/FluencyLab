import { Lock } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
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
}

const DIFFICULTY_OPTIONS = [
    { value: "easy", label: "Fácil" },
    { value: "medium", label: "Médio" },
    { value: "hard", label: "Difícil" },
]

export function PracticeHeader({
    difficulty,
    onChangeDifficulty,
    category,
    onChangeCategory,
    categories,
    isPremium,
}: Props) {
    return (
        <div className="mb-6 flex flex-col gap-3">
            {/* Mobile: nível e categoria lado a lado, ambos como select shadcn/ui */}
            <div className="grid grid-cols-2 gap-2 sm:hidden">
                <Select value={difficulty} onValueChange={onChangeDifficulty}>
                    <SelectTrigger className="h-9 w-full rounded-xl border-slate-200 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:ring-offset-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {DIFFICULTY_OPTIONS.map((d) => (
                            <SelectItem key={d.value} value={d.value}>
                                {d.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {isPremium ? (
                    <Select value={category} onValueChange={onChangeCategory}>
                        <SelectTrigger className="h-9 w-full rounded-xl border-slate-200 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:ring-offset-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas categorias</SelectItem>
                            {categories.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <a
                        href="/planos"
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                    >
                        <Lock size={13} />
                        Só no Pro
                    </a>
                )}
            </div>

            {/* Desktop: tabs de dificuldade + select de categoria */}
            <div className="hidden flex-wrap items-center gap-3 sm:flex">
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

                {isPremium ? (
                    <Select value={category} onValueChange={onChangeCategory}>
                        <SelectTrigger className="h-9 w-fit gap-2 rounded-xl border-slate-200 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-100 focus:ring-offset-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as categorias</SelectItem>
                            {categories.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
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
        </div>
    )
}
