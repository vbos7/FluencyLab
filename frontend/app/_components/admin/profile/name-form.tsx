"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { type User } from "@/app/_lib/utils"
import { apiErrorMessage, updateProfile } from "@/app/_lib/admin-api"

export function NameForm({ user, onUpdated }: { user: User; onUpdated?: () => void }) {
    const [name, setName] = useState(user.name)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const isDirty = name !== user.name

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!isDirty) return
        setError("")
        setLoading(true)
        try {
            // O PUT /profile.php grava nome + email juntos; mantemos o email atual.
            await updateProfile({ name, email: user.email })
            toast.success("Nome atualizado.")
            onUpdated?.()
        } catch (err) {
            setError(apiErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-3 py-3 pr-2.5 pl-4">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between gap-4 md:min-h-9">
                    <h3 className="shrink-0 text-sm leading-tight">Nome completo</h3>
                    <div className="flex max-w-[60%] grow items-center justify-end gap-2">
                        <Input
                            placeholder="Seu nome completo"
                            required
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-9 w-full"
                        />
                        {isDirty && (
                            <Button size="sm" type="submit" disabled={loading} className="shrink-0">
                                {loading ? "Salvando…" : "Salvar"}
                            </Button>
                        )}
                    </div>
                </div>
                {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            </form>
        </div>
    )
}
