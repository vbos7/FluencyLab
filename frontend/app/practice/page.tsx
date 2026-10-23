import { fetchFromApi, getCurrentUser } from "@/app/_lib/server-api"
import { PracticeController } from "@/app/_components/practice/practice-controller"
import NavLayout from "@/app/_layouts/nav-layout"

type Phrase = { id: number; pt: string; en: string; difficulty: string; category: string }

export default async function PracticePage() {
    const [phrases, planStatus, user] = await Promise.all([
        fetchFromApi<Phrase[]>("/practice/phrases.php"),
        fetchFromApi<{ active: boolean }>("/my-plan.php").catch(() => ({ active: false })),
        getCurrentUser(),
    ])

    // Convidado = sem sessão no backend (mesma regra do check-answer.php). Não
    // depende de nada guardado no navegador, então quem cria conta ou entra deixa
    // de ser convidado na hora.
    return (
        <NavLayout>
            <PracticeController
                phrases={phrases}
                isPremium={planStatus.active}
                isGuest={!user}
            />
        </NavLayout>
    )
}
