import NavLayout from "@/app/_layouts/nav-layout"
import PlanosContent from "@/app/_components/planos-content"
import { type Plan } from "@/app/_lib/plans"
import { fetchFromApi, getCurrentUser } from "@/app/_lib/server-api"

// Server Component: o NavLayout é assíncrono (busca o usuário da sessão) e não
// pode ficar dentro de um Client Component. Por isso a interatividade (useState
// do checkout) vive em PlanosContent ("use client") e a página só compõe os dois.

export default async function PlanosPage({
    searchParams,
}: {
    searchParams: Promise<{ checkout?: string }>
}) {
    // /plans.php é público e já traz as features de cada plano (plan_features).
    const [plans, user, planStatus, { checkout }] = await Promise.all([
        fetchFromApi<Plan[]>("/plans.php"),
        getCurrentUser(),
        fetchFromApi<{ active: boolean }>("/my-plan.php").catch(() => ({ active: false })),
        searchParams,
    ])

    const freePlan = plans.find((p) => Number(p.price) <= 0) ?? null
    const proPlan = plans.find((p) => Number(p.price) > 0) ?? null

    return (
        <NavLayout>
            <PlanosContent
                freePlan={freePlan}
                proPlan={proPlan}
                isLoggedIn={user !== null}
                isPro={planStatus.active}
                checkoutCanceled={checkout === "cancel"}
            />
        </NavLayout>
    )
}
