import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

// Retorna `false` no servidor e `true` após montar no cliente. Serve para
// renderizar portais (createPortal no document.body) sem quebrar no SSR, sem
// precisar de useEffect + setState (que dispara a regra set-state-in-effect).
export function useMounted(): boolean {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    )
}
