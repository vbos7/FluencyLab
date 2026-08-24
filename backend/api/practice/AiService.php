<?php

require_once __DIR__.'/../env.php';

class AiService
{
    private string $apiKey;

    public function __construct()
    {
        // env() lê ambiente real (Docker), $_SERVER (Forge) E o .env (php -S local).
        // getenv() sozinho não enxerga o .env quando o servidor sobe com `php -S`.
        $this->apiKey = env('OPENAI_API_KEY');
    }

    public function corrigirTraducao(string $pt, string $enRef, string $resposta): array
    {
        // cURL é a forma do PHP fazer chamadas HTTP pra outras APIs
        $ch = curl_init('https://api.openai.com/v1/chat/completions');

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer '.$this->apiKey,
                'Content-Type: application/json',
            ],
            CURLOPT_POSTFIELDS => json_encode([
                'model' => 'gpt-4o-mini',  // modelo barato
                'temperature' => 0.3,
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    ['role' => 'system', 'content' => 'Você é um professor de inglês. Responda em JSON.'],
                    ['role' => 'user',   'content' => $this->montarPrompt($pt, $enRef, $resposta)],
                ],
            ]),
            CURLOPT_TIMEOUT => 30,
        ]);

        $resposta_api = curl_exec($ch);
        // curl_close() é obsoleto desde o PHP 8.0 (não faz nada) e emite um
        // Deprecated que vaza no meio do JSON da resposta — por isso removido.

        $dados = json_decode($resposta_api, true);
        $content = $dados['choices'][0]['message']['content'] ?? null;

        if (! $content) {
            throw new Exception('Resposta vazia da OpenAI');
        }

        return json_decode($content, true);
    }

    private function montarPrompt(string $pt, string $enRef, string $resposta): string
    {
        return "Corrija a tradução:\n"
            ."Português: {$pt}\n"
            ."Referência: {$enRef}\n"
            ."Aluno: {$resposta}\n\n"
            .'Retorne JSON: {"is_correct":bool,"score":0-100,"overall_comment":"...",'
            .'"mistakes":[{"type":"...","original":"...","suggestion":"...","explanation_pt":"..."}],'
            .'"corrected_sentence":"...","positive_points":["..."]}';
    }
}
