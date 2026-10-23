import type { NextConfig } from "next"

// Cabeçalhos de segurança em todas as páginas. Sem CSP completa (exigiria nonce
// para os scripts inline do Next e liberar YouTube/Stripe); frame-ancestors já
// impede que o site seja embutido em outro (clickjacking).
const securityHeaders = [
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    // Só vale em HTTPS (o navegador ignora em http://localhost)
    { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
]

const nextConfig: NextConfig = {
    async headers() {
        return [{ source: "/:path*", headers: securityHeaders }]
    },
}

export default nextConfig
