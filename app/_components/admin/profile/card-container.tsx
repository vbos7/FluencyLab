export function CardContainer({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-neutral-200/70 bg-white/50 p-1.5 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center justify-between pt-2 pr-2 pb-4 pl-3.5">
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white shadow-md shadow-black/5 dark:divide-white/8 dark:border-white/8 dark:bg-white/3">
                {children}
            </div>
        </div>
    );
}
