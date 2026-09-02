"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import AppLayout from "@/app/_layouts/app-layout"
import { type BreadcrumbItem } from "@/app/_lib/utils"
import { type AdminUser } from "@/app/_lib/admin"
import { apiErrorMessage, deleteUser, listUsers } from "@/app/_lib/admin-api"
import { cn } from "@/app/_lib/utils"
import { CardContainer } from "@/app/_components/admin/profile/card-container"
import { Button } from "@/app/_components/ui/button"
import { UserFormDialog } from "@/app/_components/admin/users/user-form-dialog"
import { ConfirmDialog } from "@/app/_components/admin/confirm-dialog"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Usuários", href: "/admin/usuarios" },
]

function levelColor(level: number) {
    if (level >= 15) return "bg-amber-100 text-amber-700"
    if (level >= 10) return "bg-blue-100 text-blue-700"
    if (level >= 5) return "bg-violet-100 text-violet-700"
    return "bg-slate-100 text-slate-600"
}

function initials(name: string) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
}

// Backend devolve datetime "YYYY-MM-DD HH:MM:SS".
function fmtDate(dt: string) {
    const d = new Date(dt.replace(" ", "T"))
    return isNaN(d.getTime()) ? dt : d.toLocaleDateString("pt-BR")
}

export default function UsuariosPage() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<AdminUser | null>(null)
    const [toDelete, setToDelete] = useState<AdminUser | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError("")
        try {
            setUsers(await listUsers())
        } catch (err) {
            setError(apiErrorMessage(err, "Não foi possível carregar os usuários."))
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

    function openEdit(user: AdminUser) {
        setEditing(user)
        setFormOpen(true)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6 md:p-10">
                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Usuários</h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            {loading ? "Carregando…" : `${users.length} usuários cadastrados`}
                        </p>
                    </div>
                    <Button className="shrink-0" onClick={openCreate}>
                        + Novo usuário
                    </Button>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Tabela */}
                <CardContainer title="Todos os usuários">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-200 bg-slate-50 text-xs tracking-wide text-slate-600 uppercase dark:border-white/8 dark:bg-white/3">
                                    <th className="px-5 py-3 text-left">Usuário</th>
                                    <th className="px-5 py-3 text-left">Papel</th>
                                    <th className="px-5 py-3 text-left">Nível</th>
                                    <th className="px-5 py-3 text-right">XP</th>
                                    <th className="px-5 py-3 text-left">Cadastro</th>
                                    <th className="px-5 py-3 text-center">Status</th>
                                    <th className="px-5 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && users.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-10 text-center text-slate-400"
                                        >
                                            Nenhum usuário cadastrado.
                                        </td>
                                    </tr>
                                )}
                                {users.map((user, i) => (
                                    <tr
                                        key={user.id}
                                        className={cn(
                                            "border-b border-neutral-100 transition-colors hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/3",
                                            i === users.length - 1 && "border-b-0"
                                        )}
                                    >
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                                    {initials(user.name)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-3">
                                            <span
                                                className={cn(
                                                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                                    user.role === "admin"
                                                        ? "bg-indigo-100 text-indigo-700"
                                                        : "bg-slate-100 text-slate-600"
                                                )}
                                            >
                                                {user.role === "admin" ? "Admin" : "Aluno"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3">
                                            <span
                                                className={cn(
                                                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                                    levelColor(user.level)
                                                )}
                                            >
                                                Nível {user.level}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 text-right font-mono font-semibold text-slate-700">
                                            {user.xp.toLocaleString("pt-BR")}
                                        </td>

                                        <td className="px-5 py-3 text-slate-600">
                                            {fmtDate(user.createdAt)}
                                        </td>

                                        <td className="px-5 py-3 text-center">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                                    user.isActive
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-slate-100 text-slate-600"
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        "size-1.5 rounded-full",
                                                        user.isActive
                                                            ? "bg-emerald-500"
                                                            : "bg-slate-400"
                                                    )}
                                                />
                                                {user.isActive ? "Ativo" : "Inativo"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(user)}
                                                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => setToDelete(user)}
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

            <UserFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                editing={editing}
                onSaved={load}
            />

            <ConfirmDialog
                open={!!toDelete}
                onOpenChange={(v) => !v && setToDelete(null)}
                title="Remover usuário?"
                description={`Isso apagará permanentemente ${toDelete?.name ?? "este usuário"} e todos os dados associados.`}
                confirmLabel="Remover"
                onConfirm={async () => {
                    if (!toDelete) return
                    try {
                        await deleteUser(toDelete.id)
                        toast.success("Usuário removido.")
                        await load()
                    } catch (err) {
                        toast.error(apiErrorMessage(err, "Não foi possível remover o usuário."))
                        throw err
                    }
                }}
            />
        </AppLayout>
    )
}
