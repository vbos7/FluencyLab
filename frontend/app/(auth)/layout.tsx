// Layout exclusivo para páginas de autenticação — sem TopNav nem BottomNav
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <div className="flex min-h-dvh flex-col bg-white">{children}</div>
}
