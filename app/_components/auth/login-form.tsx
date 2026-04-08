"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthLogo } from "./auth-logo"
import { EmailIcon, LockIcon, EyeIcon, EyeOffIcon } from "./auth-icons"
import { ForgotPasswordDialog } from "./forgot-password-dialog"

export function LoginForm() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [focused, setFocused] = useState<string | null>(null)
    const [forgotOpen, setForgotOpen] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 60)
        return () => clearTimeout(t)
    }, [])

    const fadeUp = (delay = 0) =>
        `transition-all duration-500 ${delay ? `delay-[${delay}ms]` : ""} ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`

    const fieldClass = (name: string) =>
        `flex items-center gap-3 bg-[#f0f4ff] rounded-xl px-4 h-12 border transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-300 ${
            focused === name ? "border-blue-400 shadow-sm shadow-blue-100" : "border-transparent"
        }`

    return (
        <>
            <ForgotPasswordDialog
                open={forgotOpen}
                onClose={() => setForgotOpen(false)}
                initialEmail={email}
            />

            <div
                className={`relative z-10 m-7 w-full max-w-md rounded-3xl border border-blue-100 bg-white px-8 py-10 shadow-xl shadow-blue-100/40 ${fadeUp()}`}
            >
                <div className={fadeUp(75)}>
                    <AuthLogo />
                </div>

                <div className="flex flex-col gap-4">
                    {/* E-mail */}
                    <div className={fadeUp(100)}>
                        <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-600 uppercase">
                            E-mail
                        </label>
                        <div className={fieldClass("email")}>
                            <EmailIcon active={focused === "email"} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocused("email")}
                                onBlur={() => setFocused(null)}
                                placeholder="seu@email.com"
                                className="flex-1 bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
                            />
                        </div>
                    </div>

                    {/* Senha */}
                    <div className={fadeUp(150)}>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="block text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                Senha
                            </label>
                            <button
                                type="button"
                                onClick={() => setForgotOpen(true)}
                                className="text-xs font-semibold text-blue-500 transition-colors hover:text-blue-700"
                            >
                                Esqueceu a senha?
                            </button>
                        </div>
                        <div className={fieldClass("password")}>
                            <LockIcon active={focused === "password"} />
                            <input
                                type={showPass ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocused("password")}
                                onBlur={() => setFocused(null)}
                                placeholder="••••••••"
                                className="flex-1 bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                                className="text-slate-400 transition-colors hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:rounded"
                            >
                                {showPass ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className={`mt-2 ${fadeUp(200)}`}>
                        <button
                            onClick={() => {
                                localStorage.removeItem("fluency-lab:mode")
                                // Marca primeira entrada para exibir o onboarding na home
                                localStorage.setItem("fluency-lab:firstLogin", "true")
                                router.push("/home")
                            }}
                            type="button"
                            className="relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-800 text-sm font-bold text-white shadow-md shadow-blue-400/35 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-400/45 active:scale-[0.98]"
                        >
                            Entrar
                            <span className="absolute inset-0 -translate-x-full animate-[shimmer_3s_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </button>
                    </div>
                </div>

                <p className={`mt-6 text-center text-xs text-slate-400 ${fadeUp(320)}`}>
                    Não tem uma conta?{" "}
                    <a
                        href="/register"
                        className="font-semibold text-blue-500 transition-colors hover:text-blue-700"
                    >
                        Criar conta grátis
                    </a>
                </p>
            </div>
        </>
    )
}
