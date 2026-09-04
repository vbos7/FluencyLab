import Image from "next/image"

export default function AppLogo() {
    return (
        <>
            <Image
                src="/img/logo.png"
                alt="FluencyLab"
                width={32}
                height={38}
                className="size-8 shrink-0 object-contain"
            />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-semibold">FluencyLab</span>
                <span className="text-muted-foreground truncate text-xs">Admin</span>
            </div>
        </>
    )
}
