import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/_lib/server-api"
import { AuthBackground } from "@/app/_components/auth/auth-background"
import { LoginForm } from "@/app/_components/auth/login-form"

// Login do painel (fora do grupo (panel), então não passa pela guarda). Idêntico
// ao login público, com a opção de passkey acima do e-mail. Se já há sessão,
// manda pro destino certo em vez de mostrar o login de novo.
export default async function AdminLoginPage() {
    const user = await getCurrentUser()
    if (user?.role === "admin") redirect("/admin/dashboard")
    if (user) redirect("/home")

    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0f4ff] px-4"
        >
            <AuthBackground />
            <LoginForm showPasskey />
        </main>
    )
}
