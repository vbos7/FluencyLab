import { fetchFromApi } from "@/app/_lib/server-api"
import { PracticeController } from "@/app/_components/practice/practice-controller"
import NavLayout from "@/app/_layouts/nav-layout"

type Phrase = { id: number; pt: string; en: string; difficulty: string; category: string }

export default async function PracticePage() {
    const [phrases, planStatus] = await Promise.all([
        fetchFromApi<Phrase[]>("/practice/phrases.php"),
        fetchFromApi<{ active: boolean }>("/my-plan.php").catch(() => ({ active: false })),
    ])

    return (
        <NavLayout>
            <PracticeController phrases={phrases} isPremium={planStatus.active} />
        </NavLayout>
    )
}