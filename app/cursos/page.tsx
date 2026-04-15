"use client";

import Link from "next/link";
import NavLayout from "../_layouts/nav-layout";
import { Languages } from "lucide-react";
import { Icon } from "../_components/admin/icon";

const niveis = [
  {
    slug: "basico",
    titulo: "Básico",
    descricao: "Vocabulário essencial, cumprimentos e frases do dia a dia.",
    aulas: 12,
    emoji: <Languages size={32} className="text-white" />,
    cor: "from-green-500 to-green-600",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    border: "border-green-100",
    shadow: "shadow-md hover:shadow-xl",
  },
  {
    slug: "intermediario",
    titulo: "Intermediário",
    descricao: "Gramática, tempos verbais e conversação mais fluente.",
    aulas: 15,
    emoji:  <Languages size={32} className="text-white" />,
    cor: "from-blue-500 to-blue-600",
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
    border: "border-blue-100",
    shadow: "shadow-md hover:shadow-xl",
  },
  {
    slug: "avancado",
    titulo: "Avançado",
    descricao: "Expressões idiomáticas, escrita formal e fluência avançada.",
    aulas: 10,
    emoji:  <Languages size={32} className="text-white" />,
    cor: "from-purple-500 to-purple-600",
    bg: "bg-gradient-to-br from-purple-50 to-violet-50",
    border: "border-purple-100",
    shadow: "shadow-md hover:shadow-xl",
  },
];


export default function CursosPage() {
  return (
    <NavLayout>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-3xl border border-gray-200 shadow-xl mb-8">
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Nossos Cursos
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Escolha seu nível e comece sua jornada rumo à fluência no inglês. 
              <span className="font-semibold text-blue-600"> Aulas práticas e eficazes.</span>
            </p>
          </div>

          {/* Cards HORIZONTAIS empilhados */}
          <div className="space-y-8 max-w-2xl mx-auto">
            {niveis.map((nivel, index) => (
              <Link
                key={nivel.slug}
                href={`/cursos/${nivel.slug}`}
                className="group block"
              >
                <div className={`
                  bg-white rounded-3xl p-8 border ${nivel.border} 
                  ${nivel.shadow} hover:-translate-y-3 transition-all duration-500 
                  hover:border-blue-300 relative overflow-hidden
                  ${nivel.bg} backdrop-blur-sm
                `}>
                  {/* Background gradient animado */}
                  <div className="absolute inset-0 bg-gradient-to-r ${nivel.cor} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl"></div>
                  
                  {/* Badge nível */}
                  <div className="absolute -top-4 -right-4 bg-white shadow-lg px-4 py-2 rounded-2xl border border-gray-100 font-semibold text-gray-800 z-10">
                    Nível {index + 1}
                  </div>

                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:gap-8">
                    {/* Ícone grande */}
                    <div className={`
                      w-24 h-24 rounded-3xl ${nivel.bg} border-4 ${nivel.border} 
                      flex items-center justify-center text-4xl shadow-2xl
                      group-hover:scale-110 transition-transform duration-500
                      bg-gradient-to-br ${nivel.cor} text-white border-white/50
                    `}>
                      <span>{nivel.emoji}</span>
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 mt-6 lg:mt-0 space-y-4">
                      <div>
                        <h2 className={`
                          text-2xl lg:text-3xl font-bold bg-gradient-to-r 
                          from-gray-900 ${nivel.cor} bg-clip-text text-transparent
                          group-hover:translate-x-2 transition-transform duration-300
                        `}>
                          {nivel.titulo}
                        </h2>
                        <p className="text-gray-600 leading-relaxed mt-2 max-w-lg">
                          {nivel.descricao}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-bold text-gray-700">
                            📚
                          </div>
                          <span>{nivel.aulas} aulas</span>
                        </div>
                        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-bold text-green-600">
                            ⏱️
                          </div>
                          <span>2-4 semanas</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA animado */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between group-hover:gap-4 transition-all duration-300">
                      <span className="text-sm font-medium text-gray-500">Começar agora</span>
                      <div className={`
                        inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r 
                        ${nivel.cor} text-white rounded-2xl font-semibold text-sm
                        shadow-lg hover:shadow-xl transform hover:scale-105 
                        transition-all duration-300 group-hover:translate-x-4
                      `}>
                        Acessar curso
                        <span className="text-xs">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </main>
    </NavLayout>
  );
}