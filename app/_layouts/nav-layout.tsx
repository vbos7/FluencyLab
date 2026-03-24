import {TopNav} from "@/app/_components/top-nav";
import {BottomNav} from "@/app/_components/bottom-nav";


export default function NavLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TopNav />
            {children}
            <BottomNav />
        </>
    )
}
