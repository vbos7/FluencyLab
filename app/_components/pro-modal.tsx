"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function ProModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Aparece após 10 segundos na página
    const timer = setTimeout(() => setVisible(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/55 px-4"
      style={{ animation: "fadeIn 0.3s ease" }}
    >
      
      <div
        className="bg-white rounded-2xl w-full max-w-md mx-auto overflow-hidden shadow-xl" // ← MUDANÇAS AQUI
        style={{ animation: "slideUp 0.45s cubic-bezier(.16,1,.3,1)" }}
      >
        
                
        {/* Header */}
        <div className="bg-blue-700 px-6 py-7 text-center">

          <h2 className="text-blue-100 text-xl font-semibold">
            Você está perdendo muito!
          </h2>
          <p className="text-blue-300 text-sm mt-1">
            Usuários Pro evoluem 3x mais rápido no inglês
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <ul className="flex flex-col gap-3 mb-5">
            {[
              "Video aulas básico, intermediário e avançado",
              "Escolha de categorias de frases para praticar",
              "Dictation, fill-in-the-blank e exercícios exclusivos",
              "Relatório semanal com sua evolução detalhada",
              "Suporte prioritário para tirar suas dúvidas",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                  ✦
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* Preço */}
          <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-blue-500">Plano Pro</p>
              <p className="text-blue-900 font-semibold text-xl">
                R$ 4,99 <span className="text-sm font-normal text-blue-400"></span>
              </p>
            </div>
            <span className="text-xs font-medium bg-blue-700 text-blue-100 px-3 py-1 rounded-full">
             Acesso vitalício
            </span>
          </div>

          <Link
            href="/planos"
            onClick={() => setVisible(false)}
            className="block w-full text-center bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl text-sm font-medium transition"
          >
            Quero evoluir no inglês →
          </Link>

          <hr className="my-2 border-gray-100" />


          <button
            onClick={() => setVisible(false)}
            className="w-full mt-1 text-bold text-xs text-gray-800 hover:text-gray-600 transition py-1"
          >
            Agora não, continuar no plano Free
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(28px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.08) } }
      `}</style>
    </div>
  );
}