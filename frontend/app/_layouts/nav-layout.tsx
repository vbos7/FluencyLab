import { TopNav } from "@/app/_components/top-nav"
import { BottomNav } from "@/app/_components/bottom-nav"
import { MaintenanceScreen } from "@/app/_components/maintenance-screen"
import { getCurrentUser, fetchFromApi } from "@/app/_lib/server-api"

type Status = { maintenance: boolean; app_name: string }

export default async function NavLayout({ children }: { children: React.ReactNode }) {
    const [user, status] = await Promise.all([
        getCurrentUser(), // null se não estiver logado
        fetchFromApi<Status>("/status.php"),
    ])

    // maintenance_mode (Acesso, no painel): bloqueia todos menos admin. Login e o
    // painel /admin ficam fora do NavLayout, então o admin sempre consegue entrar.
    if (status.maintenance && user?.role !== "admin") {
        return <MaintenanceScreen appName={status.app_name} />
    }

    return (
        <>
            <TopNav user={user} />
            <main id="main-content" tabIndex={-1}>
                {children}
            </main>
            <BottomNav user={user} />
        </>
    )
}
