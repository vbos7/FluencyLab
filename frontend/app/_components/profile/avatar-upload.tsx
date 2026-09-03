"use client"

import { useState, useRef } from "react"
import { Camera, Loader2, Upload } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/app/_components/ui/dialog"
import { Button } from "@/app/_components/ui/button"
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/app/_components/ui/avatar"
import { apiClient } from "@/app/_lib/api"

type Props = {
    name: string
    avatarSrc?: string
}

export function AvatarUpload({ name, avatarSrc }: Props) {
    const [open, setOpen] = useState(false)
    const [avatarAtual, setAvatarAtual] = useState<string | undefined>(avatarSrc)
    const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | undefined>(avatarSrc)
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("")

    function handleSelecionarArquivo(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setErro(null)
        setArquivoSelecionado(file)
        setPreview(URL.createObjectURL(file)) // só preview local, ainda não envia nada
    }

    async function handleSalvar() {
        if (!arquivoSelecionado) return

        setErro(null)
        setEnviando(true)

        const formData = new FormData()
        formData.append('avatar', arquivoSelecionado)

        try {
            const res = await apiClient.post('/avatar-upload.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            console.log('Resposta avatar-upload.php:', res.data) // debug temporário

            if (res.data?.success) {
                const novaUrl = `${res.data.avatar_url}?t=${Date.now()}`
                setAvatarAtual(novaUrl)
                setPreview(novaUrl)
                setArquivoSelecionado(null)
                setOpen(false)
            } else {
                setErro('O servidor não confirmou o salvamento.')
            }
        } catch (err: any) {
            console.error('Erro no upload:', err.response?.data ?? err) // debug temporário
            setErro(err.response?.data?.error ?? 'Erro ao enviar imagem')
        } finally {
            setEnviando(false)
        }
    }

    function handleCancelar() {
        setPreview(avatarAtual)
        setArquivoSelecionado(null)
        setErro(null)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) handleCancelar(); else setOpen(true) }}>
            <div className="relative inline-block">
                <div
                    className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white shadow-[0_4px_16px_rgba(37,99,235,0.35)] sm:h-[88px] sm:w-[88px]"
                    style={{ background: "linear-gradient(135deg,#1d4ed8,#60a5fa)" }}
                >
                    <Avatar className="h-full w-full">
                        {avatarAtual && <AvatarImage src={avatarAtual} alt={name} />}
                        <AvatarFallback>{initials}</AvatarFallback>
                        <AvatarBadge className="bg-green-600" />
                    </Avatar>
                </div>

                <DialogTrigger asChild>
                    <button
                        type="button"
                        aria-label="Alterar foto de perfil"
                        className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md transition-all duration-150 hover:bg-blue-700 active:scale-90 sm:h-7 sm:w-7"
                    >
                        <Camera size={12} className="sm:hidden" />
                        <Camera size={14} className="hidden sm:block" />
                    </button>
                </DialogTrigger>
            </div>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Alterar foto de perfil</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center gap-4 py-4">
                    <div
                        className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white shadow-md"
                        style={{ background: "linear-gradient(135deg,#1d4ed8,#60a5fa)" }}
                    >
                        <Avatar className="h-full w-full">
                            {preview && <AvatarImage src={preview} alt={name} />}
                            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                        </Avatar>
                    </div>

                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        <Upload size={15} />
                        Escolher imagem
                    </button>

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleSelecionarArquivo}
                    />

                    {erro && (
                        <p className="text-sm text-red-500 text-center">{erro}</p>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="ghost" onClick={handleCancelar} disabled={enviando}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSalvar} disabled={!arquivoSelecionado || enviando}>
                        {enviando ? (
                            <>
                                <Loader2 size={15} className="animate-spin mr-1.5" />
                                Salvando...
                            </>
                        ) : (
                            "Salvar"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}