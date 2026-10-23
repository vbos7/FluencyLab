"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

// Recursos que o Pro realmente libera (mesmos de plan_features no banco).
const RECURSOS_PRO = [
    "Todas as videoaulas: básico, intermediário e avançado",
    "Escolha da categoria das frases para praticar",
    "Relatório semanal com sua evolução detalhada",
]

// Data (AAAA-MM-DD) da última vez que o modal apareceu: no máximo uma vez por dia.
const ULTIMA_EXIBICAO_KEY = "fluency-lab:pro-modal-at"

// Quem renderiza decide se o aluno é Free (a Home já sabe isso no servidor).
export default function ProModal() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const hoje = new Date().toISOString().slice(0, 10)
        try {
            if (localStorage.getItem(ULTIMA_EXIBICAO_KEY) === hoje) return
        } catch {
            // localStorage indisponível (modo privado): segue e mostra
        }

        const timer = setTimeout(() => {
            setVisible(true)
            try {
                localStorage.setItem(ULTIMA_EXIBICAO_KEY, hoje)
            } catch {
                // sem localStorage o modal pode reaparecer; não é um problema
            }
        }, 10000)

        return () => clearTimeout(timer)
    }, [])

    if (!visible) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/55 px-4"
            style={{ animation: "fadeIn 0.3s ease" }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="pro-modal-title"
                className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
                style={{ animation: "slideUp 0.45s cubic-bezier(.16,1,.3,1)" }}
            >
                {/* Header */}
                <div className="bg-blue-700 px-6 py-7 text-center">
                    <h2 id="pro-modal-title" className="text-xl font-semibold text-blue-100">
                        Libere todos os recursos
                    </h2>
                    <p className="mt-1 text-sm text-blue-300">
                        Plano Pro com pagamento único e acesso vitalício
                    </p>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <ul className="mb-5 flex flex-col gap-3">
                        {RECURSOS_PRO.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-gray-800">
                                <span
                                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] text-blue-600"
                                    aria-hidden="true"
                                >
                                    ✦
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <Link
                        href="/planos"
                        onClick={() => setVisible(false)}
                        className="block w-full rounded-xl bg-blue-700 py-3 text-center text-sm font-medium text-white transition hover:bg-blue-800"
                    >
                        Ver o plano Pro →
                    </Link>

                    <hr className="my-2 border-gray-100" />

                    <button
                        onClick={() => setVisible(false)}
                        className="mt-1 w-full py-1 text-xs font-bold text-gray-800 transition hover:text-gray-600"
                    >
                        Agora não, continuar no plano Free
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(28px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
        </div>
    )
}
