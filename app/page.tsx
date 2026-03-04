"use client"

import { useState } from "react"
import { BottomNav } from "./_components/bottom-nav"

export default function Home() {
  const [page, setPage] = useState("home")

  return (
    <div className="max-w-107.5 mx-auto min-h-dvh relative bg-white pb-24">
      {/* Seu conteúdo aqui */}
      <h2>Página Teste</h2>
      <BottomNav page={page} setPage={setPage} />
    </div>
  )
}
