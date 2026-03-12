"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/app/_components/ui/chart"

export const description = "A bar chart"
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function Home() {
  return (
    <div className="mx-auto min-h-dvh relative bg-white pb-24">
      {/* Seu conteúdo aqui */}
      <div className="flex flex-col m-5">

        <p className="text-lg " >Olá 👋</p>
        <h1 className="font-bold text-xl ms-2 mt-2 mb-2">Seja Bem-Vindo ao FluencyLab [nome] ! </h1>

        {/* Nível Atual */}
        <div className="mt-[5%] bg-[#26658C] p-4 rounded-2xl w-full flex flex-col p-[35px]">
          <p className="text-2xl text-white">Nivel Atual </p>

          <div className="flex flex-row gap-4 mt-2 justify-between">
            <p className="text-white text-xl">2</p>
            <div>
              <p className="text-white text-xl">7 Dias</p>
            </div>
          </div>

          <div className="flex flex-row gap-4 mt-2 justify-between">
            <p className="text-white text-xs">300xp</p>
            <div>
              <p className="text-white text-xs">500xp</p>
            </div>
          </div>

   
          <div className="w-full bg-gray-300 rounded-full h-2 mt-4"></div>
          

        </div>

        {/* Conteúdo Recomendado */}
        <div className="mt-4 flex flex-row gap-4 mt-[10%] mb-[10%] h-50 w-full">

          <div className="bg-gray-200 p-4 rounded-lg w-[50%] flex flex-col justify-center items-center">

            <div className=" bg-green-300 p-3 rounded-full mb-2">✔️</div>

            <p className="text-3xl text-olive-900">20</p>

            <p className="text-gray-500 text-sm m-2">Traduções</p>
          </div>

          <div className="bg-gray-200 p-4 rounded-lg w-[50%] flex flex-col justify-center items-center">

            <div className=" bg-red-300 p-3 rounded-full mb-2">🔥</div>

            <p className="text-3xl text-olive-900">70%</p>

            <p className="text-gray-500 text-sm m-2">Precisão</p>
          </div>

        </div>

        {/* Pratica */}

        <div className="mt-2 bg-[#26658C] p-4 rounded-xl w-full flex flex-col justify-center items-center">

          <p className="text-lg text-white p-4 text-center">O FluencyLab é um aplicativo de aprendizado de idiomas que utiliza inteligência artificial para ajudar os usuários a praticarem suas habilidades linguísticas de forma eficaz e personalizada.</p>

          <button className="mt-2 bg-white text-[#0D1B2A] hover:bg-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 py-2 px-4 rounded-md mt-3 w-full transition-colors duration-300">

            Ir Praticar!
          </button>
        </div>

        {/* ranking top3 */}

        <div className="flex flex-col ">
          <div className="ms-4">
            <h2 className="text-xl font-bold mt-4 mb-2">Ranking Top 3</h2>
          </div>

          <div className="flex flex-row gap-4 mt-2 justify-between ms-2">

            <div className="bg-gray-200  p-[8%] rounded-lg   hover:bg-gray-300 transition-colors duration-300 ">
              <h1 className="text-lg">1. João</h1>
              <p className="text-sm text-gray-500">500xp</p>
            </div>

            <div className="bg-gray-200  p-[8%] rounded-lg hover:bg-gray-300 transition-colors duration-300 ">
              <h1 className="text-lg">2. Maria</h1>
              <p className="text-sm text-gray-500">450xp</p>
            </div>

            <div className="bg-gray-200  p-[8%] rounded-lg hover:bg-gray-300 transition-colors duration-300 ">
              <h1 className="text-lg">3. Pedro</h1>
              <p className="text-sm text-gray-500">400xp</p>
            </div>

          </div>
        </div>






      </div>
    </div>
  )
}
