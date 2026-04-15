import PricingCard from "@/app/_components/pricing/PricingCard";
import { HeroSection } from "@/app/_components/home/hero-section"
import { DemoCard } from "@/app/_components/home/demo-card"
import { CtaButtons } from "@/app/_components/home/cta-buttons"
import { TermsFooter } from "@/app/_components/home/terms-dialog"
import NavLayout from "../_layouts/nav-layout";

export const metadata = {
  title: "FluencyLab",
};

const features = {
  free: [
    { label: "Traduções ilimitadas por dia", included: true },
    { label: "Explicação de erros com IA", included: true },
    { label: "XP, níveis e streaks", included: true },
    { label: "Ranking geral", included: true },
    { label: "Até 10 frases favoritas", included: true },
    { label: "Escolha de categorias de frases", included: false },
    { label: "Videoaulas de inglês", included: false },
    { label: "Modos avançados de prática", included: false },
    { label: "Relatório completo de evolução", included: false },
  ],
  pro: [
    { label: "Tudo do plano Free", included: true },
    { label: "Favoritos ilimitados", included: true, highlight: true },
    { label: "Escolha de categorias de frases", included: true, highlight: true },
    { label: "Videoaulas básico, intermediário e avançado", included: true, highlight: true },
    { label: "Modo Dictation — ouça e escreva", included: true, highlight: true },
    { label: "Modo Fill-in-the-blank", included: true, highlight: true },
    { label: "Modo Reordenar palavras", included: true, highlight: true },
    { label: "Relatório semanal completo", included: true, highlight: true },
    { label: "Suporte prioritário", included: true, highlight: true },
  ],
};

export default function PlanosPage() {
  return (
    <NavLayout>
    <div className="min-h-screen  grid place-items-center p-7 relative overflow-hidden">

         <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                }}
            />

    <main className="max-w-3xl w-full rounded-2xl border border-[#dce8ff] bg-white p-4 shadow-[0_2px_16px_rgba(37,99,235,0.08)] sm:p-6">
      <div className="text-center mb-10 ">
        <h1 className="text-3xl font-semibold text-gray-900">
          Escolha seu plano
        </h1>
        <p className="text-gray-500 mt-2">
          Comece grátis. Evolua quando quiser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PricingCard
          plan="Free"
          price="R$ 0"
          period="sempre"
          description="Para quem quer começar sem compromisso."
          features={features.free}
          ctaLabel="Plano atual"
          ctaVariant="outline"
        />
        <PricingCard
          plan="Pro"
          price="R$ 4,99"
          period="Vitalício"
          description="Evolua o jeito de pratica com recursos exclusivos."
          features={features.pro}
          ctaLabel="Assinar Pro"
          ctaVariant="primary"
          highlighted
        />
      </div>

     
      

      <p className="text-center text-xs text-gray-400 mt-8">
        Pagamento via Pix ou cartão. Cancele quando quiser.
      </p>
    </main>
    </div>
    </NavLayout>
  );
}