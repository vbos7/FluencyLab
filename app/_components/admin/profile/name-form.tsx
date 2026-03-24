"use client"

import { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { type User } from '@/app/_lib/utils'

export function NameForm({ user }: { user: User }) {
    const [name,       setName]       = useState(user.name)
    const [loading,    setLoading]    = useState(false)
    const [saved,      setSaved]      = useState(false)

    const isDirty = name !== user.name

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!isDirty) return
        setLoading(true)
        // TODO: PATCH /api/admin/profile/name
        await new Promise(r => setTimeout(r, 800))
        setLoading(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return (
        <div className="flex flex-col gap-3 py-3 pr-2.5 pl-4">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-between gap-4 md:min-h-9">
                    <h3 className="text-sm leading-tight shrink-0">Nome completo</h3>
                    <div className="flex max-w-[60%] grow items-center justify-end gap-2">
                        <Input
                            placeholder="Seu nome completo"
                            required
                            autoComplete="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="h-9 w-full"
                        />
                        {isDirty && (
                            <Button size="sm" type="submit" disabled={loading} className="shrink-0">
                                {loading ? 'Salvando…' : saved ? 'Salvo!' : 'Salvar'}
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}
