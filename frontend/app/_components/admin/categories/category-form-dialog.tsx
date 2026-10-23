"use client"

import { useState } from "react"
import { toast } from "sonner"
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
import type { AdminCategory } from "@/app/_lib/admin"
import { apiErrorMessage, createCategory, updateCategory } from "@/app/_lib/admin-api"

// Diálogo de criar/editar categoria.
//   editing = null      → criação
//   editing = category  → renomeia
export function CategoryFormDialog({
    open,
    onOpenChange,
    editing,
    onSaved,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    editing: AdminCategory | null
    onSaved: () => void
}) {
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Ao abrir (ou trocar o item em edição) os campos são recarregados. Ajuste
    // feito durante o render — padrão do React para "resetar estado quando a prop
    // muda" — em vez de um efeito que renderiza duas vezes.
    const chaveAberta = open ? (editing?.id ?? "novo") : null
    const [chaveAnterior, setChaveAnterior] = useState<typeof chaveAberta>(null)
    if (chaveAberta !== chaveAnterior) {
        setChaveAnterior(chaveAberta)
        if (open) {
        setName(editing?.name ?? "")
        setError("")
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            if (editing) {
                await updateCategory(editing.id, name)
                toast.success("Categoria atualizada com sucesso.")
            } else {
                await createCategory(name)
                toast.success("Categoria criada com sucesso.")
            }
            onSaved()
            onOpenChange(false)
        } catch (err) {
            setError(apiErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>{editing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
                <DialogDescription>
                    {editing
                        ? "Renomeie esta categoria de frases."
                        : "Cadastre uma nova categoria para as frases."}
                </DialogDescription>

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="category-name">Nome</Label>
                        <Input
                            id="category-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Cotidiano"
                            maxLength={50}
                            autoFocus
                        />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando…" : editing ? "Salvar" : "Criar categoria"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
