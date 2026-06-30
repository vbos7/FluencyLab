<?php
/**
 * AiService.php
 *
 * Classe responsável por chamar a API da OpenAI e obter a correção
 * da tradução do aluno. Usa cURL (embutido no PHP), sem Composer.
 *
 * Como usar:
 *   require_once 'AiService.php';
 *   $ai = new AiService();
 *   $feedback = $ai->corrigirTraducao($frasePt, $referenciaEn, $respostaAluno);
 */
class AiService
{
    private string $apiKey;
    private string $model = 'gpt-4o-mini';

    public function __construct()
    {
        $this->apiKey = getenv('OPENAI_API_KEY') ?: '';
    }

    /**
     * Envia a tradução para a IA e retorna o feedback estruturado.
     *
     * @param string $pt             Frase original em português
     * @param string $enReferencia   Tradução de referência (exemplo)
     * @param string $respostaAluno  O que o aluno traduziu
     * @return array                 Feedback da IA como array PHP
     */
    public function corrigirTraducao(string $pt, string $enReferencia, string $respostaAluno): array
    {
        $prompt = $this->montarPrompt($pt, $enReferencia, $respostaAluno);

        // cURL é a forma do PHP fazer requisições HTTP para outros servidores
        $ch = curl_init('https://api.openai.com/v1/chat/completions');

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,   // devolve o resultado como string
            CURLOPT_POST           => true,
            CURLOPT_HTTPHEADER     => [
                'Authorization: Bearer ' . $this->apiKey,
                'Content-Type: application/json',
            ],
            CURLOPT_POSTFIELDS => json_encode([
                'model'           => $this->model,
                'temperature'     => 0.3,         // menos criatividade = mais consistência
                'response_format' => ['type' => 'json_object'],
                'messages'        => [
                    [
                        'role'    => 'system',
                        'content' => 'Você é um professor de inglês especializado em correção de traduções. Sempre responda em JSON válido.',
                    ],
                    [
                        'role'    => 'user',
                        'content' => $prompt,
                    ],
                ],
            ]),
            CURLOPT_TIMEOUT => 30,
        ]);

        $response = curl_exec($ch);
        $error    = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new \Exception('Erro cURL: ' . $error);
        }

        $data    = json_decode($response, true);
        $content = $data['choices'][0]['message']['content'] ?? null;

        if (!$content) {
            throw new \Exception('Resposta vazia da OpenAI');
        }

        $result = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \Exception('JSON inválido: ' . json_last_error_msg());
        }

        return $result;
    }

    private function montarPrompt(string $pt, string $enRef, string $resposta): string
    {
        return <<<PROMPT
Você é professor de inglês. Avalie a tradução abaixo.

IMPORTANTE:
- Avalie se a tradução está CORRETA em significado e gramática, não se é idêntica à referência.
- Contrações (She's, I'm, They're) são equivalentes às formas completas — nunca considere erro.

Frase em português: {$pt}
Tradução de referência: {$enRef}
Tradução do aluno: {$resposta}

Retorne APENAS um JSON com esta estrutura exata (sem markdown, sem texto extra):
{
  "is_correct": true ou false,
  "score": número de 0 a 100,
  "overall_comment": "comentário geral em português",
  "mistakes": [
    {"type": "grammar", "original": "trecho errado", "suggestion": "correção", "explanation_pt": "explicação"}
  ],
  "corrected_sentence": "frase corrigida (ou frase do aluno se não houver erro)",
  "positive_points": ["o que o aluno acertou"]
}
PROMPT;
    }
}
