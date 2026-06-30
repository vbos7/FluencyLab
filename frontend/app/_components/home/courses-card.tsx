import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

export function CoursesCard() {
  return (
    <Link href="/cursos" className="block ">
      <div className="rounded-2xl border border-[#dce8ff] bg-white shadow-[0_2px_16px_rgba(37,99,235,0.08)] p-4 hover:shadow-[0_4px_24px_rgba(37,99,235,0.13)] hover:-translate-y-0.5 transition-all duration-200 mb-8">
        <div className="flex items-center justify-between">

          {/* Esquerda — ícone + texto */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Cursos de Inglês</p>
              <p className="text-xs text-gray-400 mt-0.5">Básico · Intermediário · Avançado</p>
            </div>
          </div>

          {/* Direita — badge + seta */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-medium bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">
              ✦ Pro
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </div>

        </div>
      </div>
    </Link>
  );
}