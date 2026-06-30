"use client"

import { useEffect, useState } from "react"

// Tema da interface — persiste em localStorage
export type Appearance = "light" | "dark" | "system"

const STORAGE_KEY = "fluencylab-appearance"

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>("system")

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) as Appearance | null
        if (stored) setAppearance(stored)
    }, [])

    function updateAppearance(value: Appearance) {
        setAppearance(value)
        localStorage.setItem(STORAGE_KEY, value)
        const root = document.documentElement
        root.classList.remove("light", "dark")
        if (value !== "system") root.classList.add(value)
    }

    return { appearance, updateAppearance }
}
