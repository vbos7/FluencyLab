import { Languages } from "lucide-react"

type Props = {
    xp: number
    xpNeeded: number
    level: number
}

export function PracticeCard({ xp, xpNeeded, level }: Props) {
    return (
        <div className="relative overflow-hidden bg-white rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between p-4 md:p-7 gap-3 md:gap-6 h-28 md:h-44 mb-7">

            {/* Barra lateral */}
            <div className="absolute left-0 top-0 bottom-0 w-1 md:w-2 rounded-l-2xl bg-gradient-to-b from-blue-300 to-blue-600" />

            {/* Texto */}
            <div className="pl-3 md:pl-4 flex-1">
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base mb-1 md:mb-2">
                    Pronto para praticar e subir seu nível?
                </h3>
                <p className="text-slate-500 leading-relaxed text-[0.7rem] md:text-sm max-w-[160px] md:max-w-sm">
                    Você está a {xpNeeded - xp} XP do nível {level + 1}. Um pouquinho mais e você chega lá!
                </p>
            </div>

            {/* Botão */}
            <a
                href="/practice"
                className="shrink-0 flex items-center justify-center gap-2 text-white font-bold bg-gradient-to-br from-blue-500 to-blue-800 shadow-md shadow-blue-400/35 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-400/45 active:scale-95 transition-all duration-200 rounded-lg md:rounded-xl text-[0.7rem] md:text-base px-3 py-2 md:px-10 md:py-4 w-20 md:w-48"
            >
                <Languages className="w-3 h-3 md:w-5 md:h-5 shrink-0" />
                <span className="hidden md:inline">Ir Praticar</span>
                <span className="md:hidden">Praticar</span>
            </a>
        </div>
    )
}
