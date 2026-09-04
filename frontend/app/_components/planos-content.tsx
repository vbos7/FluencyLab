"use client"

import { useState } from "react"
import CheckoutModal from "@/app/_components/checkout-modal"
import { type Feature, type ProPlan } from "@/app/_lib/plans"

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
]

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
]

function FeatureItem({ f }: { f: Feature }) {
    return (
        <li className="flex items-start gap-2 text-sm">
            <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                    f.included
                        ? f.highlight
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-400"
                }`}
            >
                {f.included ? (f.highlight ? "★" : "✓") : "–"}
            </span>
            <span className={f.included ? "text-gray-800" : "text-gray-400"}>{f.label}</span>
        </li>
    )
}

export default function PlanosContent({ proPlan }: { proPlan: ProPlan }) {
    const [showCheckout, setShowCheckout] = useState(false)

    return (
        <div className="relative grid min-h-screen place-items-center overflow-hidden p-7">
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                }}
            />

            <main className="relative z-10 w-full max-w-3xl rounded-2xl border border-[#dce8ff] bg-white p-4 shadow-[0_2px_16px_rgba(37,99,235,0.08)] sm:p-6">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-semibold text-gray-900">Escolha seu plano</h1>
                    <p className="mt-2 text-gray-500">Comece grátis. Evolua quando quiser.</p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Card Free */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-6">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Free</span>
                        </div>
                        <div>
                            <span className="text-4xl font-semibold text-gray-900">R$ 0</span>
                            <span className="ml-1 text-sm text-gray-400">/ sempre</span>
                        </div>
                        <p className="border-b border-gray-100 pb-4 text-sm text-gray-500">
                            Para quem quer começar sem compromisso.
                        </p>
                        <ul className="flex flex-1 flex-col gap-2">
                            {featuresF.map((f) => (
                                <FeatureItem key={f.label} f={f} />
                            ))}
                        </ul>
                        <button className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                            Plano atual
                        </button>
                    </div>

                    {/* Card Pro */}
                    <div className="flex flex-col gap-4 rounded-2xl border-2 border-blue-500 p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Pro</span>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                ✦ Premium
                            </span>
                        </div>
                        <div>
                            <span className="text-4xl font-semibold text-gray-900">R$ 4,99</span>
                            <span className="ml-1 text-sm text-gray-400">/ Vitalício</span>
                        </div>
                        <p className="border-b border-gray-100 pb-4 text-sm text-gray-500">
                            Evolua o jeito de praticar com recursos exclusivos.
                        </p>
                        <ul className="flex flex-1 flex-col gap-2">
                            {featuresPro.map((f) => (
                                <FeatureItem key={f.label} f={f} />
                            ))}
                        </ul>
                        <button
                            onClick={() => setShowCheckout(true)}
                            disabled={!proPlan}
                            className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Assinar Pro
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                    Pagamento via Pix ou cartão. Cancele quando quiser.
                </p>
            </main>

            {/* Modal */}
            {showCheckout && proPlan && (
                <CheckoutModal
                    planId={proPlan.id}
                    planName={proPlan.name}
                    price={Number(proPlan.price)}
                    billingPeriod={proPlan.billing_period}
                    onClose={() => setShowCheckout(false)}
                />
            )}
        </div>
    )
}
