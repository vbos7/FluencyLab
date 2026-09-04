"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/app/_layouts/app-layout"
import { type BreadcrumbItem } from "@/app/_lib/utils"
import { DIFFICULTY_LABELS, DIFFICULTY_STYLES, type AdminPhrase } from "@/app/_lib/admin"
import { apiErrorMessage, deletePhrase, listPhrases } from "@/app/_lib/admin-api"
import { cn } from "@/app/_lib/utils"
import { CardContainer } from "@/app/_components/admin/profile/card-container"
import { Button } from "@/app/_components/ui/button"
import { PhraseFormDialog } from "@/app/_components/admin/phrases/phrase-form-dialog"
import { ConfirmDialog } from "@/app/_components/admin/confirm-dialog"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Frases", href: "/admin/frases" },
]

export default function FrasesPage() {
    const [phrases, setPhrases] = useState<AdminPhrase[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<AdminPhrase | null>(null)
    const [toDelete, setToDelete] = useState<AdminPhrase | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            setPhrases(await listPhrases())
        } catch (err) {
            setError(apiErrorMessage(err, "Não foi possível carregar as frases."))
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

    function openEdit(phrase: AdminPhrase) {
        setEditing(phrase)
        setFormOpen(true)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6 md:p-10">
                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Frases</h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            {loading ? "Carregando…" : `${phrases.length} frases cadastradas`}
                        </p>
                    </div>
                    <Button className="shrink-0" onClick={openCreate}>
                        + Nova frase
                    </Button>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Tabela */}
                <CardContainer title="Todas as frases">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-200 bg-slate-50 text-xs tracking-wide text-slate-600 uppercase dark:border-white/8 dark:bg-white/3">
                                    <th className="w-8 px-5 py-3 text-left">#</th>
                                    <th className="px-5 py-3 text-left">Inglês</th>
                                    <th className="px-5 py-3 text-left">Português</th>
                                    <th className="px-5 py-3 text-left">Dificuldade</th>
                                    <th className="px-5 py-3 text-left">Categoria</th>
                                    <th className="px-5 py-3 text-right">Praticada</th>
                                    <th className="px-5 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && phrases.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-10 text-center text-slate-400"
                                        >
                                            Nenhuma frase cadastrada.
                                        </td>
                                    </tr>
                                )}
                                {phrases.map((phrase, i) => (
                                    <tr
                                        key={phrase.id}
                                        className={cn(
                                            "border-b border-neutral-100 transition-colors hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/3",
                                            i === phrases.length - 1 && "border-b-0"
                                        )}
                                    >
                                        <td className="px-5 py-3 font-mono text-xs text-slate-500">
                                            {phrase.id}
                                        </td>

                                        <td className="max-w-xs px-5 py-3">
                                            <p className="truncate font-medium text-slate-800">
                                                {phrase.en}
                                            </p>
                                        </td>

                                        <td className="max-w-xs px-5 py-3">
                                            <p className="truncate text-slate-600">{phrase.pt}</p>
                                        </td>

                                        <td className="px-5 py-3">
                                            <span
                                                className={cn(
                                                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                                    DIFFICULTY_STYLES[phrase.difficulty]
                                                )}
                                            >
                                                {DIFFICULTY_LABELS[phrase.difficulty]}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                                                {phrase.category}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 text-right font-mono font-semibold text-slate-700">
                                            {phrase.total_attempts.toLocaleString("pt-BR")}×
                                        </td>

                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(phrase)}
                                                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => setToDelete(phrase)}
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

            <PhraseFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                editing={editing}
                onSaved={load}
            />

            <ConfirmDialog
                open={!!toDelete}
                onOpenChange={(v) => !v && setToDelete(null)}
                title="Remover frase?"
                description="Isso apagará a frase e todas as tentativas ligadas a ela."
                confirmLabel="Remover"
                onConfirm={async () => {
                    if (!toDelete) return
                    try {
                        await deletePhrase(toDelete.id)
                        toast.success("Frase removida.")
                        await load()
                    } catch (err) {
                        toast.error(apiErrorMessage(err, "Não foi possível remover a frase."))
                        throw err
                    }
                }}
            />
        </AppLayout>
    )
}
