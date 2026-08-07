"use client";

import { useState } from "react";
import CheckoutModal from "@/app/_components/checkout-modal";
import NavLayout from "@/app/_layouts/nav-layout"

const featuresF = [
  { label: "Traduções ilimitadas por dia", included: true },
  { label: "Explicação de erros com IA", included: true },
  { label: "XP, níveis e streaks", included: true },
  { label: "Ranking geral", included: true },
  { label: "Até 10 frases favoritas", included: true },
  { label: "Escolha de categorias de frases", included: false },
  { label: "Videoaulas de inglês", included: false },
  { label: "Modos avançados de prática", included: false },
  { label: "Relatório completo de evolução", included: false },
];

const featuresPro = [
  { label: "Tudo do plano Free", included: true },
  { label: "Favoritos ilimitados", included: true, highlight: true },
  { label: "Escolha de categorias de frases", included: true, highlight: true },
  { label: "Videoaulas básico, intermediário e avançado", included: true, highlight: true },
  { label: "Modo Dictation — ouça e escreva", included: true, highlight: true },
  { label: "Modo Fill-in-the-blank", included: true, highlight: true },
  { label: "Modo Reordenar palavras", included: true, highlight: true },
  { label: "Relatório semanal completo", included: true, highlight: true },
  { label: "Suporte prioritário", included: true, highlight: true },
];

type Feature = { label: string; included: boolean; highlight?: boolean };

function FeatureItem({ f }: { f: Feature }) {
  return (
    
    <li className="flex items-start gap-2 text-sm">
      <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
        f.included
          ? f.highlight
            ? "bg-blue-100 text-blue-600"
            : "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-400"
      }`}>
        {f.included ? (f.highlight ? "★" : "✓") : "–"}
      </span>
      <span className={f.included ? "text-gray-800" : "text-gray-400"}>
        {f.label}
      </span>
    </li>
  );
}

export default function PlanosPage() {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <NavLayout>
    <div className="min-h-screen grid place-items-center p-7 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <main className="max-w-3xl w-full rounded-2xl border border-[#dce8ff] bg-white p-4 shadow-[0_2px_16px_rgba(37,99,235,0.08)] sm:p-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Escolha seu plano
          </h1>
          <p className="text-gray-500 mt-2">
            Comece grátis. Evolua quando quiser.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card Free */}
          <div className="rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Free</span>
            </div>
            <div>
              <span className="text-4xl font-semibold text-gray-900">R$ 0</span>
              <span className="text-gray-400 text-sm ml-1">/ sempre</span>
            </div>
            <p className="text-sm text-gray-500 border-b border-gray-100 pb-4">
              Para quem quer começar sem compromisso.
            </p>
            <ul className="flex flex-col gap-2 flex-1">
              {featuresF.map((f) => <FeatureItem key={f.label} f={f} />)}
            </ul>
            <button className="mt-2 w-full py-2.5 px-4 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
              Plano atual
            </button>
          </div>

          {/* Card Pro */}
          <div className="rounded-2xl border-2 border-blue-500 p-6 flex flex-col gap-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Pro</span>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                ✦ Premium
              </span>
            </div>
            <div>
              <span className="text-4xl font-semibold text-gray-900">R$ 4,99</span>
              <span className="text-gray-400 text-sm ml-1">/ Vitalício</span>
            </div>
            <p className="text-sm text-gray-500 border-b border-gray-100 pb-4">
              Evolua o jeito de praticar com recursos exclusivos.
            </p>
            <ul className="flex flex-col gap-2 flex-1">
              {featuresPro.map((f) => <FeatureItem key={f.label} f={f} />)}
            </ul>
            <button
              onClick={() => setShowCheckout(true)}
              className="mt-2 w-full py-2.5 px-4 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Assinar Pro
            </button>
          </div>

        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Pagamento via Pix ou cartão. Cancele quando quiser.
        </p>
      </main>

      {/* Modal */}
      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} />
      )}
    </div>
    </NavLayout>
  );
}