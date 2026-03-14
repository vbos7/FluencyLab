import { FRASES } from "@/app/_lib/practice"
import { PracticeController } from "@/app/_components/practice/practice-controller"

export default function PracticePage() {
    // FRASES é um array de arrays — .flat() achata para um único array indexável
    const phrases = FRASES.flat()

    return <PracticeController phrases={phrases} />
}
