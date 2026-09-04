"use client"

import { useState } from "react"
import { X, CheckCircle } from "lucide-react"
import { apiClient } from "@/app/_lib/api"

type Props = {
    planId: number
    planName: string
    price: number
    billingPeriod: "monthly" | "lifetime"
    onClose: () => void
}

export default function CheckoutModal({ planId, planName, price, billingPeriod, onClose }: Props) {
    const [method, setMethod] = useState<"card" | "pix">("card")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit() {
        setLoading(true)
        setError("")
        try {
            await apiClient.post("/plans-subscribe.php", { plan_id: planId })
            setSuccess(true)
        } catch {
            setError("Não foi possível assinar o plano. Entre novamente e tente outra vez.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/50 px-4"
            style={{ animation: "fadeIn 0.25s ease" }}
        >
            {/* Botão X sempre visível */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
            >
                <X size={14} />
            </button>
            <div
                className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
                style={{ animation: "slideUp 0.4s cubic-bezier(.16,1,.3,1)" }}
            >
                {/* ===== TELA DE SUCESSO ===== */}
                {success ? (
                    <div
                        className="flex flex-col items-center justify-center px-8 py-12 text-center"
                        style={{ animation: "popIn 0.45s cubic-bezier(.16,1,.3,1)" }}
                    >
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                            <CheckCircle size={40} className="text-blue-600" />
                        </div>

                        <h2 className="mb-3 text-xl font-semibold text-gray-900">
                            Bem-vindo ao Pro!
                        </h2>
                        <p className="max-w-xs text-sm leading-relaxed text-gray-500">
                            Seu pagamento foi confirmado. Agora você tem acesso completo a tudo que
                            o FluencyLab tem de melhor — é só aproveitar!
                        </p>

                        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-5 py-3 text-sm font-medium text-blue-700">
                            ✦ Plano {planName} ativado com sucesso
                        </div>

                        <button
                            onClick={() => (window.location.href = "./practice")}
                            className="mt-6 w-full rounded-xl bg-blue-700 py-3 text-sm font-medium text-white transition hover:bg-blue-800"
                        >
                            Começar a aprender →
                        </button>
                    </div>
                ) : (
                    /* ===== TELA DO FORMULÁRIO ===== */
                    <div className="px-6 py-6">
                        {/* Badge do plano */}
                        <div className="mb-5 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                            <div>
                                <p className="mb-0.5 text-xs text-blue-400">Plano {planName}</p>
                                <p className="text-lg font-semibold text-blue-900">
                                    {price.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}{" "}
                                    <span className="text-sm font-normal text-blue-400">
                                        /{billingPeriod === "lifetime" ? "vitalício" : "mês"}
                                    </span>
                                </p>
                            </div>
                            <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-medium text-blue-100">
                                ✦ Premium
                            </span>
                        </div>

                        {/* Dados pessoais */}

                        <div className="mb-1 flex flex-col gap-3"></div>

                        <hr className="my-4 border-gray-100" />

                        {/* Método de pagamento */}
                        <p className="mb-3 text-xs font-medium text-gray-500">Forma de pagamento</p>
                        <div className="mb-4 grid grid-cols-2 gap-2">
                            {(["card", "pix"] as const).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMethod(m)}
                                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition ${
                                        method === m
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                                    }`}
                                >
                                    {m === "card" ? "💳 Cartão" : "⚡ Pix"}
                                </button>
                            ))}
                        </div>

                        {/* Campos cartão */}
                        {method === "card" && (
                            <div className="mb-4 flex flex-col gap-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">
                                        Número do cartão
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        maxLength={19}
                                        className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-500">
                                            Validade
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="MM/AA"
                                            maxLength={5}
                                            className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-500">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            maxLength={3}
                                            className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-500">
                                        Nome no cartão
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Como está no cartão"
                                        className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Pix */}
                        {method === "pix" && (
                            <div className="mb-4 py-4 text-center">
                                <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-400">
                                    QR Code
                                </div>
                                <p className="text-sm text-gray-500">
                                    Após confirmar, você receberá o QR Code do Pix no seu e-mail.
                                </p>
                            </div>
                        )}

                        {/* Botão confirmar */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full rounded-xl bg-blue-700 py-3 text-sm font-medium text-white transition hover:bg-blue-800 disabled:bg-blue-300"
                        >
                            {loading ? "Processando..." : "Confirmar assinatura →"}
                        </button>

                        {error && (
                            <p role="alert" className="mt-3 text-center text-xs text-red-600">
                                {error}
                            </p>
                        )}

                        <p className="mt-3 flex items-center justify-center gap-1 text-center text-xs text-gray-400">
                            🔒 Pagamento 100% seguro
                        </p>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes popIn { from { opacity:0; transform:scale(0.9) } to { opacity:1; transform:scale(1) } }
      `}</style>
        </div>
    )
}
