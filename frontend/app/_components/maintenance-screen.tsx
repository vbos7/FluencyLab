import { Wrench } from "lucide-react"

// Tela de manutenção mostrada quando maintenance_mode está ligado (Acesso, no
// painel) para quem não é admin. Renderizada pelo NavLayout no lugar do conteúdo.
export function MaintenanceScreen({ appName = "FluencyLab" }: { appName?: string }) {
    return (
        <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#f0f4ff] px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Wrench className="size-8" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {appName} em manutenção
            </h1>
            <p className="max-w-sm text-sm text-slate-500">
                Estamos fazendo alguns ajustes para melhorar sua experiência. Volte em
                instantes — já já estará tudo no ar de novo.
            </p>
        </main>
    )
}
