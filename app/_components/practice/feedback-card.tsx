import { ArrowRight } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { cn } from "@/app/_lib/utils"
import { type Feedback, FEEDBACK_STYLES } from "@/app/_lib/practice"

type Props = {
    // Resultado da última verificação
    feedback: Feedback
    // Resposta digitada pelo usuário (para exibição)
    answer: string
    // Callback ao clicar em "Próxima Frase"
    onNext: () => void
}

export function FeedbackCard({ feedback, answer, onNext }: Props) {
    return (
        <div>
            {/* Cor do card varia conforme o status via FEEDBACK_STYLES */}
            <div className={cn("rounded-4xl p-6 mb-4", FEEDBACK_STYLES[feedback.status])}>
                <h3 className="text-[20px] font-bold mb-1.5">{feedback.title}</h3>
                <p className="text-sm text-slate-600 mb-4">{feedback.message}</p>

                {/* Resposta digitada pelo usuário */}
                <div className="bg-white/60 rounded-xl p-3.5 mb-3">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Sua resposta:</p>
                    <p className="text-[15px] text-slate-700">{answer}</p>
                </div>

                {/* Lista de correções — vazia quando o status é "perfect" */}
                {feedback.corrections.map((c, i) => (
                    <div key={i} className="bg-white/60 rounded-xl p-3.5 mb-3">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Tradução esperada:</p>
                        <p className="text-[15px] text-green-600 font-semibold">{c.correct}</p>
                        <p className="text-[13px] text-slate-500 mt-2">{c.explanation}</p>
                    </div>
                ))}

                {/* Mensagem extra exclusiva para traduções perfeitas */}
                {feedback.status === "perfect" && (
                    <div className="bg-white/60 rounded-xl p-3.5">
                        <p className="text-[13px] text-slate-600">✨ Sua tradução foi natural e precisa. Continue assim!</p>
                    </div>
                )}
            </div>

            {/* Botão de avançar — substitui os botões de verificar/pular */}
            <Button
                onClick={onNext}
                className="w-full h-auto py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-[0_4px_16px_rgba(37,99,235,0.3)]"
            >
                Próxima Frase
                <ArrowRight className="size-5" />
            </Button>
        </div>
    )
}
