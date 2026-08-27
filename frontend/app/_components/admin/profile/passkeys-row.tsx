"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { KeyRound, Trash2 } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/app/_components/ui/dialog"
import {
    apiErrorMessage,
    deletePasskey,
    listPasskeys,
    type Passkey,
} from "@/app/_lib/admin-api"
import { browserSupportsPasskeys, registerPasskey } from "@/app/_lib/webauthn-client"

function fmtDate(dt: string | null) {
    if (!dt) return "nunca usada"
    const d = new Date(dt.replace(" ", "T"))
    return isNaN(d.getTime()) ? dt : d.toLocaleDateString("pt-BR")
}

// Gerência de passkeys do admin: é o que permite o login próprio do painel.
export function PasskeysRow() {
    const [passkeys, setPasskeys] = useState<Passkey[]>([])
    const [error, setError] = useState("")
    const [supported, setSupported] = useState(true)

    const [addOpen, setAddOpen] = useState(false)
    const [nickname, setNickname] = useState("")
    const [busy, setBusy] = useState(false)

    async function load() {
        try {
            setPasskeys(await listPasskeys())
        } catch (err) {
            setError(apiErrorMessage(err, "Não foi possível carregar os passkeys."))
        }
    }

    useEffect(() => {
        setSupported(browserSupportsPasskeys())
        load()
    }, [])

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setBusy(true)
        try {
            await registerPasskey(nickname.trim() || undefined)
            toast.success("Passkey registrado.")
            setNickname("")
            setAddOpen(false)
            await load()
        } catch (err) {
            setError(apiErrorMessage(err, "Não foi possível registrar o passkey."))
        } finally {
            setBusy(false)
        }
    }

    async function handleDelete(id: number) {
        setError("")
        try {
            await deletePasskey(id)
            toast.success("Passkey removido.")
            await load()
        } catch (err) {
            const msg = apiErrorMessage(err, "Não foi possível remover o passkey.")
            setError(msg)
            toast.error(msg)
        }
    }

    return (
        <div className="flex flex-col gap-3 py-3 pr-2.5 pl-4">
            <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                    <h3 className="text-sm leading-tight">Chaves de acesso (passkeys)</h3>
                    <p className="text-xs font-light text-neutral-600 dark:text-neutral-400">
                        Entre no painel sem senha, usando biometria ou PIN do dispositivo.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddOpen(true)}
                    disabled={!supported}
                    className="shrink-0"
                >
                    Adicionar
                </Button>
            </div>

            {!supported && (
                <p className="text-xs text-amber-600">
                    Este navegador não suporta passkeys.
                </p>
            )}

            {passkeys.length > 0 && (
                <ul className="flex flex-col gap-2">
                    {passkeys.map((pk) => (
                        <li
                            key={pk.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2"
                        >
                            <div className="flex items-center gap-2.5">
                                <KeyRound className="size-4 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700">
                                        {pk.name || "Passkey"}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Último uso: {fmtDate(pk.last_used_at)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(pk.id)}
                                aria-label="Remover passkey"
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent>
                    <DialogTitle>Adicionar passkey</DialogTitle>
                    <DialogDescription>
                        Dê um nome para reconhecer este dispositivo e siga as instruções do
                        navegador (biometria, PIN ou chave de segurança).
                    </DialogDescription>
                    <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="passkey-name">Nome (opcional)</Label>
                            <Input
                                id="passkey-name"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="MacBook do trabalho"
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-xs text-red-500">{error}</p>}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={busy}>
                                {busy ? "Aguardando…" : "Registrar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
