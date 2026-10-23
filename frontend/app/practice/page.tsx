import { cookies } from "next/headers"
import { fetchFromApi, getCurrentUser } from "@/app/_lib/server-api"
import { PracticeController } from "@/app/_components/practice/practice-controller"
import NavLayout from "@/app/_layouts/nav-layout"
import { PREF_CATEGORY, PREF_DIFFICULTY, PREF_GUEST_USED, sortearIndice } from "@/app/_lib/prefs"

type Phrase = { id: number; pt: string; difficulty: string; category: string }

const DIFICULDADES = ["easy", "medium", "hard"]

export default async function PracticePage() {
    const [phrases, planStatus, user, store] = await Promise.all([
        fetchFromApi<Phrase[]>("/practice/phrases.php"),
        fetchFromApi<{ active: boolean }>("/my-plan.php").catch(() => ({ active: false })),
        getCurrentUser(),
        cookies(),
    ])

    // Convidado = sem sessão no backend (mesma regra do check-answer.php). Não
    // depende de nada guardado no navegador, então quem cria conta ou entra deixa
    // de ser convidado na hora.
    const isGuest = !user
    const isPremium = planStatus.active

    // Preferências vêm de cookie: o servidor renderiza o mesmo que o navegador vai
    // mostrar, e a primeira frase já é sorteada aqui.
    const salva = store.get(PREF_DIFFICULTY)?.value ?? ""
    const difficulty = DIFICULDADES.includes(salva) ? salva : "medium"
    const category = store.get(PREF_CATEGORY)?.value ?? "all"
    const efetiva = isPremium ? category : "all"
    const total = phrases.filter(
        (p) => p.difficulty === difficulty && (efetiva === "all" || p.category === efetiva)
    ).length
    const guestUsed = isGuest
        ? Math.min(5, Math.max(0, Number(store.get(PREF_GUEST_USED)?.value) || 0))
        : 0

    return (
        <NavLayout>
            <PracticeController
                phrases={phrases}
                isPremium={isPremium}
                isGuest={isGuest}
                initialDifficulty={difficulty}
                initialCategory={category}
                initialIndex={sortearIndice(total)}
                initialGuestUsed={guestUsed}
            />
        </NavLayout>
    )
}
