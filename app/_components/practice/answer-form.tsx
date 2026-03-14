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
                className="w-full border-2 border-slate-200 rounded-2xl px-5 py-4 text-base text-slate-800 bg-white outline-none resize-none min-h-20 focus:border-blue-500 placeholder:text-slate-400 transition-colors"
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
            <div className="flex flex-col gap-2.5 mt-4">
                {/* Botão principal desabilitado enquanto o campo estiver vazio */}
                <Button
                    onClick={onVerify}
                    disabled={!answer.trim()}
                    className="w-full h-auto py-4 rounded-2xl text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-[0_4px_16px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                >
                    Verificar Tradução
                </Button>
                {/* Pular vai direto para a próxima frase sem verificar */}
                <Button
                    variant="outline"
                    onClick={onSkip}
                    className="w-full h-auto py-3.5 rounded-2xl text-sm font-medium text-slate-500 border-[1.5px] border-slate-200 bg-transparent hover:bg-transparent hover:text-slate-500"
                >
                    Pular frase
                </Button>
            </div>
        </div>
    )
}
