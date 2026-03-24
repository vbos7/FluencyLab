// Layout exclusivo para páginas de autenticação — sem TopNav nem BottomNav
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh bg-white flex flex-col">
            {children}
        </div>
    )
}
