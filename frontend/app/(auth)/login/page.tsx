import { AuthBackground } from "@/app/_components/auth/auth-background"
import { LoginForm } from "@/app/_components/auth/login-form"

export default function LoginPage() {
    return (
        <main id="main-content" tabIndex={-1} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f0f4ff] px-4">
            <AuthBackground />
            <LoginForm />
        </main>
    )
}
