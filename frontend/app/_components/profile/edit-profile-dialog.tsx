"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/app/_components/ui/dialog"

type Props = {
    initialName: string
    initialEmail?: string
}

const inputClass =
    "w-full border border-[#dce8ff] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2563eb] transition-colors"

const labelClass =
    "block text-[10px] sm:text-xs font-bold text-[#7a94b8] uppercase tracking-wide mb-1"

export function EditProfileDialog({ initialName, initialEmail = "" }: Props) {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        nome: initialName,
        email: initialEmail,
        telefone: "",
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    function handleSave() {
        // TODO: chamada de API
        console.log("Dados salvos:", form)
        setOpen(false)
    }

    return (
        <>
            {/* Trigger */}
            <button
                onClick={() => setOpen(true)}
                className="hover-lift rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-bold text-white hover:bg-[#1d4ed8] sm:px-5 sm:py-2.5 sm:text-sm"
            >
                Editar Perfil
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md rounded-2xl p-6 sm:rounded-3xl sm:p-8">
                    <DialogHeader>
                        <DialogTitle className="text-base font-extrabold text-[#1e293b] sm:text-lg">
                            Editar Perfil
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-1 flex flex-col gap-3">
                        {/* Dados pessoais */}
                        <div>
                            <label className={labelClass}>Nome</label>
                            <input
                                type="text"
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>E-mail</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="seu@email.com"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Telefone</label>
                            <input
                                type="tel"
                                name="telefone"
                                value={form.telefone}
                                onChange={handleChange}
                                placeholder="+55 11 99999-9999"
                                className={inputClass}
                            />
                        </div>

                        {/* Trocar senha */}
                        <div className="flex flex-col gap-2.5 border-t border-[#dce8ff] pt-3 sm:gap-3 sm:pt-4">
                            <p className={labelClass}>Trocar Senha</p>
                            <input
                                type="password"
                                name="senhaAtual"
                                value={form.senhaAtual}
                                onChange={handleChange}
                                placeholder="Senha atual"
                                className={inputClass}
                            />
                            <input
                                type="password"
                                name="novaSenha"
                                value={form.novaSenha}
                                onChange={handleChange}
                                placeholder="Nova senha"
                                className={inputClass}
                            />
                            <input
                                type="password"
                                name="confirmarSenha"
                                value={form.confirmarSenha}
                                onChange={handleChange}
                                placeholder="Confirmar nova senha"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="mt-1 flex gap-2.5 sm:gap-3">
                        <DialogClose asChild>
                            <button className="flex-1 rounded-xl border border-[#dce8ff] py-2 text-xs font-bold text-[#7a94b8] transition-colors hover:bg-[#f0f4ff] active:scale-95 sm:py-2.5 sm:text-sm">
                                Cancelar
                            </button>
                        </DialogClose>
                        <button
                            onClick={handleSave}
                            className="flex-1 rounded-xl bg-[#2563eb] py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.30)] transition-colors hover:bg-[#1d4ed8] active:scale-95 sm:py-2.5 sm:text-sm"
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
