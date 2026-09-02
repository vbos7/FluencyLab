"use client"

import { useEffect, useState } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/_components/ui/select"
import {
    DIFFICULTY_LABELS,
    type AdminCategory,
    type AdminPhrase,
    type Difficulty,
} from "@/app/_lib/admin"
import {
    apiErrorMessage,
    createPhrase,
    listCategories,
    updatePhrase,
} from "@/app/_lib/admin-api"

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"]

// Diálogo de criar/editar frase.
export function PhraseFormDialog({
    open,
    onOpenChange,
    editing,
    onSaved,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    editing: AdminPhrase | null
    onSaved: () => void
}) {
    const [en, setEn] = useState("")
    const [pt, setPt] = useState("")
    const [difficulty, setDifficulty] = useState<Difficulty>("easy")
    const [categoryId, setCategoryId] = useState("")
    const [categories, setCategories] = useState<AdminCategory[]>([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open) return
        setEn(editing?.en ?? "")
        setPt(editing?.pt ?? "")
        setDifficulty(editing?.difficulty ?? "easy")
        setCategoryId(editing?.category_id ? String(editing.category_id) : "")
        setError("")
        // Carrega as categorias disponíveis para o select toda vez que abre.
        listCategories()
            .then(setCategories)
            .catch((err) => setError(apiErrorMessage(err, "Não foi possível carregar as categorias.")))
    }, [open, editing])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        if (!categoryId) {
            setError("Selecione uma categoria.")
            return
        }
        setLoading(true)
        const payload = { en, pt, difficulty, category_id: Number(categoryId) }
        try {
            if (editing) {
                await updatePhrase(editing.id, payload)
                toast.success("Frase atualizada com sucesso.")
            } else {
                await createPhrase(payload)
                toast.success("Frase criada com sucesso.")
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
                <DialogTitle>{editing ? "Editar frase" : "Nova frase"}</DialogTitle>
                <DialogDescription>
                    {editing
                        ? "Atualize a frase e sua tradução de referência."
                        : "Cadastre uma nova frase para a prática."}
                </DialogDescription>

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="phrase-en">Inglês</Label>
                        <Input
                            id="phrase-en"
                            value={en}
                            onChange={(e) => setEn(e.target.value)}
                            placeholder="Can I have the check, please?"
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="phrase-pt">Português</Label>
                        <Input
                            id="phrase-pt"
                            value={pt}
                            onChange={(e) => setPt(e.target.value)}
                            placeholder="Pode trazer a conta, por favor?"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-1 flex-col gap-1.5">
                            <Label htmlFor="phrase-difficulty">Dificuldade</Label>
                            <Select
                                value={difficulty}
                                onValueChange={(v) => setDifficulty(v as Difficulty)}
                            >
                                <SelectTrigger id="phrase-difficulty" className="h-9 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DIFFICULTIES.map((d) => (
                                        <SelectItem key={d} value={d}>
                                            {DIFFICULTY_LABELS[d]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-1 flex-col gap-1.5">
                            <Label htmlFor="phrase-category">Categoria</Label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger id="phrase-category" className="h-9 w-full">
                                    <SelectValue placeholder="Selecione…" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando…" : editing ? "Salvar" : "Criar frase"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
