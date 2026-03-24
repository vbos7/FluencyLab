// Layout exclusivo para o painel admin — sem TopNav nem BottomNav
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh bg-background flex flex-col">
            {children}
        </div>
    )
}
