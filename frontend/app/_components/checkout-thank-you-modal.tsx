"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { apiClient } from "@/app/_lib/api"
import { type ConfirmedCheckout } from "@/app/_lib/plans"

// Renderizado na home. Ao voltar do checkout da Stripe com sucesso, a URL vem
// como /home?checkout=success&session_id=cs_..., o componente confirma o
// pagamento no backend e mostra o modal de agradecimento.
export function CheckoutThankYouModal() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [planName, setPlanName] = useState<string | null>(null)

    useEffect(() => {
        const checkout = searchParams.get("checkout")
        const sessionId = searchParams.get("session_id")
        if (checkout !== "success" || !sessionId) return

        // Limpa a query string já de cara: um F5 não deve reabrir o modal nem
        // tentar confirmar a mesma sessão de novo.
        router.replace("/home")

        apiClient
            .get<ConfirmedCheckout>("/stripe/confirm-session.php", {
                params: { session_id: sessionId },
            })
            .then((res) => {
                if (res.data.success) {
                    setPlanName(res.data.plan ?? "Pro")
                }
            })
            .catch(() => {
                // Pagamento pode ainda estar propagando — o webhook confirma depois.
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!planName) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/55 px-4"
            style={{ animation: "fadeIn 0.3s ease" }}
        >
            <div
                className="mx-auto w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl"
                style={{ animation: "popIn 0.4s cubic-bezier(.16,1,.3,1)" }}
            >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">Pagamento confirmado!</h2>
                <p className="mb-6 text-sm leading-relaxed text-gray-500">
                    Seu plano {planName} já está ativo. Aproveite tudo que o FluencyLab tem de
                    melhor!
                </p>
                <button
                    onClick={() => setPlanName(null)}
                    className="w-full rounded-xl bg-blue-700 py-3 text-sm font-medium text-white transition hover:bg-blue-800"
                >
                    Continuar
                </button>
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes popIn { from { opacity:0; transform:scale(0.9) } to { opacity:1; transform:scale(1) } }
      `}</style>
        </div>
    )
}
