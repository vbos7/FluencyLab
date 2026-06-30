"use client"

import { useCallback, useEffect, useState } from "react"

const KEY = "fluency-lab:reduceMotion"

function applyClass(enabled: boolean) {
    document.documentElement.classList.toggle("reduce-motion", enabled)
}

export function useReduceMotion() {
    // Lazy initializer evita setState síncrono dentro de useEffect
    const [enabled, setEnabled] = useState<boolean>(() => {
        if (typeof window === "undefined") return false
        return localStorage.getItem(KEY) === "true"
    })

    // Aplica a classe sempre que o valor mudar (inclusive na montagem)
    useEffect(() => {
        applyClass(enabled)
    }, [enabled])

    const toggle = useCallback((value: boolean) => {
        setEnabled(value)
        localStorage.setItem(KEY, String(value))
    }, [])

    return { enabled, toggle }
}
