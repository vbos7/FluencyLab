import { Languages } from "lucide-react"

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <Languages className="size-4" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold">FluencyLab</span>
                <span className="text-muted-foreground truncate text-xs">Admin</span>
            </div>
        </>
    )
}
