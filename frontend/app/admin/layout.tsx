// Wrapper de estilo comum a TODO o /admin (inclui a tela de login do painel).
// A proteção de acesso fica no layout do grupo (panel), para que /admin/login
// continue acessível sem sessão.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <div className="bg-background flex min-h-dvh flex-col">{children}</div>
}
