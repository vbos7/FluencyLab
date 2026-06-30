"use client"

import { useState, useRef } from "react"
import { Camera } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/app/_components/ui/avatar"

type Props = {
    name: string
    avatarSrc?: string
}

export function AvatarUpload({ name, avatarSrc }: Props) {
    const [preview, setPreview] = useState<string | undefined>(avatarSrc)
    const inputRef = useRef<HTMLInputElement>(null)

    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setPreview(url)
        // TODO: enviar arquivo para a API
    }

    return (
        <div className="relative inline-block">
            <div
                className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white shadow-[0_4px_16px_rgba(37,99,235,0.35)] sm:h-[88px] sm:w-[88px]"
                style={{ background: "linear-gradient(135deg,#1d4ed8,#60a5fa)" }}
            >
                <Avatar className="h-full w-full">
                    {preview && <AvatarImage src={preview} alt={name} />}
                    <AvatarFallback>{initials}</AvatarFallback>
                    <AvatarBadge className="bg-green-600" />
                </Avatar>
            </div>

            {/* Botão câmera */}
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                aria-label="Alterar foto de perfil"
                className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md transition-all duration-150 hover:bg-blue-700 active:scale-90 sm:h-7 sm:w-7"
            >
                <Camera size={12} className="sm:hidden" />
                <Camera size={14} className="hidden sm:block" />
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
            />
        </div>
    )
}
