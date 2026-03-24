"use client"

import { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import { type User } from '@/app/_lib/utils'
import { CardRow } from './card-row'

// Gera iniciais do nome
function initials(name: string) {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('')
}

export function AvatarUpload({ user }: { user: User }) {
    const [preview, setPreview] = useState<string | null>(
        user.avatar
            ? user.avatar.startsWith('http') ? user.avatar : `/storage/${user.avatar}`
            : null
    )

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        // Pré-visualização local
        const url = URL.createObjectURL(file)
        setPreview(url)
        // TODO: POST /api/admin/profile/avatar (multipart/form-data)
        e.target.value = ''
    }

    return (
        <CardRow label="Foto de perfil" description="PNG ou JPEG, máx. 2 MB">
            <div className="flex items-center gap-3">
                {/* Avatar atual ou iniciais */}
                {preview ? (
                    <img
                        src={preview}
                        alt={user.name}
                        className="size-10 rounded-full object-cover ring-2 ring-slate-100"
                    />
                ) : (
                    <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
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
                    />
                    <Button variant="outline" size="sm" asChild>
                        <span>Atualizar</span>
                    </Button>
                </label>
            </div>
        </CardRow>
    )
}
