import { fetchFromApi } from "@/app/_lib/server-api"
import { PracticeController } from "@/app/_components/practice/practice-controller"
import NavLayout from "@/app/_layouts/nav-layout"

type Phrase = { id: number; pt: string; en: string; difficulty: string; category: string }

export default async function PracticePage() {
    const phrases = await fetchFromApi<Phrase[]>("/practice/phrases.php")

    return (
        <NavLayout>
            <PracticeController phrases={phrases} />
        </NavLayout>
    )
}
