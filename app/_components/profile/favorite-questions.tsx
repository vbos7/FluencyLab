"use client"

import { useState, useEffect } from "react"
import { Star, ChevronDown } from "lucide-react"
import { FRASES, DIFFICULTY_STYLES, DIFFICULTY_LABELS } from "@/app/_lib/practice"

const ALL_PHRASES = FRASES.flat()

export function FavoriteQuestions() {
    const [open, setOpen] = useState(false)
    // Lazy initializer evita setState síncrono dentro de useEffect
    const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
        if (typeof window === "undefined") return []
        try {
            const stored = localStorage.getItem("fluency-lab:favorites")
            return stored ? JSON.parse(stored) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        // Escuta mudanças no storage (caso outra aba atualize)
        function onStorage(e: StorageEvent) {
            if (e.key !== "fluency-lab:favorites") return
            try {
                setFavoriteIds(e.newValue ? JSON.parse(e.newValue) : [])
            } catch {
                // ignora
            }
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [])

    function remove(id: number) {
        const next = favoriteIds.filter((f) => f !== id)
        setFavoriteIds(next)
        localStorage.setItem("fluency-lab:favorites", JSON.stringify(next))
    }

    const phrases = ALL_PHRASES.filter((p) => favoriteIds.includes(p.id))

    return (
        <div className="rounded-2xl border border-[#dce8ff] bg-white shadow-[0_2px_16px_rgba(37,99,235,0.08)]">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-4"
            >
                <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-base font-semibold text-[#1e293b]">Frases Favoritas</span>
                    <span className="rounded-full bg-[#dbeafe] px-2 py-0.5 text-xs font-semibold text-[#2563eb]">
                        {phrases.length}
                    </span>
                </div>
                <ChevronDown
                    className="h-5 w-5 text-[#94a3b8] transition-transform duration-200"
                    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                />
            </button>

            {open && (
                <div className="flex flex-col gap-3 px-5 pb-5" style={{ animation: "fadeUp 0.2s ease" }}>
                    {phrases.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-[#94a3b8]">
                            <Star className="size-5 text-slate-300" aria-hidden="true" />
                            <span>Nenhuma frase favoritada ainda. Toque no ícone de estrela durante a prática!</span>
                        </div>
                    ) : (
                        phrases.map((p) => (
                            <div
                                key={p.id}
                                className="rounded-xl border border-[#e8f0fe] bg-[#f8faff] p-4"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <p className="mb-1 text-sm font-semibold text-[#1e293b]">{p.pt}</p>
                                        <p className="text-sm text-[#2563eb]">{p.en}</p>
                                    </div>
                                    <button
                                        onClick={() => remove(p.id)}
                                        className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-[#fef3c7]"
                                        aria-label="Remover dos favoritos"
                                    >
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${DIFFICULTY_STYLES[p.difficulty]}`}
                                    >
                                        {DIFFICULTY_LABELS[p.difficulty]}
                                    </span>
                                    <span className="text-[11px] text-[#94a3b8]">{p.category}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
