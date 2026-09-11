import { Lock } from "lucide-react"

type Props = {
    title: string
    description: string
}

// Card de bloqueio exibido no lugar de recursos exclusivos do plano Pro
// (usado no perfil e na tela de progresso).
export function ProLockCard({ title, description }: Props) {
    return (
        <div className="rounded-2xl border border-[#dce8ff] bg-white p-6 shadow-[0_2px_16px_rgba(37,99,235,0.08)]">
            <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                    <Lock size={20} className="text-amber-500" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <p className="mt-1 max-w-xs text-sm text-gray-500">{description}</p>
                </div>
                <a
                    href="/planos"
                    className="mt-1 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    Assinar plano Pro
                </a>
            </div>
        </div>
    )
}
