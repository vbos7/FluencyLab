import { useSyncExternalStore } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(callback: () => void) {
    const mql = window.matchMedia(QUERY)
    mql.addEventListener("change", callback)
    return () => mql.removeEventListener("change", callback)
}

// true quando o usuário pediu redução de movimento nas configurações do sistema.
// Usa useSyncExternalStore (sem useEffect + setState) e assume "false" no servidor.
export function usePrefersReducedMotion(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(QUERY).matches,
        () => false
    )
}
