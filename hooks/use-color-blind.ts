"use client"

import { useCallback, useEffect, useState } from "react"

const KEY = "fluency-lab:colorBlind"

function applyClass(enabled: boolean) {
    document.documentElement.classList.toggle("colorblind", enabled)
}

export function useColorBlind() {
    const [enabled, setEnabled] = useState(false)

    // Inicializa a partir do localStorage na montagem
    useEffect(() => {
        const stored = localStorage.getItem(KEY) === "true"
        setEnabled(stored)
        applyClass(stored)
    }, [])

    const toggle = useCallback((value: boolean) => {
        setEnabled(value)
        localStorage.setItem(KEY, String(value))
        applyClass(value)
    }, [])

    return { enabled, toggle }
}
