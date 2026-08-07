"use client"

import { useState } from "react"
import axios from "axios"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/app/_components/ui/dialog"
import { apiClient } from "@/app/_lib/api"

type Props = {
    initialName: string
    initialEmail?: string
    initialPhone?: string
}

const inputClass =
    "w-full border border-[#dce8ff] rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#2563eb] transition-colors"

const labelClass =
    "block text-[10px] sm:text-xs font-bold text-[#7a94b8] uppercase tracking-wide mb-1"

export function EditProfileDialog({ initialName, initialEmail = "", initialPhone = "" }: Props) {
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState<string[]>([])
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        nome: initialName,
        email: initialEmail,
        telefone: initialPhone,
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSave() {
        setErrors([])
        setSaving(true)
        try {
            await apiClient.put("/profile.php", {
                name: form.nome,
                email: form.email,
                phone: form.telefone,
                // Campos de senha: o backend só troca a senha se new_password vier preenchido
                current_password: form.senhaAtual,
                new_password: form.novaSenha,
                new_password_confirmation: form.confirmarSenha,
            })
            setOpen(false)
            window.location.reload() // recarrega para mostrar os dados atualizados
        } catch (err) {
            // O PHP devolve { errors: [...] } com status 422 quando a validação falha
            if (axios.isAxiosError(err) && err.response?.data?.errors) {
                setErrors(err.response.data.errors)
            } else {
                setErrors(["Não foi possível salvar. Tente novamente."])
            }
        } finally {
            setSaving(false)
        }
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

                    {/* Erros de validação vindos do backend */}
                    {errors.length > 0 && (
                        <ul className="mt-1 flex flex-col gap-1 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                            {errors.map((e, i) => (
                                <li key={i}>• {e}</li>
                            ))}
                        </ul>
                    )}

                    {/* Ações */}
                    <div className="mt-1 flex gap-2.5 sm:gap-3">
                        <DialogClose asChild>
                            <button className="flex-1 rounded-xl border border-[#dce8ff] py-2 text-xs font-bold text-[#7a94b8] transition-colors hover:bg-[#f0f4ff] active:scale-95 sm:py-2.5 sm:text-sm">
                                Cancelar
                            </button>
                        </DialogClose>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 rounded-xl bg-[#2563eb] py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.30)] transition-colors hover:bg-[#1d4ed8] active:scale-95 disabled:opacity-60 sm:py-2.5 sm:text-sm"
                        >
                            {saving ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
