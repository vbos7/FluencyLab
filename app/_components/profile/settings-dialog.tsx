"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog"

type Toggle = {
    key: string
    label: string
    description: string
    defaultOn: boolean
}

const SETTINGS: Toggle[] = [
    {
        key: "sound",
        label: "Sons de feedback",
        description: "Toca um som ao verificar respostas certas ou erradas.",
        defaultOn: true,
    },
    {
        key: "notifications",
        label: "Lembretes diários",
        description: "Receba notificações para manter sua sequência de estudos.",
        defaultOn: true,
    },
    {
        key: "colorBlind",
        label: "Modo daltônico",
        description: "Substitui cores por padrões e ícones para diferenciar elementos visuais.",
        defaultOn: false,
    },
    {
        key: "reduceMotion",
        label: "Redução de movimento",
        description: "Desativa animações e transições para usuários sensíveis a movimento.",
        defaultOn: false,
    },
    {
        key: "vlibras",
        label: "Suporte a Libras (VLibras)",
        description: "Ativa o widget VLibras para tradução de conteúdo em Língua Brasileira de Sinais.",
        defaultOn: false,
    },
]

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => onChange(!on)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                on ? "bg-blue-600" : "bg-slate-200"
            }`}
        >
            <span
                className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                    on ? "translate-x-5" : "translate-x-0.5"
                }`}
            />
        </button>
    )
}

export function SettingsDialog() {
    const [open, setOpen] = useState(false)
    const [values, setValues] = useState<Record<string, boolean>>(
        Object.fromEntries(SETTINGS.map((s) => [s.key, s.defaultOn]))
    )

    function toggle(key: string, val: boolean) {
        setValues((prev) => ({ ...prev, [key]: val }))
        // TODO: persistir preferências via API ou localStorage
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
            >
                <Settings size={14} />
                Configurações
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md rounded-2xl p-6 sm:rounded-3xl sm:p-8">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-extrabold text-slate-900 sm:text-lg">
                            <Settings size={18} className="text-blue-600" />
                            Configurações
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-2 flex flex-col divide-y divide-slate-100">
                        {SETTINGS.map((s) => (
                            <div key={s.key} className="flex items-center justify-between gap-4 py-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-800">{s.label}</p>
                                    <p className="mt-0.5 text-xs text-slate-500">{s.description}</p>
                                </div>
                                <Switch on={values[s.key]} onChange={(v) => toggle(s.key, v)} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 flex justify-end">
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.30)] transition-colors hover:bg-blue-700 active:scale-95"
                        >
                            Salvar
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
