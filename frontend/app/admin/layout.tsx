// Layout exclusivo para o painel admin — sem TopNav nem BottomNav
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <div className="bg-background flex min-h-dvh flex-col">{children}</div>
}
