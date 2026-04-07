import { AuthBackground } from "@/app/_components/auth/auth-background"
import { RegisterForm } from "@/app/_components/auth/register-form"

export default function RegisterPage() {
    return (
        <main id="main-content" tabIndex={-1} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0f4ff] px-4">
            <AuthBackground />
            <RegisterForm />
        </main>
    )
}
