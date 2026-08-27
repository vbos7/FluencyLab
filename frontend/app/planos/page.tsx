import NavLayout from "@/app/_layouts/nav-layout"
import { PlanCards, type Plan } from "@/app/_components/plan-cards"
import { fetchFromApi } from "@/app/_lib/server-api"

export default async function PlanosPage() {
    const plans = await fetchFromApi<Plan[]>("/plans.php")

    return (
        <NavLayout>
            <div className="relative grid min-h-screen place-items-center overflow-hidden p-7">
                <main className="relative z-10 w-full max-w-3xl rounded-2xl border border-[#dce8ff] bg-white p-4 shadow-[0_2px_16px_rgba(37,99,235,0.08)] sm:p-6">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-semibold text-gray-900">Escolha seu plano</h1>
                        <p className="mt-2 text-gray-500">Comece grátis. Evolua quando quiser.</p>
                    </div>

                    <PlanCards plans={plans} />

                    <p className="mt-8 text-center text-xs text-gray-400">
                        Pagamento via Pix ou cartão. Cancele quando quiser.
                    </p>
                </main>
            </div>
        </NavLayout>
    )
}
