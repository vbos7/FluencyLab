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
import type { AdminUser } from "@/app/_lib/admin"
import { apiErrorMessage, createUser, updateUser } from "@/app/_lib/admin-api"

type Role = "student" | "admin"

// Diálogo de criar/editar usuário.
//   editing = null  → criação (pede nome, email, senha, papel)
//   editing = user  → edição (backend só aceita alterar nome e papel)
export function UserFormDialog({
    open,
    onOpenChange,
    editing,
    onSaved,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    editing: AdminUser | null
    onSaved: () => void
}) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState<Role>("student")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    // Sempre que abrir, sincroniza os campos com o usuário em edição (ou limpa).
    useEffect(() => {
        if (!open) return
        setName(editing?.name ?? "")
        setEmail(editing?.email ?? "")
        setRole(editing?.role ?? "student")
        setPassword("")
        setError("")
    }, [open, editing])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            if (editing) {
                await updateUser(editing.id, { name, role })
                toast.success("Usuário atualizado com sucesso.")
            } else {
                await createUser({ name, email, password, role })
                toast.success("Usuário criado com sucesso.")
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
                <DialogTitle>{editing ? "Editar usuário" : "Novo usuário"}</DialogTitle>
                <DialogDescription>
                    {editing
                        ? "Atualize o nome ou o papel deste usuário."
                        : "Cadastre um novo usuário na plataforma."}
                </DialogDescription>

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-name">Nome</Label>
                        <Input
                            id="user-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome completo"
                            autoFocus
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-email">E-mail</Label>
                        <Input
                            id="user-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@email.com"
                            disabled={!!editing}
                        />
                        {editing && (
                            <p className="text-xs text-slate-400">
                                O e-mail não pode ser alterado por aqui.
                            </p>
                        )}
                    </div>

                    {!editing && (
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="user-password">Senha</Label>
                            <Input
                                id="user-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                autoComplete="new-password"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="user-role">Papel</Label>
                        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                            <SelectTrigger id="user-role" className="h-9 w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="student">Aluno</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando…" : editing ? "Salvar" : "Criar usuário"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
