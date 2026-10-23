import Link from "next/link"
import { Video, SquareKanban, BookOpenCheck } from "lucide-react"

// Benefícios reais do plano Pro (os mesmos de plan_features no banco).
const BENEFICIOS = [
    { icon: Video, title: "Todas as videoaulas", desc: "Do básico ao avançado" },
    { icon: BookOpenCheck, title: "Suas categorias", desc: "Escolha o tema das frases" },
    { icon: SquareKanban, title: "Relatórios", desc: "Evolução semanal detalhada" },
]

// Card de upsell do perfil (só aparece para quem é Free). O preço fica na
// página /planos, que lê o valor do banco.
export default function PremiumCard() {
    return (
        <div className="rounded-2xl border border-[#dce8ff] bg-white p-4 shadow-[0_2px_16px_rgba(37,99,235,0.08)] sm:p-6">
            {/* Header */}
            <div className="mb-8 text-center">
                <h3 className="mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                    Plano Pro
                </h3>
                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                    Pagamento único, acesso vitalício a todos os recursos.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {BENEFICIOS.map((item) => (
                    <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-2xl border border-blue-50 bg-white/70 p-5"
                    >
                        <item.icon size={24} className="shrink-0 text-blue-700" aria-hidden="true" />
                        <div>
                            <h4 className="text-base font-bold text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Link
                href="/planos"
                className="mt-8 flex w-full items-center justify-center rounded-2xl bg-linear-to-br from-blue-700 to-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-900/30 transition-transform duration-300 hover:-translate-y-1"
            >
                Ver o plano Pro
            </Link>

            <p className="mt-4 text-center text-sm text-gray-500">
                Pagamento seguro pela Stripe • Sem renovação automática
            </p>
        </div>
    )
}
