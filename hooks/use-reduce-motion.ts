"use client"

import { useCallback, useEffect, useState } from "react"

const KEY = "fluency-lab:reduceMotion"

function applyClass(enabled: boolean) {
    document.documentElement.classList.toggle("reduce-motion", enabled)
}

export function useReduceMotion() {
    const [enabled, setEnabled] = useState(false)

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
