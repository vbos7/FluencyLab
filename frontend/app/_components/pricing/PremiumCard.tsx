"use client"

import { useEffect, useState } from "react"
import { BowArrow, Video, SquareKanban, BookOpenCheck } from "lucide-react"
import { ElementType } from "react"
import { Icon } from "../admin/icon"

export default function PremiumCard() {
    return (
        <div className="rounded-2xl border border-[#dce8ff] bg-white p-4 shadow-[0_2px_16px_rgba(37,99,235,0.08)] sm:p-6">
            {/* Header */}
            <div className="mb-10 text-center lg:mb-12">
                <h3 className="mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                    Plano Premium
                </h3>
                <p className="mx-auto max-w-2xl text-xl text-gray-600">
                    Acelere seu inglês 3x mais rápido com acesso vitalício
                </p>
            </div>

            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                {/* Coluna 1 - Benefícios em cards horizontais */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[
                            {
                                icon: BowArrow,
                                title: "Modos exclusivos",
                                desc: "Dictation, fill-in e mais",
                            },
                            { icon: Video, title: "Vídeos", desc: "Aulas do básico ao avançado" },
                            {
                                icon: SquareKanban,
                                title: "Relatórios",
                                desc: "Evolução semanal detalhada",
                            },
                            {
                                icon: BookOpenCheck,
                                title: "Suas categorias",
                                desc: "Escolha o tema das frases",
                            },
                        ].map((item, i) => {
                            const IconComponent = item.icon
                            return (
                                <div
                                    key={i}
                                    className="group transform rounded-2xl border border-white/50 bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:bg-white hover:shadow-xl"
                                >
                                    <div className="mb-3 flex items-start gap-4">
                                        <div className="flex-shrink-0 text-2xl">
                                            <IconComponent size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-700">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center justify-center gap-4 border-t border-blue-100 pt-6 text-sm text-gray-500">
                        <div className="flex -space-x-3">
                            {["LM", "CJ", "PH", "RS", "MG"].map((init, i) => (
                                <div
                                    key={i}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border-3 border-white bg-gradient-to-r from-blue-100 to-indigo-100 font-bold text-blue-700 shadow-lg"
                                >
                                    {init}
                                </div>
                            ))}
                        </div>
                        <span className="font-semibold text-gray-700">+1.847 alunos evoluíram</span>
                    </div>
                </div>

                {/* Coluna 2 - Preço e CTA */}
                <div className="relative overflow-hidden text-center lg:text-left">
                    <div className="pointer-events-none absolute -top-14 -right-14 h-52 w-52 rounded-full bg-white/6" />
                    <div className="pointer-events-none absolute right-16 -bottom-16 h-40 w-40 rounded-full bg-white/5" />
                    <div className="pointer-events-none absolute bottom-28 -left-28 h-40 w-40 rounded-full bg-white/5" />

                    <div className="mb-8 rounded-2xl bg-linear-to-br from-blue-700 to-blue-600 p-7 p-10 text-white shadow-xl shadow-blue-900/40">
                        <div className="mb-4 flex items-baseline justify-center lg:justify-start">
                            <span className="text-lg font-medium tracking-wide text-blue-200 uppercase">
                                Único pagamento
                            </span>
                        </div>
                        <div className="flex items-baseline justify-center gap-2 lg:justify-start">
                            <span className="text-5xl font-black lg:text-6xl">R$</span>
                            <span className="text-6xl font-black lg:text-7xl">4,99</span>
                        </div>
                        <div className="mx-auto mt-4 w-fit rounded-2xl bg-white/30 px-6 py-3 text-xl font-bold backdrop-blur-sm lg:mx-0">
                            ACESSO VITALÍCIO
                        </div>
                    </div>

                    <a
                        href="/planos"
                        className="mb-6 block flex w-full transform items-center justify-center gap-3 rounded-3xl bg-linear-to-br from-blue-700 to-blue-600 px-8 py-5 text-lg text-xl font-bold text-white shadow-2xl shadow-blue-900/40 transition-all duration-300 hover:-translate-y-2"
                    >
                        <span>Quero o Premium Agora </span>
                    </a>

                    <p className="text-center text-sm text-gray-500 lg:text-left">
                        Cancelamento quando quiser • Pagamento seguro • Garantia total
                    </p>
                </div>
            </div>
        </div>
    )
}
