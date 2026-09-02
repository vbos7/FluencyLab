"use client"

import { useState } from "react"
import { Button } from "@/app/_components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/app/_components/ui/dialog"

// Diálogo de confirmação reutilizável (ex.: excluir usuário/frase).
// onConfirm pode ser assíncrono; o botão mostra estado de carregamento e o
// diálogo só fecha quando a ação termina sem erro.
export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirmar",
    onConfirm,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    title: string
    description: string
    confirmLabel?: string
    onConfirm: () => Promise<void> | void
}) {
    const [loading, setLoading] = useState(false)

    async function handleConfirm() {
        setLoading(true)
        try {
            await onConfirm()
            onOpenChange(false)
        } catch {
            // O chamador é responsável por avisar o erro (ex.: toast); mantemos o
            // diálogo aberto para permitir nova tentativa.
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
                        {loading ? "Removendo…" : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
