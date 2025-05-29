require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/summarize-loads', async (req, res) => {
    try {
        const loads = req.body.loads;
        if (!loads || loads.length === 0) {
            return res.status(400).json({ error: "Nenhum dado de carga fornecido." });
        }

        const prompt = generatePrompt(loads);
        const response = await callGPT(prompt);

        res.json(response);
    } catch (error) {
        console.error("Erro ao processar requisição:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("GPT Service rodando na porta 3000"));

const OpenAI = require('openai');
const { generatePrompt } = require('./gptHelper');

async function callGPT(prompt) {
    try {
        const openai = new OpenAI({ apiKey: process.env.GPT_API_KEY });
        const response = await openai.completions.create({
            model: "gpt-4",
            prompt,
            max_tokens: 150
        });

        return { summary: response.choices[0].text.trim(), insights: response.choices[0].text.split("\n") };
    } catch (error) {
        console.error("Erro ao chamar GPT:", error);
        throw new Error("Falha na geração de resposta do GPT.");
    }
}

module.exports = { callGPT };