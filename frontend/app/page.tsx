import { redirect } from "next/navigation"
import { HeroSection } from "@/app/_components/home/hero-section"
import { DemoCard } from "@/app/_components/home/demo-card"
import { CtaButtons } from "@/app/_components/home/cta-buttons"
import { TermsFooter } from "@/app/_components/home/terms-dialog"
import { getCurrentUser } from "@/app/_lib/server-api"


export default async function FluencyLabHome() {
    // Já logado? A landing é para visitantes — manda pra home (igual ao /login).
    const user = await getCurrentUser()
    if (user) redirect("/home")

    return (
        <main id="main-content" tabIndex={-1} className="flex min-h-screen w-full flex-col bg-blue-100">
            <HeroSection />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-6 sm:px-8 sm:pb-10 md:px-0">
                <DemoCard />

                <div className="my-4 h-px shrink-0 bg-linear-to-r from-transparent via-blue-200 to-transparent sm:my-5" />

                <CtaButtons />

                <TermsFooter />
            </div>
        </main>
    )
}
