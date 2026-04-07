type Props = { name: string }

export function WelcomeHeader({ name }: Props) {
    const chars = (name + "!").split("")

    return (
        <header className="mt-[5%] mb-2">
            <p className="mb-1 text-sm font-medium text-slate-400">👋 Olá de volta,</p>
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900">
                Bem-vindo,{" "}
                <span className="inline-flex overflow-hidden text-blue-600">
                    {chars.map((char, i) => (
                        <span
                            key={i}
                            className="inline-block"
                            style={{
                                animation: `letterBounce 1.8s ${i * 0.08}s ease-in-out infinite`,
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </span>
            </h1>
        </header>
    )
}
