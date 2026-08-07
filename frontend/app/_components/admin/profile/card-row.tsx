export function CardRow({
    label,
    description,
    children,
}: {
    label: string
    description?: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-3 py-3 pr-2.5 pl-4">
            <div className="flex items-center justify-between gap-4 md:min-h-9">
                <div className="space-y-1">
                    <h3 className="text-sm leading-tight">{label}</h3>
                    {description && (
                        <p className="text-xs font-light text-pretty text-neutral-600 md:leading-none dark:text-neutral-400">
                            {description}
                        </p>
                    )}
                </div>
                <div className="flex max-w-[50%] grow justify-end text-right">{children}</div>
            </div>
        </div>
    )
}
