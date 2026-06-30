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

export function DeleteRow() {
    const [open, setOpen] = useState(false)
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    async function handleDelete(e: React.FormEvent) {
        e.preventDefault()
        if (!password) {
            setError("Informe a senha para confirmar.")
            inputRef.current?.focus()
            return
        }
        setError("")
        setLoading(true)
        // TODO: DELETE /api/admin/profile
        await new Promise((r) => setTimeout(r, 800))
        setLoading(false)
        setOpen(false)
    }

    return (
        <CardRow
            label="Excluir conta"
            description="Esta ação é irreversível. Todos os dados serão permanentemente excluídos."
        >
            <Dialog
                open={open}
                onOpenChange={(v) => {
                    if (!v) {
                        setPassword("")
                        setError("")
                    }
                    setOpen(v)
                }}
            >
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
                    >
                        Excluir conta
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Excluir sua conta?</DialogTitle>
                    <DialogDescription>
                        Todos os seus dados serão permanentemente removidos. Esta ação não pode ser
                        desfeita. Digite sua senha para confirmar.
                    </DialogDescription>
                    <form onSubmit={handleDelete} className="mt-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="delete-password" className="sr-only">
                                Senha
                            </Label>
                            <Input
                                id="delete-password"
                                ref={inputRef}
                                type="password"
                                placeholder="Sua senha"
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
                            <Button variant="destructive" type="submit" disabled={loading}>
                                {loading ? "Excluindo…" : "Excluir conta"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </CardRow>
    )
}
