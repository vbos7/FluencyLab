"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Languages, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { cn } from "@/app/_lib/utils"

// Quantidade de dígitos do código de confirmação
const CODE_LENGTH = 6

// Passos do fluxo de recuperação de senha
type Step = "email" | "code" | "new-password" | "done"

export default function ForgotPasswordPage() {
    // Passo atual do fluxo
    const [step, setStep]             = useState<Step>("email")
    const [email, setEmail]           = useState("")
    // Array de dígitos do código (um por input)
    const [code, setCode]             = useState<string[]>(Array(CODE_LENGTH).fill(""))
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading]       = useState(false)
    // Contador de reenvio em segundos (0 = pode reenviar)
    const [resendTimer, setResendTimer] = useState(0)

    // Refs dos inputs do código para controle de foco
    const codeRefs = useRef<(HTMLInputElement | null)[]>([])

    // Inicia o contador de 60s ao entrar na etapa de código
    useEffect(() => {
        if (step !== "code") return
        setResendTimer(60)
        const interval = setInterval(() => {
            setResendTimer(t => {
                if (t <= 1) { clearInterval(interval); return 0 }
                return t - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [step])

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.includes("@")) return
        setLoading(true)
        // TODO: chamar API para envio do código por e-mail
        await new Promise(r => setTimeout(r, 1000))
        setLoading(false)
        setStep("code")
    }

    // Trata digitação em cada campo do código
    const handleCodeChange = (value: string, idx: number) => {
        // Aceita apenas dígitos
        if (!/^\d?$/.test(value)) return
        const next = [...code]
        next[idx] = value
        setCode(next)
        // Avança o foco para o próximo input ao digitar
        if (value && idx < CODE_LENGTH - 1) {
            codeRefs.current[idx + 1]?.focus()
        }
    }

    // Permite apagar e retroceder o foco com Backspace
    const handleCodeKeyDown = (e: React.KeyboardEvent, idx: number) => {
        if (e.key === "Backspace" && !code[idx] && idx > 0) {
            codeRefs.current[idx - 1]?.focus()
        }
    }

    // Suporte a colar o código completo no primeiro campo
    const handleCodePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH)
        if (pasted.length === CODE_LENGTH) {
            e.preventDefault()
            setCode(pasted.split(""))
            codeRefs.current[CODE_LENGTH - 1]?.focus()
        }
    }

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        if (code.join("").length < CODE_LENGTH) return
        setLoading(true)
        // TODO: verificar o código com a API
        await new Promise(r => setTimeout(r, 1000))
        setLoading(false)
        setStep("new-password")
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword || newPassword.length < 8) return
        setLoading(true)
        // TODO: enviar nova senha para a API
        await new Promise(r => setTimeout(r, 1000))
        setLoading(false)
        setStep("done")
    }

    const handleResend = async () => {
        if (resendTimer > 0) return
        setLoading(true)
        setCode(Array(CODE_LENGTH).fill(""))
        // TODO: reenviar o código
        await new Promise(r => setTimeout(r, 800))
        setLoading(false)
        setResendTimer(60)
    }

    // ── Render por passo ──────────────────────────────────────────────────────

    return (
        <main className="flex flex-col items-center justify-center flex-1 px-5 py-12">
            <div className="w-full max-w-sm flex flex-col gap-7">

                {/* Logo — presente em todos os passos */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="size-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.3)]">
                        <Languages className="text-white" size={22} />
                    </div>
                    {step === "email" && (
                        <>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Esqueci a senha</h1>
                            <p className="text-sm text-slate-400">Digite seu e-mail para receber o código</p>
                        </>
                    )}
                    {step === "code" && (
                        <>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Verificar e-mail</h1>
                            <p className="text-sm text-slate-400">
                                Enviamos um código de 6 dígitos para<br />
                                <strong className="text-slate-700">{email}</strong>
                            </p>
                        </>
                    )}
                    {step === "new-password" && (
                        <>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Nova senha</h1>
                            <p className="text-sm text-slate-400">Escolha uma senha nova e segura</p>
                        </>
                    )}
                    {step === "done" && (
                        <>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Senha redefinida!</h1>
                            <p className="text-sm text-slate-400">Sua senha foi alterada com sucesso.</p>
                        </>
                    )}
                </div>

                {/* ── Passo 1: E-mail ── */}
                {step === "email" && (
                    <form onSubmit={handleSendCode} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!email.includes("@") || loading}
                            className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold shadow-[0_4px_16px_rgba(37,99,235,0.25)] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                        >
                            {loading ? "Enviando…" : "Enviar código"}
                        </Button>
                    </form>
                )}

                {/* ── Passo 2: Código ── */}
                {step === "code" && (
                    <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">

                        {/* Inputs do código */}
                        <div className="flex justify-center gap-2">
                            {code.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={el => { codeRefs.current[idx] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleCodeChange(e.target.value, idx)}
                                    onKeyDown={e => handleCodeKeyDown(e, idx)}
                                    onPaste={handleCodePaste}
                                    className={cn(
                                        "size-11 text-center text-lg font-bold font-mono text-slate-900",
                                        "border-2 rounded-xl outline-none transition-colors",
                                        digit
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-slate-200 bg-white",
                                        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    )}
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            disabled={code.join("").length < CODE_LENGTH || loading}
                            className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold shadow-[0_4px_16px_rgba(37,99,235,0.25)] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                        >
                            {loading ? "Verificando…" : "Verificar código"}
                        </Button>

                        {/* Reenvio com temporizador */}
                        <div className="flex items-center justify-center gap-1.5 text-sm">
                            {resendTimer > 0 ? (
                                <p className="text-slate-400">
                                    Reenviar em <span className="font-semibold text-slate-600 font-mono">{resendTimer}s</span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="flex items-center gap-1.5 text-blue-600 font-semibold hover:underline"
                                >
                                    <RotateCcw size={13} />
                                    Reenviar código
                                </button>
                            )}
                        </div>

                        {/* Voltar para trocar o e-mail */}
                        <button
                            type="button"
                            onClick={() => setStep("email")}
                            className="flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-slate-600"
                        >
                            <ArrowLeft size={13} />
                            Trocar e-mail
                        </button>
                    </form>
                )}

                {/* ── Passo 3: Nova senha ── */}
                {step === "new-password" && (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="new-password">Nova senha</Label>
                            <Input
                                id="new-password"
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="confirm-password">Confirmar senha</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Repita a nova senha"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                className={cn(
                                    confirmPassword.length > 0 && newPassword !== confirmPassword
                                        && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                                )}
                                required
                            />
                            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                                <p className="text-[11px] text-red-500 font-medium">As senhas não coincidem.</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={newPassword.length < 8 || newPassword !== confirmPassword || loading}
                            className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold shadow-[0_4px_16px_rgba(37,99,235,0.25)] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none mt-1"
                        >
                            {loading ? "Salvando…" : "Redefinir senha"}
                        </Button>
                    </form>
                )}

                {/* ── Passo 4: Concluído ── */}
                {step === "done" && (
                    <Button asChild className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold shadow-[0_4px_16px_rgba(37,99,235,0.25)]">
                        <Link href="/" className="flex items-center gap-2">
                            Ir para o início <ArrowRight size={16} />
                        </Link>
                    </Button>
                )}

                {/* Link para voltar ao login — visível nos passos iniciais */}
                {(step === "email" || step === "code") && (
                    <p className="text-center text-sm text-slate-400">
                        Lembrou a senha?{" "}
                        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                            Entrar
                        </Link>
                    </p>
                )}
            </div>
        </main>
    )
}
