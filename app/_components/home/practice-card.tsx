import { Languages } from "lucide-react"

type Props = {
    xp: number
    xpNeeded: number
    level: number
}

export function PracticeCard({ xp, xpNeeded, level }: Props) {
    return (
        <div className="relative mb-7 flex h-28 items-center justify-between gap-3 overflow-hidden rounded-2xl border border-[#dce8ff] bg-white shadow-[0_2px_16px_rgba(37,99,235,0.08)] p-4 hover:shadow-[0_4px_24px_rgba(37,99,235,0.13)] hover:-translate-y-0.5 transition-all duration-200 p-4 shadow-sm md:h-44 md:gap-6 md:p-7">
            {/* Barra lateral */}
            <div className="absolute top-0 bottom-0 left-0 w-1 rounded-l-2xl bg-gradient-to-b from-blue-300 to-blue-600 md:w-2" />

            {/* Texto */}
            <div className="flex-1 pl-3 md:pl-4">
                <h3 className="mb-1 text-sm font-extrabold text-slate-900 md:mb-2 md:text-base">
                    Pronto para praticar e subir seu nível?
                </h3>
                <p className="max-w-[160px] text-[0.7rem] leading-relaxed text-slate-500 md:max-w-sm md:text-sm">
                    Você está a {xpNeeded - xp} XP do nível {level + 1}. Um pouquinho mais e você
                    chega lá!
                </p>
            </div>

            {/* Botão */}
            <a
                href="/practice"
                className="hover-lift flex w-20 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-[0.7rem] font-bold text-white hover:bg-blue-700 md:w-48 md:rounded-xl md:px-10 md:py-4 md:text-base"
            >
                <Languages className="h-3 w-3 shrink-0 md:h-5 md:w-5" />
                <span className="hidden md:inline">Ir Praticar</span>
                <span className="md:hidden">Praticar</span>
            </a>
        </div>
    )
}
