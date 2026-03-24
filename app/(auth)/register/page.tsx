"use client"

import { useState } from "react"
import Link from "next/link"
import { Languages, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { cn } from "@/app/_lib/utils"

// Regras de validação de senha exibidas em tempo real
const PASSWORD_RULES = [
    { label: "Mínimo 8 caracteres",            test: (p: string) => p.length >= 8 },
    { label: "Pelo menos uma letra maiúscula",  test: (p: string) => /[A-Z]/.test(p) },
    { label: "Pelo menos um número",            test: (p: string) => /[0-9]/.test(p) },
]

export default function RegisterPage() {
    // Valores dos campos do formulário
    const [name,            setName]            = useState("")
    const [email,           setEmail]           = useState("")
    const [password,        setPassword]        = useState("")
    const [confirm,         setConfirm]         = useState("")
    // Controla visibilidade das senhas
    const [showPassword,    setShowPassword]    = useState(false)
    const [showConfirm,     setShowConfirm]     = useState(false)
    // Estado de submissão
    const [loading,         setLoading]         = useState(false)
    const [submitted,       setSubmitted]       = useState(false)

    // Checagem de cada regra de senha
    const passwordOk  = PASSWORD_RULES.every(r => r.test(password))
    const confirmOk   = password === confirm && confirm.length > 0
    const formIsValid = name.trim() && email.includes("@") && passwordOk && confirmOk

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formIsValid) return
        setLoading(true)
        // TODO: integrar com a API de criação de conta
        await new Promise(r => setTimeout(r, 1200))
        setLoading(false)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <main className="flex flex-col items-center justify-center flex-1 px-5 py-16">
                <div className="w-full max-w-sm text-center flex flex-col items-center gap-4">
                    <div className="size-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <Languages className="text-blue-600" size={28} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">Conta criada!</h1>
                    <p className="text-sm text-slate-400">
                        Bem-vindo ao FluencyLab, <strong className="text-slate-700">{name}</strong>. Sua conta foi criada com sucesso.
                    </p>
                    <Button asChild className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 mt-2">
                        <Link href="/">Começar a praticar <ArrowRight size={16} /></Link>
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="flex flex-col items-center justify-center flex-1 px-5 py-12">
            <div className="w-full max-w-sm flex flex-col gap-7">

                {/* Logo */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="size-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.3)]">
                        <Languages className="text-white" size={22} />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Criar conta</h1>
                    <p className="text-sm text-slate-400">Comece a aprender inglês hoje</p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Nome */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Seu nome"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoComplete="name"
                            required
                        />
                    </div>

                    {/* E-mail */}
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

                    {/* Senha */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="password">Senha</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Crie uma senha"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="new-password"
                                className="pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Regras de senha — visíveis enquanto o campo tem conteúdo */}
                        {password.length > 0 && (
                            <ul className="flex flex-col gap-1 mt-1">
                                {PASSWORD_RULES.map(rule => (
                                    <li key={rule.label} className={cn(
                                        "flex items-center gap-1.5 text-[11px] font-medium transition-colors",
                                        rule.test(password) ? "text-emerald-600" : "text-slate-400"
                                    )}>
                                        <span className={cn(
                                            "size-1.5 rounded-full shrink-0",
                                            rule.test(password) ? "bg-emerald-500" : "bg-slate-300"
                                        )} />
                                        {rule.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Confirmar senha */}
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="confirm">Confirmar senha</Label>
                        <div className="relative">
                            <Input
                                id="confirm"
                                type={showConfirm ? "text" : "password"}
                                placeholder="Repita a senha"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                autoComplete="new-password"
                                className={cn(
                                    "pr-10",
                                    confirm.length > 0 && !confirmOk && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                                )}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                tabIndex={-1}
                            >
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {/* Feedback de senhas diferentes */}
                        {confirm.length > 0 && !confirmOk && (
                            <p className="text-[11px] text-red-500 font-medium">As senhas não coincidem.</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={!formIsValid || loading}
                        className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold shadow-[0_4px_16px_rgba(37,99,235,0.25)] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none mt-1"
                    >
                        {loading ? "Criando conta…" : "Criar conta"}
                    </Button>
                </form>

                {/* Link para login */}
                <p className="text-center text-sm text-slate-400">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </main>
    )
}
