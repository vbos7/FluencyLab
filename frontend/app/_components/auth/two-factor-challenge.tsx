"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthLogo } from "./auth-logo"
import { apiClient } from "@/app/_lib/api"
import { apiErrorMessage } from "@/app/_lib/admin-api"

// Segundo passo do login de um admin com 2FA ativo. O login.php já gravou o
// usuário pendente na sessão; aqui só enviamos o código do app (ou um código de
// recuperação) para /auth/two-factor-challenge.php.
export function TwoFactorChallenge() {
    const router = useRouter()
    const [useRecovery, setUseRecovery] = useState(false)
    const [value, setValue] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        if (!value.trim()) {
            setError("Informe o código.")
            return
        }
        setLoading(true)
        try {
            const payload = useRecovery
                ? { recovery_code: value.trim() }
                : { code: value.trim() }
            await apiClient.post("/auth/two-factor-challenge.php", payload)
            localStorage.removeItem("fluency-lab:mode")
            router.push("/home")
        } catch (err) {
            setError(apiErrorMessage(err, "Código inválido."))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative z-10 m-7 w-full max-w-md rounded-3xl border border-blue-100 bg-white px-8 py-10 shadow-xl shadow-blue-100/40">
            <AuthLogo />

            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Verificação em duas etapas</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {useRecovery
                            ? "Digite um dos seus códigos de recuperação."
                            : "Digite o código do seu aplicativo autenticador."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        inputMode={useRecovery ? "text" : "numeric"}
                        autoComplete="one-time-code"
                        autoFocus
                        value={value}
                        maxLength={useRecovery ? 13 : 6}
                        onChange={(e) => {
                            const raw = e.target.value
                            // Autenticador: só dígitos, 6. Recuperação: hex + hífen
                            // (formato XXXXXX-XXXXXX gerado no backend), até 13.
                            setValue(
                                useRecovery
                                    ? raw.toUpperCase().replace(/[^0-9A-F-]/g, "").slice(0, 13)
                                    : raw.replace(/\D/g, "").slice(0, 6)
                            )
                        }}
                        placeholder={useRecovery ? "XXXXXX-XXXXXX" : "123456"}
                        className="h-12 rounded-xl border border-transparent bg-[#f0f4ff] px-4 text-center font-mono text-lg tracking-widest text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
                    />

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-12 w-full rounded-xl bg-linear-to-br from-blue-500 to-blue-800 text-sm font-bold text-white shadow-md shadow-blue-400/35 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
                    >
                        {loading ? "Verificando..." : "Verificar"}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() => {
                        setUseRecovery((v) => !v)
                        setValue("")
                        setError(null)
                    }}
                    className="text-center text-xs font-semibold text-blue-500 transition-colors hover:text-blue-700"
                >
                    {useRecovery
                        ? "Usar o código do aplicativo"
                        : "Usar um código de recuperação"}
                </button>
            </div>
        </div>
    )
}
