import { redirect } from "next/navigation"
import { AuthBackground } from "@/app/_components/auth/auth-background"
import { RegisterForm } from "@/app/_components/auth/register-form"
import { getCurrentUser } from "@/app/_lib/server-api"

export default async function RegisterPage() {
    // Já logado? Manda pra home em vez de mostrar o cadastro.
    const user = await getCurrentUser()
    if (user) redirect("/home")

    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0f4ff] px-4"
        >
            <AuthBackground />
            <RegisterForm />
        </main>
    )
}
