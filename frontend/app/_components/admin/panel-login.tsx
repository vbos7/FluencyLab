"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Fingerprint } from "lucide-react"
import { apiErrorMessage } from "@/app/_lib/admin-api"
import { browserSupportsPasskeys, loginWithPasskey } from "@/app/_lib/webauthn-client"

// Login PRÓPRIO do painel: sem email/senha, só passkey (biometria/PIN). É o que
// aparece quando alguém tenta acessar /admin sem sessão.
export function PanelLogin() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [supported, setSupported] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        setSupported(browserSupportsPasskeys())
    }, [])

    async function handleLogin() {
        setError("")
        setLoading(true)
        try {
            await loginWithPasskey()
            router.push("/admin/dashboard")
        } catch (err) {
            // Cancelamento do usuário lança DOMException; cai no texto padrão.
            setError(apiErrorMessage(err, "Não foi possível autenticar com o passkey."))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative z-10 m-7 w-full max-w-md rounded-3xl border border-blue-100 bg-white px-8 py-10 text-center shadow-xl shadow-blue-100/40">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Fingerprint className="size-7" />
            </div>

            <h1 className="text-xl font-bold text-slate-800">Painel administrativo</h1>
            <p className="mt-1.5 text-sm text-slate-500">
                Acesse com sua chave de acesso (passkey) — biometria, PIN ou chave de segurança.
            </p>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

            <button
                onClick={handleLogin}
                disabled={loading || !supported}
                className="mt-6 h-12 w-full rounded-xl bg-linear-to-br from-blue-500 to-blue-800 text-sm font-bold text-white shadow-md shadow-blue-400/35 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Aguardando autenticação…" : "Entrar com passkey"}
            </button>

            {!supported && (
                <p className="mt-3 text-xs text-amber-600">
                    Este navegador não suporta passkeys.
                </p>
            )}

            <a
                href="/login"
                className="mt-6 inline-block text-xs font-semibold text-blue-500 transition-colors hover:text-blue-700"
            >
                Entrar com e-mail e senha
            </a>
        </div>
    )
}
