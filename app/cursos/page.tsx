import Link from "next/link";
import NavLayout from "../_layouts/nav-layout";

const niveis = [
  {
    slug: "basico",
    titulo: "Básico",
    descricao: "Vocabulário essencial, cumprimentos e frases do dia a dia.",
    aulas: 12,
    emoji: "🌱",
    cor: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    slug: "intermediario",
    titulo: "Intermediário",
    descricao: "Gramática, tempos verbais e conversação mais fluente.",
    aulas: 15,
    emoji: "📘",
    cor: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    slug: "avancado",
    titulo: "Avançado",
    descricao: "Expressões idiomáticas, escrita formal e fluência avançada.",
    aulas: 10,
    emoji: "🚀",
    cor: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
];

export const metadata = {
  title: "Cursos — FluencyLab",
};

export default function CursosPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900">
          Cursos de Inglês
        </h1>
        <p className="text-gray-500 mt-2">
          Escolha o nível e comece a aprender.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {niveis.map((nivel) => (
          <Link
            key={nivel.slug}
            href={`/cursos/${nivel.slug}`}
            className="group rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4 hover:shadow-md hover:border-blue-200 transition-all duration-200"
          >
            <div className={`w-12 h-12 rounded-xl ${nivel.bg} ${nivel.border} border flex items-center justify-center text-2xl`}>
              {nivel.emoji}
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <h2 className={`text-lg font-semibold ${nivel.cor}`}>
                {nivel.titulo}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {nivel.descricao}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">{nivel.aulas} aulas</span>
              <span className={`text-xs font-medium ${nivel.cor} group-hover:underline`}>
                Acessar →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}