"use client"

import { RefObject } from "react"
import { Button } from "@/app/_components/ui/button"

type Props = {
    // Texto digitado pelo usuário
    answer: string
    // Callback ao digitar no textarea
    onChange: (value: string) => void
    // Callback ao clicar em "Verificar" ou pressionar Enter
    onVerify: () => void
    // Callback ao clicar em "Pular"
    onSkip: () => void
    // Ref para dar foco programaticamente ao textarea
    inputRef: RefObject<HTMLTextAreaElement | null>
}

export function AnswerForm({ answer, onChange, onVerify, onSkip, inputRef }: Props) {
    return (
        <div>
            {/* Textarea controlado; Enter sem Shift aciona a verificação */}
            <textarea
                ref={inputRef}
                aria-label="Digite a tradução em inglês da frase acima"
                aria-describedby="current-phrase"
                className="min-h-20 w-full resize-none rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-base text-slate-800 transition-colors outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                placeholder="Digite a tradução em inglês..."
                value={answer}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        onVerify()
                    }
                }}
            />
            <div className="mt-4 flex flex-col gap-2.5">
                {/* Botão principal desabilitado enquanto o campo estiver vazio */}
                <Button
                    onClick={onVerify}
                    disabled={!answer.trim()}
                    className="hover-lift h-auto w-full rounded-2xl bg-blue-600 py-4 text-base font-semibold hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400"
                >
                    Verificar Tradução
                </Button>
                {/* Pular vai direto para a próxima frase sem verificar */}
                <Button
                    variant="outline"
                    onClick={onSkip}
                    className="h-auto w-full rounded-2xl border-[1.5px] border-slate-200 bg-transparent py-3.5 text-sm font-medium text-slate-500 hover:bg-transparent hover:text-slate-500"
                >
                    Pular frase
                </Button>
            </div>
        </div>
    )
}
