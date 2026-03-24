"use client"

import { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from '@/app/_components/ui/dialog'
import { CardRow } from './card-row'

// Toggle switch estilizado
function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!enabled)}
            disabled={disabled}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
        >
            <span className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
        </button>
    )
}

export function TwoFactorRow() {
    const [enabled,    setEnabled]    = useState(false)
    const [setupOpen,  setSetupOpen]  = useState(false)
    const [disableOpen, setDisableOpen] = useState(false)
    const [loading,    setLoading]    = useState(false)

    async function handleEnable() {
        setLoading(true)
        // TODO: POST /api/admin/two-factor/enable
        await new Promise(r => setTimeout(r, 600))
        setLoading(false)
        setEnabled(true)
        setSetupOpen(true)
    }

    async function handleDisable() {
        setLoading(true)
        // TODO: DELETE /api/admin/two-factor
        await new Promise(r => setTimeout(r, 600))
        setLoading(false)
        setEnabled(false)
        setDisableOpen(false)
    }

    function handleToggle(value: boolean) {
        if (value) handleEnable()
        else setDisableOpen(true)
    }

    return (
        <>
            <CardRow
                label="Autenticação de dois fatores"
                description="Proteja sua conta com um código de verificação adicional no login"
            >
                <Toggle enabled={enabled} onChange={handleToggle} disabled={loading} />
            </CardRow>

            {/* Dialog de setup */}
            <Dialog open={setupOpen} onOpenChange={setSetupOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configurar autenticação 2FA</DialogTitle>
                        <DialogDescription>
                            Escaneie o QR code abaixo com seu aplicativo autenticador (Google Authenticator, Authy, etc.).
                        </DialogDescription>
                    </DialogHeader>

                    {/* Placeholder QR code */}
                    <div className="flex flex-col items-center gap-3 py-2">
                        <div className="size-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                            <p className="text-xs text-slate-400 text-center px-4">QR Code<br />(API necessária)</p>
                        </div>
                        <p className="text-xs text-slate-400">Ou insira o código manualmente no seu app</p>
                        <code className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-mono text-slate-700 tracking-widest">
                            XXXX-XXXX-XXXX-XXXX
                        </code>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={() => setSetupOpen(false)}>Concluído</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog de desativação */}
            <Dialog open={disableOpen} onOpenChange={setDisableOpen}>
                <DialogContent>
                    <DialogTitle>Desativar autenticação 2FA?</DialogTitle>
                    <DialogDescription>
                        Ao desativar, sua conta ficará protegida apenas por senha. Tem certeza?
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDisable} disabled={loading}>
                            {loading ? 'Desativando…' : 'Desativar 2FA'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
