import * as React from "react"
import { cn } from "@/app/_lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
    return (
        <label
            data-slot="label"
            className={cn(
                "text-sm leading-none font-medium text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                className
            )}
            {...props}
        />
    )
}

export { Label }
