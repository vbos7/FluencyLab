"use client"

import { useCallback, useEffect, useState } from "react"

export type FontSize = "normal" | "large"

const KEY = "fluency-lab:fontSize"

function applyClass(size: FontSize) {
    document.documentElement.classList.toggle("font-large", size === "large")
}

export function useFontSize() {
    // Lazy initializer evita setState síncrono dentro de useEffect
    const [fontSize, setFontSize] = useState<FontSize>(() => {
        if (typeof window === "undefined") return "normal"
        return (localStorage.getItem(KEY) as FontSize) || "normal"
    })

    // Aplica a classe sempre que o valor mudar (inclusive na montagem)
    useEffect(() => {
        applyClass(fontSize)
    }, [fontSize])

    const toggle = useCallback((value: FontSize) => {
        setFontSize(value)
        localStorage.setItem(KEY, value)
    }, [])

    return { fontSize, toggle }
}
