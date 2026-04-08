"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog"
import { useColorBlind } from "@/hooks/use-color-blind"
import { useReduceMotion } from "@/hooks/use-reduce-motion"
import { useFontSize, type FontSize } from "@/hooks/use-font-size"

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
        description: "Substitui cores por padrões seguros para deuteranopia e protanopia (verde→ciano, vermelho→laranja).",
        defaultOn: false,
    },
    {
        key: "reduceMotion",
        label: "Redução de movimento",
        description: "Desativa animações e transições para usuários sensíveis a movimento.",
        defaultOn: false,
    },
]

function Switch({
    on,
    onChange,
    label,
}: {
    on: boolean
    onChange: (v: boolean) => void
    label: string
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label={label}
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

function FontSizeSelector({
    value,
    onChange,
}: {
    value: FontSize
    onChange: (v: FontSize) => void
}) {
    return (
        <div className="flex shrink-0 overflow-hidden rounded-lg border border-slate-200 text-xs font-bold">
            {(["normal", "large"] as FontSize[]).map((option) => (
                <button
                    key={option}
                    type="button"
                    onClick={() => onChange(option)}
                    className={`px-3 py-1.5 transition-colors ${
                        value === option
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                >
                    {option === "normal" ? "Normal" : "Grande"}
                </button>
            ))}
        </div>
    )
}

export function SettingsDialog() {
    const [open, setOpen] = useState(false)

    // Modo daltônico — persistido no localStorage e aplicado globalmente
    const { enabled: colorBlind, toggle: toggleColorBlind } = useColorBlind()

    // Redução de movimento — persistido no localStorage e aplicado globalmente
    const { enabled: reduceMotion, toggle: toggleReduceMotion } = useReduceMotion()

    // Tamanho de fonte — persistido no localStorage e aplicado globalmente
    const { fontSize, toggle: toggleFontSize } = useFontSize()

    // Demais toggles — in-memory por enquanto (sem efeito funcional ainda)
    const [values, setValues] = useState<Record<string, boolean>>(
        Object.fromEntries(
            SETTINGS
                .filter((s) => !["colorBlind", "reduceMotion"].includes(s.key))
                .map((s) => [s.key, s.defaultOn])
        )
    )

    function handleToggle(key: string, val: boolean) {
        if (key === "colorBlind") { toggleColorBlind(val); return }
        if (key === "reduceMotion") { toggleReduceMotion(val); return }
        setValues((prev) => ({ ...prev, [key]: val }))
    }

    function getValue(key: string): boolean {
        if (key === "colorBlind") return colorBlind
        if (key === "reduceMotion") return reduceMotion
        return values[key] ?? false
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="hover-lift flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 sm:px-5 sm:py-2.5 sm:text-sm"
            >
                <Settings size={14} aria-hidden="true" />
                Configurações
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md rounded-2xl p-6 sm:rounded-3xl sm:p-8">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base font-extrabold text-slate-900 sm:text-lg">
                            <Settings size={18} className="text-blue-600" aria-hidden="true" />
                            Configurações
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-2 flex flex-col divide-y divide-slate-100">
                        {/* Tamanho de fonte — seletor especial */}
                        <div className="flex items-center justify-between gap-4 py-4">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800">Tamanho da fonte</p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Aumenta o texto do site inteiro para facilitar a leitura.
                                </p>
                            </div>
                            <FontSizeSelector value={fontSize} onChange={toggleFontSize} />
                        </div>

                        {/* Demais toggles */}
                        {SETTINGS.map((s) => (
                            <div key={s.key} className="flex items-center justify-between gap-4 py-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-800">{s.label}</p>
                                    <p className="mt-0.5 text-xs text-slate-500">{s.description}</p>
                                </div>
                                <Switch
                                    on={getValue(s.key)}
                                    onChange={(v) => handleToggle(s.key, v)}
                                    label={s.label}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 flex justify-end">
                        <button
                            onClick={() => setOpen(false)}
                            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.30)] transition-colors hover:bg-blue-700 active:scale-95"
                        >
                            Fechar
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
