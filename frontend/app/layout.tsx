import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "FluencyLab",
    description:
        "Pratique inglês traduzindo frases do português — com ranking e competição entre amigos.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            {/* Script síncrono: aplica a classe ANTES da hidratação para evitar flash */}
            <head>
                <title>FluencyLab</title>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var cl=document.documentElement.classList;if(localStorage.getItem('fluency-lab:colorBlind')==='true')cl.add('colorblind');if(localStorage.getItem('fluency-lab:reduceMotion')==='true')cl.add('reduce-motion');if(localStorage.getItem('fluency-lab:fontSize')==='large')cl.add('font-large')}catch(e){}})()`,
                    }}
                />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {/* Skip link — visível só quando recebe foco via teclado */}
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-xl focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg focus:outline-none"
                >
                    Pular para o conteúdo
                </a>
                <main id="main-content">{children}</main>
            </body>
        </html>
    )
}
