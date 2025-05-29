require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env
const express = require('express'); // Importa o framework Express para criar o servidor HTTP
const axios = require('axios'); // Importa o Axios (não utilizado neste arquivo, mas pode ser útil para chamadas HTTP externas)

const app = express();
app.use(express.json()); // Permite que o Express entenda requisições com corpo em JSON

// Endpoint principal para resumir cargas usando o GPT
app.post('/summarize-loads', async (req, res) => {
    try {
        const loads = req.body.loads; // Recebe o array de cargas do corpo da requisição
        if (!loads || loads.length === 0) {
            // Retorna erro se não houver dados de carga
            return res.status(400).json({ error: "Nenhum dado de carga fornecido." });
        }

        const prompt = generatePrompt(loads); // Gera o prompt para o GPT com base nas cargas recebidas
        const response = await callGPT(prompt); // Chama o GPT e obtém o resumo

        res.json(response); // Retorna o resumo gerado para o cliente
    } catch (error) {
        console.error("Erro ao processar requisição:", error);
        res.status(500).json({ error: error.message }); // Retorna erro interno em caso de falha
    }
});

// Inicializa o servidor na porta 3000
app.listen(3000, () => console.log("GPT Service rodando na porta 3000"));

// Importa a biblioteca oficial da OpenAI
const OpenAI = require('openai');
// Importa função auxiliar para gerar o prompt
const { generatePrompt } = require('./gptHelper');

// Função responsável por chamar a API do GPT e retornar o resumo
async function callGPT(prompt) {
    try {
        const openai = new OpenAI({ apiKey: process.env.GPT_API_KEY }); // Instancia o cliente OpenAI com a chave da API
        const response = await openai.completions.create({
            model: "gpt-4", // Modelo utilizado
            prompt,         // Prompt gerado a partir das cargas
            max_tokens: 150 // Limite de tokens na resposta
        });

        // Retorna o texto do resumo e também um array de insights (linhas)
        return { summary: response.choices[0].text.trim(), insights: response.choices[0].text.split("\n") };
    } catch (error) {
        console.error("Erro ao chamar GPT:", error);
        throw new Error("Falha na geração de resposta do GPT."); // Lança erro para ser tratado pelo endpoint
    }
}

// Exporta a função callGPT para uso em outros módulos (ex: testes)
module.exports = { callGPT };