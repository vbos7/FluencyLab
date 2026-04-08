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
            <div className={cn("mb-4 rounded-4xl p-6", FEEDBACK_STYLES[feedback.status])}>
                <h3 className="mb-1.5 text-[20px] font-bold">{feedback.title}</h3>
                <p className="mb-4 text-sm text-slate-600">{feedback.message}</p>

                {/* Resposta digitada pelo usuário */}
                <div className="mb-3 rounded-xl bg-white/60 p-3.5">
                    <p className="mb-1 text-xs font-semibold text-slate-500">Sua resposta:</p>
                    <p className="text-[15px] text-slate-700">{answer}</p>
                </div>

                {/* Lista de correções — vazia quando o status é "perfect" */}
                {feedback.corrections.map((c, i) => (
                    <div key={i} className="mb-3 rounded-xl bg-white/60 p-3.5">
                        <p className="mb-1 text-xs font-semibold text-slate-500">
                            Tradução esperada:
                        </p>
                        <p className="text-[15px] font-semibold text-green-600">{c.correct}</p>
                        <p className="mt-2 text-[13px] text-slate-500">{c.explanation}</p>
                    </div>
                ))}

                {/* Mensagem extra exclusiva para traduções perfeitas */}
                {feedback.status === "perfect" && (
                    <div className="rounded-xl bg-white/60 p-3.5">
                        <p className="text-[13px] text-slate-600">
                            ✨ Sua tradução foi natural e precisa. Continue assim!
                        </p>
                    </div>
                )}
            </div>

            {/* Botão de avançar — substitui os botões de verificar/pular */}
            <Button
                onClick={onNext}
                className="flex h-auto w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-base font-semibold shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:bg-blue-700"
            >
                Próxima Frase
                <ArrowRight className="size-5" />
            </Button>
        </div>
    )
}
