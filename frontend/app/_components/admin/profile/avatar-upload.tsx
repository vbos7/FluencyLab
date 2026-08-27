"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/app/_components/ui/button"
import { type User } from "@/app/_lib/utils"
import { apiErrorMessage, deleteAvatar, uploadAvatar } from "@/app/_lib/admin-api"
import { CardRow } from "./card-row"

// Gera iniciais do nome
function initials(name: string) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
}

// /profile.php já devolve o avatar como URL absoluta; usa direto.
export function AvatarUpload({ user, onUpdated }: { user: User; onUpdated?: () => void }) {
    const [preview, setPreview] = useState<string | null>(user.avatar ?? null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        e.target.value = ""
        if (!file) return

        setError("")
        setLoading(true)
        try {
            const url = await uploadAvatar(file)
            setPreview(url)
            toast.success("Foto de perfil atualizada.")
            onUpdated?.()
        } catch (err) {
            setError(apiErrorMessage(err, "Falha ao enviar a imagem."))
        } finally {
            setLoading(false)
        }
    }

    async function handleRemove() {
        setError("")
        setLoading(true)
        try {
            await deleteAvatar()
            setPreview(null)
            toast.success("Foto de perfil removida.")
            onUpdated?.()
        } catch (err) {
            setError(apiErrorMessage(err, "Falha ao remover a imagem."))
        } finally {
            setLoading(false)
        }
    }

    return (
        <CardRow label="Foto de perfil" description="PNG ou JPEG, máx. 2 MB">
            <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-3">
                    {/* Avatar atual ou iniciais */}
                    {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={preview}
                            alt={user.name}
                            className="size-10 rounded-full object-cover ring-2 ring-slate-100"
                        />
                    ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                            {initials(user.name)}
                        </div>
                    )}

                    <label htmlFor="avatar-upload" className="cursor-pointer">
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <Button variant="outline" size="sm" asChild disabled={loading}>
                            <span>{loading ? "Enviando…" : "Atualizar"}</span>
                        </Button>
                    </label>

                    {preview && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemove}
                            disabled={loading}
                            className="text-red-500 hover:text-red-600"
                        >
                            Remover
                        </Button>
                    )}
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        </CardRow>
    )
}
