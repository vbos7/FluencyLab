import * as React from "react"
import { cn } from "@/app/_lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-none outline-none",
                "placeholder:text-slate-400",
                "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-colors",
                className
            )}
            {...props}
        />
    )
}

export { Input }
