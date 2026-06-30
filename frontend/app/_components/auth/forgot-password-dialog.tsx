"use client"

import { useState, useRef, useEffect, startTransition } from "react"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/app/_components/ui/dialog"
import { LockIcon, EyeIcon, EyeOffIcon } from "./auth-icons"

type Step = "email" | "code" | "password" | "done"

interface Props {
    open: boolean
    onClose: () => void
    initialEmail?: string
}

export function ForgotPasswordDialog({ open, onClose, initialEmail = "" }: Props) {
    const [step, setStep] = useState<Step>("email")
    const [email, setEmail] = useState(initialEmail)
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [focused, setFocused] = useState<string | null>(null)
    const [error, setError] = useState("")
    const codeRefs = useRef<(HTMLInputElement | null)[]>([])

    // Reseta o estado quando fecha
    useEffect(() => {
        if (!open) {
            const t = setTimeout(() => {
                setStep("email")
                setCode(["", "", "", "", "", ""])
                setNewPassword("")
                setConfirmPassword("")
                setError("")
                setShowPass(false)
                setShowConfirm(false)
            }, 200)
            return () => clearTimeout(t)
        }
    }, [open])

    // Sincroniza email inicial quando abre — startTransition evita setState síncrono em effect
    useEffect(() => {
        if (open) startTransition(() => setEmail(initialEmail))
    }, [open, initialEmail])

    const fieldClass = (name: string) =>
        `flex items-center gap-3 bg-[#f0f4ff] rounded-xl px-4 h-12 border transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-300 ${
            focused === name ? "border-blue-400 shadow-sm shadow-blue-100" : "border-transparent"
        }`

    const btnClass =
        "w-full h-11 rounded-xl text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-blue-800 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-md shadow-blue-400/30"

    // ── Handlers de código OTP ──────────────────────────────────
    function handleCodeChange(i: number, val: string) {
        if (!/^\d?$/.test(val)) return
        const next = [...code]
        next[i] = val
        setCode(next)
        if (val && i < 5) codeRefs.current[i + 1]?.focus()
    }

    function handleCodeKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Backspace" && !code[i] && i > 0) {
            codeRefs.current[i - 1]?.focus()
        }
    }

    function handleCodePaste(e: React.ClipboardEvent) {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        if (!pasted.length) return
        e.preventDefault()
        const next = [...code]
        pasted.split("").forEach((char, i) => {
            next[i] = char
        })
        setCode(next)
        codeRefs.current[Math.min(pasted.length, 5)]?.focus()
    }

    // ── Submit handlers ─────────────────────────────────────────
    function submitEmail() {
        if (!email) {
            setError("Digite seu e-mail.")
            return
        }
        setError("")
        // TODO: API — enviar código
        setStep("code")
        setTimeout(() => codeRefs.current[0]?.focus(), 120)
    }

    function submitCode() {
        if (code.join("").length < 6) {
            setError("Digite o código completo.")
            return
        }
        setError("")
        // TODO: API — validar código
        setStep("password")
    }

    function submitPassword() {
        if (newPassword.length < 8) {
            setError("A senha deve ter pelo menos 8 caracteres.")
            return
        }
        if (newPassword !== confirmPassword) {
            setError("As senhas não coincidem.")
            return
        }
        setError("")
        // TODO: API — atualizar senha
        setStep("done")
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-sm">
                {/* ── Etapa 1: e-mail ───────────────────────────── */}
                {step === "email" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Recuperar senha</DialogTitle>
                            <DialogDescription>
                                Digite seu e-mail para receber um código de verificação.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-2 flex flex-col gap-4">
                            <div className={fieldClass("email")}>
                                <Mail
                                    size={16}
                                    className={`shrink-0 transition-colors duration-200 ${focused === "email" ? "text-blue-500" : "text-slate-400"}`}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                    onKeyDown={(e) => e.key === "Enter" && submitEmail()}
                                    placeholder="seu@email.com"
                                    className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                                />
                            </div>
                            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
                            <button onClick={submitEmail} className={btnClass}>
                                Enviar código
                            </button>
                        </div>
                    </>
                )}

                {/* ── Etapa 2: código OTP ───────────────────────── */}
                {step === "code" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Verifique seu e-mail</DialogTitle>
                            <DialogDescription>
                                Enviamos um código de 6 dígitos para{" "}
                                <span className="font-semibold text-blue-600">{email}</span>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-2 flex flex-col gap-4">
                            {/* Inputs OTP */}
                            <div
                                className="flex items-center justify-center gap-2"
                                onPaste={handleCodePaste}
                            >
                                {code.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => {
                                            codeRefs.current[i] = el
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        aria-label={`Dígito ${i + 1} de 6`}
                                        onChange={(e) => handleCodeChange(i, e.target.value)}
                                        onKeyDown={(e) => handleCodeKeyDown(i, e)}
                                        className="h-12 w-11 rounded-xl border-2 border-transparent bg-[#f0f4ff] text-center text-lg font-bold text-slate-800 transition-all duration-150 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300 focus:shadow-sm focus:shadow-blue-100"
                                    />
                                ))}
                            </div>

                            {error && <p role="alert" className="text-center text-xs text-red-600">{error}</p>}

                            <button onClick={submitCode} className={btnClass}>
                                Verificar código
                            </button>

                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <button
                                    onClick={() => {
                                        setStep("email")
                                        setCode(["", "", "", "", "", ""])
                                        setError("")
                                    }}
                                    className="flex items-center gap-1 transition-colors hover:text-slate-600"
                                >
                                    <ArrowLeft size={12} /> Trocar e-mail
                                </button>
                                <button
                                    onClick={submitEmail}
                                    className="font-semibold text-blue-500 transition-colors hover:text-blue-700"
                                >
                                    Reenviar código
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* ── Etapa 3: nova senha ───────────────────────── */}
                {step === "password" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Nova senha</DialogTitle>
                            <DialogDescription>
                                Crie uma senha com pelo menos 8 caracteres.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-2 flex flex-col gap-3">
                            <div className={fieldClass("newPass")}>
                                <LockIcon active={focused === "newPass"} />
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onFocus={() => setFocused("newPass")}
                                    onBlur={() => setFocused(null)}
                                    placeholder="Nova senha"
                                    className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    aria-label={showPass ? "Ocultar nova senha" : "Mostrar nova senha"}
                                    className="text-slate-400 transition-colors hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:rounded"
                                >
                                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>

                            <div className={fieldClass("confirmPass")}>
                                <LockIcon active={focused === "confirmPass"} />
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onFocus={() => setFocused("confirmPass")}
                                    onBlur={() => setFocused(null)}
                                    placeholder="Confirmar nova senha"
                                    className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    aria-label={showConfirm ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                                    className="text-slate-400 transition-colors hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:rounded"
                                >
                                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>

                            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}

                            <button onClick={submitPassword} className={`${btnClass} mt-1`}>
                                Salvar nova senha
                            </button>
                        </div>
                    </>
                )}

                {/* ── Etapa 4: concluído ────────────────────────── */}
                {step === "done" && (
                    <div className="flex flex-col items-center gap-4 py-2 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                            <CheckCircle2 className="text-emerald-500" size={32} />
                        </div>
                        <div>
                            <h3 className="mb-1 text-lg font-extrabold text-slate-900">
                                Senha alterada!
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-400">
                                Sua senha foi redefinida com sucesso.
                                <br />
                                Faça login com sua nova senha.
                            </p>
                        </div>
                        <button onClick={onClose} className={btnClass}>
                            Ir para o login
                        </button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
