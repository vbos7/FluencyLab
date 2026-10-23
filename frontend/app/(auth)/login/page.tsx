import { redirect } from "next/navigation"
import { AuthBackground } from "@/app/_components/auth/auth-background"
import { LoginForm } from "@/app/_components/auth/login-form"
import { getCurrentUser } from "@/app/_lib/server-api"

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ next?: string }>
}) {
    // Já logado? Não faz sentido ver a tela de login — manda pra home.
    const user = await getCurrentUser()
    if (user) redirect("/home")
    const { next } = await searchParams

    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0f4ff] px-4"
        >
            <AuthBackground />
            <LoginForm next={next} />
        </main>
    )
}
