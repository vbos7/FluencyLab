import NavLayout from "@/app/_layouts/nav-layout";
import PlanosContent, { type ProPlan } from "@/app/_components/planos-content";
import { fetchFromApi } from "@/app/_lib/server-api";

// Server Component: o NavLayout é assíncrono (busca o usuário da sessão) e não
// pode ficar dentro de um Client Component. Por isso a interatividade (useState
// do checkout) vive em PlanosContent ("use client") e a página só compõe os dois.
type Plan = {
  id: number;
  name: string;
  price: string;
  billing_period: "monthly" | "lifetime";
};

export default async function PlanosPage() {
  // /plans.php é público; o Pro é o de preço > 0. Passamos ele ao checkout.
  const plans = await fetchFromApi<Plan[]>("/plans.php");
  const proPlan: ProPlan = plans.find((p) => Number(p.price) > 0) ?? null;

  return (
    <NavLayout>
      <PlanosContent proPlan={proPlan} />
    </NavLayout>
  );
}
