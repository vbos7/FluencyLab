import Image from "next/image"

// title permite trocar "FluencyLab" por "Painel FluencyLab" na tela do painel.
export function AuthLogo({ title = "FluencyLab" }: { title?: string }) {
    return (
        <div className="mb-6 flex flex-col items-center">
            <Image
                src="/img/logo.png"
                alt="FluencyLab"
                width={56}
                height={67}
                priority
                className="mb-3 object-contain"
            />
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        </div>
    )
}
