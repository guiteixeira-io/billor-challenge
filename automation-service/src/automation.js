require('dotenv').config();
const puppeteer = require('puppeteer');

async function login(page, url, username, password) {
    await page.goto(url);
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('#login-button');
    await page.waitForNavigation();
}

async function extractLoads(page) {
    return await page.evaluate(() => {
        const rows = document.querySelectorAll('.load-row'); // Ajuste seletor conforme necessário
        return Array.from(rows).slice(0, 20).map(row => ({
            origem: row.querySelector('.origin').innerText,
            destino: row.querySelector('.destination').innerText,
            preco: row.querySelector('.price').innerText,
            eta: row.querySelector('.eta').innerText
        }));
    });
}

const axios = require('axios');

async function sendDataToGPT(loads) {
    try {
        const response = await axios.post(`${process.env.GPT_SERVICE_URL}/summarize-loads`, { loads });
        console.log("Resposta GPT:", response.data);
    } catch (error) {
        console.error("Erro ao enviar cargas:", error.message);
    }
}

async function retrySendDataToGPT(loads, maxRetries = 3) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            await sendDataToGPT(loads);
            return;
        } catch (error) {
            console.error(`Erro ao enviar cargas, tentativa ${attempt + 1}`);
            attempt++;
            await new Promise(res => setTimeout(res, 2000 * attempt)); // Recuo exponencial
        }
    }
}

const { Client } = require('pg');

async function storeSummary(loads, summaryText) {
    const client = new Client({
        user: "postgres",
        password: "postgres",
        database: "loads_db",
        host: "postgres-db",
        port: 5432
    });
    await client.connect();

    try {
        await client.query(`INSERT INTO summaries (load_id, resumo) VALUES ($1, $2)`, [loads[0].id, summaryText]);
        console.log("Resumo armazenado no banco!");
    } catch (error) {
        console.error("Erro ao armazenar resumo:", error);
    } finally {
        await client.end();
    }
}