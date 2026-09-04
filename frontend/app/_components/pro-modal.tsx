"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiClient } from "@/app/_lib/api"

export default function ProModal() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>

        // Só agenda o modal se o usuário NÃO tiver um plano Pro ativo —
        // assinantes não devem ver o upsell "Você está perdendo muito!".
        apiClient
            .get("/my-plan.php")
            .then((res) => {
                if (!res.data?.active) {
                    timer = setTimeout(() => setVisible(true), 10000)
                }
            })
            .catch(() => {
                // Falha ao checar (backend fora, etc.): mantém o comportamento padrão
                timer = setTimeout(() => setVisible(true), 10000)
            })

        return () => clearTimeout(timer)
    }, [])

    if (!visible) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/55 px-4"
            style={{ animation: "fadeIn 0.3s ease" }}
        >
            <div
                className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl" // ← MUDANÇAS AQUI
                style={{ animation: "slideUp 0.45s cubic-bezier(.16,1,.3,1)" }}
            >
                {/* Header */}
                <div className="bg-blue-700 px-6 py-7 text-center">
                    <h2 className="text-xl font-semibold text-blue-100">
                        Você está perdendo muito!
                    </h2>
                    <p className="mt-1 text-sm text-blue-300">
                        Usuários Pro evoluem 3x mais rápido no inglês
                    </p>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <ul className="mb-5 flex flex-col gap-3">
                        {[
                            "Video aulas básico, intermediário e avançado",
                            "Escolha de categorias de frases para praticar",
                            "Dictation, fill-in-the-blank e exercícios exclusivos",
                            "Relatório semanal com sua evolução detalhada",
                            "Suporte prioritário para tirar suas dúvidas",
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] text-blue-600">
                                    ✦
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>

                    {/* Preço */}
                    <div className="mb-4 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
                        <div>
                            <p className="text-xs text-blue-500">Plano Pro</p>
                            <p className="text-xl font-semibold text-blue-900">
                                R$ 4,99 <span className="text-sm font-normal text-blue-400"></span>
                            </p>
                        </div>
                        <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-medium text-blue-100">
                            Acesso vitalício
                        </span>
                    </div>

                    <Link
                        href="/planos"
                        onClick={() => setVisible(false)}
                        className="block w-full rounded-xl bg-blue-700 py-3 text-center text-sm font-medium text-white transition hover:bg-blue-800"
                    >
                        Quero evoluir no inglês →
                    </Link>

                    <hr className="my-2 border-gray-100" />

                    <button
                        onClick={() => setVisible(false)}
                        className="text-bold mt-1 w-full py-1 text-xs text-gray-800 transition hover:text-gray-600"
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
    )
}
