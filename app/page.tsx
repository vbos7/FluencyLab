export default function Home() {
    return (
        <div className="mx-auto min-h-dvh relative bg-white pb-24">
            {/* Seu conteúdo aqui */}
            <div className="flex flex-col m-5">

                <p>Olá 👋</p>
                <h1 className="font-bold text-xl">Seja Bem-Vindo ao FluencyLab!</h1>

                <div className="mt-2 bg-blue-500 p-4 rounded-lg">
                    <p className="text-sm text-white">O FluencyLab é um aplicativo de aprendizado de idiomas que utiliza inteligência artificial para ajudar os usuários a praticarem suas habilidades linguísticas de forma eficaz e personalizada.</p>
                    <button className="mt-2 bg-white text-blue-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 py-2 px-4 rounded-md mt-3 w-full">
                        Ir Praticar!
                    </button>
                </div>

                <div className="mt-4 flex flex-row gap-4  p-4 rounded-lg h-50">

                    <div className="bg-gray-200 p-4 rounded-lg w-40 ">
                        <img src="" alt="" />
                        <p>Conteúdo 1</p>
                        <p>Descrição do conteúdo 1</p>
                    </div>

                    <div className="bg-gray-200 p-4 rounded-lg w-40 ">
                        <img src="" alt="" />
                        <p>Conteúdo 2</p>
                        <p>Descrição do conteúdo 2</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
