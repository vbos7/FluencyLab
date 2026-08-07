"use client"

import { useRef, useState } from "react"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/app/_components/ui/dialog"
import { CardRow } from "./card-row"

type Errors = { current?: string; password?: string; confirm?: string }

export function PasswordRow() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Errors>({})
    const [fields, setFields] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    })

    const newPasswordRef = useRef<HTMLInputElement>(null)
    const currentPasswordRef = useRef<HTMLInputElement>(null)

    function reset() {
        setFields({ current_password: "", password: "", password_confirmation: "" })
        setErrors({})
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const errs: Errors = {}
        if (!fields.current_password) errs.current = "Informe a senha atual."
        if (fields.password.length < 8) errs.password = "Mínimo 8 caracteres."
        if (fields.password !== fields.password_confirmation)
            errs.confirm = "As senhas não coincidem."
        if (Object.keys(errs).length) {
            setErrors(errs)
            return
        }

        setLoading(true)
        // TODO: PUT /api/admin/profile/password
        await new Promise((r) => setTimeout(r, 800))
        setLoading(false)
        reset()
        setOpen(false)
    }

    return (
        <CardRow label="Senha">
            <Dialog
                open={open}
                onOpenChange={(v) => {
                    if (!v) reset()
                    setOpen(v)
                }}
            >
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        Alterar senha
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Alterar senha</DialogTitle>
                    <DialogDescription>
                        Use uma senha longa e aleatória para manter sua conta segura.
                    </DialogDescription>
                    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="current_password">Senha atual</Label>
                            <Input
                                id="current_password"
                                ref={currentPasswordRef}
                                type="password"
                                autoComplete="current-password"
                                placeholder="Senha atual"
                                value={fields.current_password}
                                onChange={(e) =>
                                    setFields((f) => ({ ...f, current_password: e.target.value }))
                                }
                            />
                            {errors.current && (
                                <p className="text-xs text-red-500">{errors.current}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="new-password">Nova senha</Label>
                            <Input
                                id="new-password"
                                ref={newPasswordRef}
                                type="password"
                                autoComplete="new-password"
                                placeholder="Mínimo 8 caracteres"
                                value={fields.password}
                                onChange={(e) =>
                                    setFields((f) => ({ ...f, password: e.target.value }))
                                }
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="password_confirmation">Confirmar nova senha</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Repita a nova senha"
                                value={fields.password_confirmation}
                                onChange={(e) =>
                                    setFields((f) => ({
                                        ...f,
                                        password_confirmation: e.target.value,
                                    }))
                                }
                            />
                            {errors.confirm && (
                                <p className="text-xs text-red-500">{errors.confirm}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Salvando…" : "Salvar senha"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </CardRow>
    )
}
