export function AuthBackground() {
    return (
        <>
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(59,130,246,0.08) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />
            <div className="pointer-events-none fixed top-0 left-1/2 z-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/10 blur-3xl" />
            <div className="pointer-events-none fixed right-0 bottom-0 z-0 h-[300px] w-[400px] rounded-full bg-blue-200/10 blur-3xl" />
        </>
    )
}
