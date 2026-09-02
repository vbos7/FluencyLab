import { TopNav } from "@/app/_components/top-nav"
import { BottomNav } from "@/app/_components/bottom-nav"
import { getCurrentUser } from "@/app/_lib/server-api"

export default async function NavLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser() // null se não estiver logado

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