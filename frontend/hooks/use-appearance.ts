"use client"

import { useSyncExternalStore } from "react"

// Tema da interface — persiste em localStorage
export type Appearance = "light" | "dark" | "system"

const STORAGE_KEY = "fluencylab-appearance"
const CHANGE_EVENT = "fluencylab-appearance-change"

// Lê o tema salvo sem efeito: o React assina o localStorage (e as outras abas)
// e usa "system" no servidor.
function subscribe(callback: () => void) {
    window.addEventListener("storage", callback)
    window.addEventListener(CHANGE_EVENT, callback)
    return () => {
        window.removeEventListener("storage", callback)
        window.removeEventListener(CHANGE_EVENT, callback)
    }
}

function getSnapshot(): Appearance {
    return (localStorage.getItem(STORAGE_KEY) as Appearance | null) ?? "system"
}

export function useAppearance() {
    const appearance = useSyncExternalStore(subscribe, getSnapshot, () => "system" as Appearance)

    function updateAppearance(value: Appearance) {
        localStorage.setItem(STORAGE_KEY, value)
        window.dispatchEvent(new Event(CHANGE_EVENT))
        const root = document.documentElement
        root.classList.remove("light", "dark")
        if (value !== "system") root.classList.add(value)
    }

    return { appearance, updateAppearance }
}
