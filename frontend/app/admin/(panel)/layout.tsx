import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/_lib/server-api"

// Guarda do painel: roda em todas as rotas internas de /admin.
//  - sem sessão  → login próprio do painel (passkey), como pedido
//  - logado, mas não-admin → volta pra home do aluno
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser()

    if (!user) redirect("/admin/login")
    if (user.role !== "admin") redirect("/home")

    return <>{children}</>
}
