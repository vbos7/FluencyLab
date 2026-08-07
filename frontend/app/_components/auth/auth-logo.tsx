import { Languages } from "lucide-react"

export function AuthLogo() {
    return (
        <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-800 shadow-lg shadow-blue-400/30">
                <Languages className="text-white" size={22} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">FluencyLab</h1>
        </div>
    )
}
