type Props = { name: string }

export function WelcomeHeader({ name }: Props) {
    const chars = (name + "!").split("")

    return (
        <div className="mb-2 mt-[5%]">
            <p className="text-sm text-slate-400 font-medium mb-1">👋 Olá de volta,</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Bem-vindo,{" "}
                <span className="text-blue-600 inline-flex overflow-hidden">
                    {chars.map((char, i) => (
                        <span
                            key={i}
                            className="inline-block"
                            style={{ animation: `letterBounce 1.8s ${i * 0.08}s ease-in-out infinite` }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </span>
            </h1>
        </div>
    )
}
