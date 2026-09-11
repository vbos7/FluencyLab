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
import { type AdminCourse, type CourseLevel, COURSE_LEVEL_LABELS } from "@/app/_lib/admin"
import { apiErrorMessage, createCourse, updateCourse } from "@/app/_lib/admin-api"
import { onlyPositiveInt } from "@/app/_lib/masks"

const NIVEIS: CourseLevel[] = ["basico", "intermediario", "avancado"]

// Transforma "Inglês Básico!" em "ingles-basico" (mesmo formato do slug validado no back).
function slugify(texto: string): string {
    return texto
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "") // tira acentos (marcas combinantes)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}

export function CourseFormDialog({
    open,
    onOpenChange,
    editing,
    onSaved,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    editing: AdminCourse | null
    onSaved: () => void
}) {
    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")
    const [slugTouched, setSlugTouched] = useState(false)
    const [description, setDescription] = useState("")
    const [level, setLevel] = useState<CourseLevel>("basico")
    const [orderNum, setOrderNum] = useState("0")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open) return
        setTitle(editing?.title ?? "")
        setSlug(editing?.slug ?? "")
        setSlugTouched(!!editing) // na edição, não sobrescreve o slug ao digitar o título
        setDescription(editing?.description ?? "")
        setLevel(editing?.level ?? "basico")
        setOrderNum(String(editing?.order_num ?? 0))
        setError("")
    }, [open, editing])

    // Ao criar, o slug acompanha o título até o admin editá-lo manualmente.
    function handleTitle(v: string) {
        setTitle(v)
        if (!slugTouched) setSlug(slugify(v))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)
        const payload = {
            slug: slug.trim(),
            title: title.trim(),
            description: description.trim(),
            level,
            order_num: Number(orderNum) || 0,
        }
        try {
            if (editing) {
                await updateCourse(editing.id, payload)
                toast.success("Curso atualizado com sucesso.")
            } else {
                await createCourse(payload)
                toast.success("Curso criado com sucesso.")
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
                <DialogTitle>{editing ? "Editar curso" : "Novo curso"}</DialogTitle>
                <DialogDescription>
                    {editing
                        ? "Edite os dados deste curso."
                        : "Cadastre um novo curso. As aulas são gerenciadas à parte."}
                </DialogDescription>

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="course-title">Título</Label>
                        <Input
                            id="course-title"
                            value={title}
                            onChange={(e) => handleTitle(e.target.value)}
                            placeholder="Inglês Básico"
                            maxLength={100}
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="course-slug">Slug (URL)</Label>
                        <Input
                            id="course-slug"
                            value={slug}
                            onChange={(e) => {
                                setSlugTouched(true)
                                setSlug(e.target.value)
                            }}
                            placeholder="ingles-basico"
                            maxLength={50}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="course-description">Descrição</Label>
                        <textarea
                            id="course-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Do que se trata este curso…"
                            rows={3}
                            className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-1 flex-col gap-1.5">
                            <Label htmlFor="course-level">Nível</Label>
                            <Select value={level} onValueChange={(v) => setLevel(v as CourseLevel)}>
                                <SelectTrigger id="course-level" className="h-9 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {NIVEIS.map((n) => (
                                        <SelectItem key={n} value={n}>
                                            {COURSE_LEVEL_LABELS[n]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex w-28 flex-col gap-1.5">
                            <Label htmlFor="course-order">Ordem</Label>
                            <Input
                                id="course-order"
                                type="number"
                                min={0}
                                value={orderNum}
                                onChange={(e) => setOrderNum(onlyPositiveInt(e.target.value))}
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando…" : editing ? "Salvar" : "Criar curso"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
