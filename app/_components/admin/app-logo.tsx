import { Languages } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Languages className="size-4" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold">FluencyLab</span>
                <span className="truncate text-xs text-muted-foreground">Admin</span>
            </div>
        </>
    );
}
