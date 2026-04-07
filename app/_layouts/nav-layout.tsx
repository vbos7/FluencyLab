import { TopNav } from "@/app/_components/top-nav"
import { BottomNav } from "@/app/_components/bottom-nav"

export default function NavLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TopNav />
            <main id="main-content" tabIndex={-1}>
                {children}
            </main>
            <BottomNav />
        </>
    )
}
