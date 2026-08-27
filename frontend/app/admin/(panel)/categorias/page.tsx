"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/app/_layouts/app-layout"
import { type BreadcrumbItem } from "@/app/_lib/utils"
import { type AdminCategory } from "@/app/_lib/admin"
import {
    apiErrorMessage,
    deleteCategory,
    listCategories,
} from "@/app/_lib/admin-api"
import { cn } from "@/app/_lib/utils"
import { CardContainer } from "@/app/_components/admin/profile/card-container"
import { Button } from "@/app/_components/ui/button"
import { CategoryFormDialog } from "@/app/_components/admin/categories/category-form-dialog"
import { ConfirmDialog } from "@/app/_components/admin/confirm-dialog"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Categorias", href: "/admin/categorias" },
]

export default function CategoriasPage() {
    const [categories, setCategories] = useState<AdminCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<AdminCategory | null>(null)
    const [toDelete, setToDelete] = useState<AdminCategory | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            setCategories(await listCategories())
        } catch (err) {
            setError(apiErrorMessage(err, "Não foi possível carregar as categorias."))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    function openCreate() {
        setEditing(null)
        setFormOpen(true)
    }

    function openEdit(category: AdminCategory) {
        setEditing(category)
        setFormOpen(true)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 md:p-10">
                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Categorias</h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            {loading
                                ? "Carregando…"
                                : `${categories.length} categorias cadastradas`}
                        </p>
                    </div>
                    <Button className="shrink-0" onClick={openCreate}>
                        + Nova categoria
                    </Button>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Tabela */}
                <CardContainer title="Todas as categorias">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-200 bg-slate-50 text-xs tracking-wide text-slate-600 uppercase dark:border-white/8 dark:bg-white/3">
                                    <th className="px-5 py-3 text-left">Categoria</th>
                                    <th className="px-5 py-3 text-right">Frases</th>
                                    <th className="px-5 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && categories.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-5 py-10 text-center text-slate-400"
                                        >
                                            Nenhuma categoria cadastrada.
                                        </td>
                                    </tr>
                                )}
                                {categories.map((category, i) => (
                                    <tr
                                        key={category.id}
                                        className={cn(
                                            "border-b border-neutral-100 transition-colors hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/3",
                                            i === categories.length - 1 && "border-b-0"
                                        )}
                                    >
                                        <td className="px-5 py-3 font-medium text-slate-800">
                                            {category.name}
                                        </td>

                                        <td className="px-5 py-3 text-right font-mono font-semibold text-slate-700">
                                            {category.phrase_count.toLocaleString("pt-BR")}
                                        </td>

                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(category)}
                                                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => setToDelete(category)}
                                                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContainer>
            </div>

            <CategoryFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                editing={editing}
                onSaved={load}
            />

            <ConfirmDialog
                open={!!toDelete}
                onOpenChange={(v) => !v && setToDelete(null)}
                title="Remover categoria?"
                description={`Isso apagará a categoria ${toDelete?.name ?? ""}. Categorias em uso por frases não podem ser removidas.`}
                confirmLabel="Remover"
                onConfirm={async () => {
                    if (!toDelete) return
                    try {
                        await deleteCategory(toDelete.id)
                        toast.success("Categoria removida.")
                        await load()
                    } catch (err) {
                        toast.error(apiErrorMessage(err, "Não foi possível remover a categoria."))
                        throw err
                    }
                }}
            />
        </AppLayout>
    )
}
