import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NavLayout from "@/app/_layouts/nav-layout";

const aulas = [
  { titulo: "Aula 1 — Apresentações e cumprimentos", duracao: "8:24",  youtubeId: "YOUTUBE_ID_AQUI" },
  { titulo: "Aula 2 — Números e cores",              duracao: "10:10", youtubeId: "YOUTUBE_ID_AQUI" },
  { titulo: "Aula 3 — Dias da semana e meses",       duracao: "9:05",  youtubeId: "YOUTUBE_ID_AQUI" },
];

export const metadata = { title: "Básico — FluencyLab" };

export default function BasicoPage() {
  return (
    <NavLayout>
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/cursos" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-8 transition">
        <ArrowLeft size={15} />
        Voltar para cursos
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Nível Básico 🌱</h1>
        <p className="text-gray-500 text-sm mt-1">{aulas.length} aulas disponíveis</p>
      </div>

      <div className="flex flex-col gap-4">
        {aulas.map((aula, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-200">
            <div className="aspect-video w-full bg-gray-100">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${aula.youtubeId}`}
                title={aula.titulo}
                allowFullScreen
              />
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{aula.titulo}</p>
                <p className="text-xs text-gray-400 mt-0.5">{aula.duracao}</p>
              </div>
              <span className="text-xs bg-green-50 text-green-600 border border-green-100 px-2.5 py-1 rounded-full font-medium">
                Aula {index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
    </NavLayout>
  );
}