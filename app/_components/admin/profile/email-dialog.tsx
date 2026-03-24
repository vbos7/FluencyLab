"use client"

import { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { Label } from '@/app/_components/ui/label'
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogTitle,
} from '@/app/_components/ui/dialog'
import { type User } from '@/app/_lib/utils'
import { CardRow } from './card-row'

export function EmailRow({ user }: { user: User }) {
    const [open,     setOpen]     = useState(false)
    const [email,    setEmail]    = useState(user.email)
    const [loading,  setLoading]  = useState(false)
    const [error,    setError]    = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        if (email === user.email) return
        setLoading(true)
        // TODO: PATCH /api/admin/profile/email
        await new Promise(r => setTimeout(r, 800))
        setLoading(false)
        setOpen(false)
    }

    return (
        <>
            <CardRow label="E-mail">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-700">{user.email}</span>
                    <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                        Atualizar
                    </Button>
                </div>
            </CardRow>

            <Dialog open={open} onOpenChange={v => { if (!v) { setEmail(user.email); setError('') } setOpen(v) }}>
                <DialogContent>
                    <DialogTitle>Alterar e-mail</DialogTitle>
                    <DialogDescription>Insira o novo endereço de e-mail para sua conta.</DialogDescription>
                    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="new-email">Novo e-mail</Label>
                            <Input
                                id="new-email"
                                type="email"
                                autoComplete="email"
                                placeholder="novo@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoFocus
                            />
                            {error && <p className="text-xs text-red-500">{error}</p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading || email === user.email || !email}>
                                {loading ? 'Salvando…' : 'Salvar e-mail'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
