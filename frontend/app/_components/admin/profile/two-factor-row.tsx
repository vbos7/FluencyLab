"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/_components/ui/dialog"
import {
    apiErrorMessage,
    twoFactorConfirm,
    twoFactorDisable,
    twoFactorEnable,
    twoFactorStatus,
    type TwoFactorSetup,
} from "@/app/_lib/admin-api"
import { CardRow } from "./card-row"

// Toggle switch estilizado
function Toggle({
    enabled,
    onChange,
    disabled,
}: {
    enabled: boolean
    onChange: (v: boolean) => void
    disabled?: boolean
}) {
    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!enabled)}
            disabled={disabled}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${enabled ? "bg-blue-600" : "bg-slate-200"}`}
        >
            <span
                className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-[18px]" : "translate-x-0.5"}`}
            />
        </button>
    )
}

export function TwoFactorRow() {
    const [enabled, setEnabled] = useState(false)
    const [ready, setReady] = useState(false) // status carregado

    const [setupOpen, setSetupOpen] = useState(false)
    const [setup, setSetup] = useState<TwoFactorSetup | null>(null)
    const [code, setCode] = useState("")
    const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null)

    const [disableOpen, setDisableOpen] = useState(false)
    const [password, setPassword] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Estado inicial do 2FA.
    useEffect(() => {
        twoFactorStatus()
            .then((s) => setEnabled(s.enabled))
            .catch(() => {})
            .finally(() => setReady(true))
    }, [])

    // Passo 1: gera segredo + QR e abre o diálogo de configuração.
    async function startEnable() {
        setError("")
        setLoading(true)
        try {
            const data = await twoFactorEnable()
            setSetup(data)
            setCode("")
            setRecoveryCodes(null)
            setSetupOpen(true)
        } catch (err) {
            setError(apiErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    // Passo 2: confirma o código do app → ativa e revela os códigos de recuperação.
    async function confirmEnable() {
        setError("")
        setLoading(true)
        try {
            const codes = await twoFactorConfirm(code.trim())
            setRecoveryCodes(codes)
            setEnabled(true)
            toast.success("Autenticação de dois fatores ativada.")
        } catch (err) {
            setError(apiErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    async function handleDisable() {
        setError("")
        setLoading(true)
        try {
            await twoFactorDisable(password)
            setEnabled(false)
            setDisableOpen(false)
            setPassword("")
            toast.success("Autenticação de dois fatores desativada.")
        } catch (err) {
            setError(apiErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    function handleToggle(value: boolean) {
        if (value) startEnable()
        else {
            setError("")
            setPassword("")
            setDisableOpen(true)
        }
    }

    return (
        <>
            <CardRow
                label="Autenticação de dois fatores"
                description="Proteja sua conta com um código de verificação adicional no login"
            >
                <Toggle enabled={enabled} onChange={handleToggle} disabled={loading || !ready} />
            </CardRow>

            {/* Diálogo de configuração / ativação */}
            <Dialog
                open={setupOpen}
                onOpenChange={(v) => {
                    setSetupOpen(v)
                    if (!v) setError("")
                }}
            >
                <DialogContent>
                    {recoveryCodes ? (
                        // Etapa final: mostra os códigos de recuperação (uma única vez).
                        <>
                            <DialogHeader>
                                <DialogTitle>Guarde seus códigos de recuperação</DialogTitle>
                                <DialogDescription>
                                    Cada código funciona uma única vez, caso você perca o acesso ao
                                    aplicativo. Guarde-os em local seguro — eles não serão mostrados
                                    novamente.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-2 py-2">
                                {recoveryCodes.map((c) => (
                                    <code
                                        key={c}
                                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-center font-mono text-sm tracking-wide text-slate-700"
                                    >
                                        {c}
                                    </code>
                                ))}
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setSetupOpen(false)}>Concluído</Button>
                            </DialogFooter>
                        </>
                    ) : (
                        // Etapa 1+2: QR/segredo + confirmação do código.
                        <>
                            <DialogHeader>
                                <DialogTitle>Configurar autenticação 2FA</DialogTitle>
                                <DialogDescription>
                                    Escaneie o QR code com seu aplicativo autenticador (Google
                                    Authenticator, Authy, etc.) e insira o código gerado.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col items-center gap-3 py-2">
                                {setup?.qr ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={setup.qr}
                                        alt="QR code do 2FA"
                                        className="size-40 rounded-xl border border-slate-200"
                                    />
                                ) : (
                                    <div className="size-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50" />
                                )}
                                <p className="text-xs text-slate-400">
                                    Ou insira o código manualmente no seu app
                                </p>
                                <code className="rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-xs tracking-widest text-slate-700">
                                    {setup?.secret ?? "…"}
                                </code>

                                <div className="mt-2 flex w-full flex-col gap-1.5">
                                    <Label htmlFor="totp-code">Código do aplicativo</Label>
                                    <Input
                                        id="totp-code"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        placeholder="123456"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                    {error && <p className="text-xs text-red-500">{error}</p>}
                                </div>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <Button onClick={confirmEnable} disabled={loading || code.trim() === ""}>
                                    {loading ? "Verificando…" : "Ativar 2FA"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Diálogo de desativação */}
            <Dialog
                open={disableOpen}
                onOpenChange={(v) => {
                    setDisableOpen(v)
                    if (!v) setError("")
                }}
            >
                <DialogContent>
                    <DialogTitle>Desativar autenticação 2FA?</DialogTitle>
                    <DialogDescription>
                        Confirme com sua senha. Ao desativar, sua conta ficará protegida apenas por
                        senha.
                    </DialogDescription>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleDisable()
                        }}
                        className="mt-4 flex flex-col gap-4"
                    >
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="disable-2fa-password">Senha</Label>
                            <Input
                                id="disable-2fa-password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                            />
                            {error && <p className="text-xs text-red-500">{error}</p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={loading || password === ""}
                            >
                                {loading ? "Desativando…" : "Desativar 2FA"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
