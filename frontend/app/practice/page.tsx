import { fetchFromApi } from "@/app/_lib/server-api"
import { PracticeController } from "@/app/_components/practice/practice-controller"
import NavLayout from "@/app/_layouts/nav-layout"

type Phrase = { id: number; pt: string; en: string; difficulty: string; category: string }

export default async function PracticePage() {
    const [phrases, premium] = await Promise.all([
        fetchFromApi<Phrase[]>("/practice/phrases.php"),
        fetchFromApi<{ is_pro: boolean }>("/user/premium.php"),
    ])

    return (
        <NavLayout>
            <PracticeController phrases={phrases} isPro={premium.is_pro} />
        </NavLayout>
    )
}
