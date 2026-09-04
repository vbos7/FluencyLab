import Link from "next/link"
import { BookOpen, ChevronRight } from "lucide-react"

export function CoursesCard() {
    return (
        <Link href="/cursos" className="block">
            <div className="mb-8 rounded-2xl border border-[#dce8ff] bg-white p-4 shadow-[0_2px_16px_rgba(37,99,235,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(37,99,235,0.13)]">
                <div className="flex items-center justify-between">
                    {/* Esquerda — ícone + texto */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
                            <BookOpen size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Cursos de Inglês</p>
                            <p className="mt-0.5 text-xs text-gray-400">
                                Básico · Intermediário · Avançado
                            </p>
                        </div>
                    </div>

                    {/* Direita — badge + seta */}
                    <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600">
                            ✦ Pro
                        </span>
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>
                </div>
            </div>
        </Link>
    )
}
