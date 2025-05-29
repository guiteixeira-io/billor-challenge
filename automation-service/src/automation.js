require("dotenv").config(); // Carrega variáveis de ambiente do arquivo .env
const puppeteer = require("puppeteer"); // Importa o Puppeteer para automação de navegador
const axios = require("axios"); // Importa o Axios para requisições HTTP
const { Client } = require("pg"); // Importa o cliente do PostgreSQL

// Importa funções de métricas Prometheus
const { recordAutomationMetrics, client: promClient } = require("./metrics");

/**
 * Realiza login em um portal usando Puppeteer.
 * @param {object} page - Instância da página do Puppeteer
 * @param {string} url - URL do portal de login
 * @param {string} username - Nome de usuário
 * @param {string} password - Senha
 */
async function login(page, url, username, password) {
  await page.goto(url);
  await page.type("#username", username);
  await page.type("#password", password);
  await page.click("#login-button");
  await page.waitForNavigation();
}

/**
 * Extrai as cargas da página atual usando seletores do DOM.
 * @param {object} page - Instância da página do Puppeteer
 * @returns {Array} Lista de objetos de carga extraídos da página
 */
async function extractLoads(page) {
  return await page.evaluate(() => {
    const rows = document.querySelectorAll(".load-row"); // Ajuste o seletor conforme necessário
    return Array.from(rows)
      .slice(0, 20)
      .map((row) => ({
        origem: row.querySelector(".origin").innerText,
        destino: row.querySelector(".destination").innerText,
        preco: row.querySelector(".price").innerText,
        eta: row.querySelector(".eta").innerText,
      }));
  });
}

/**
 * Envia os dados das cargas para o serviço GPT e exibe a resposta.
 * @param {Array} loads - Lista de cargas a serem enviadas
 */
async function sendDataToGPT(loads) {
  try {
    const response = await axios.post(
      `${process.env.GPT_SERVICE_URL}/summarize-loads`,
      { loads }
    );
    console.log("Resposta GPT:", response.data);
  } catch (error) {
    console.error("Erro ao enviar cargas:", error.message);
    throw error; // Importante lançar o erro para o retry funcionar corretamente
  }
}

/**
 * Tenta enviar os dados das cargas para o GPT com lógica de nova tentativa (retry).
 * @param {Array} loads - Lista de cargas a serem enviadas
 * @param {number} maxRetries - Número máximo de tentativas
 */
async function retrySendDataToGPT(loads, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      await sendDataToGPT(loads);
      return;
    } catch (error) {
      console.error(`Erro ao enviar cargas, tentativa ${attempt + 1}`);
      attempt++;
      await new Promise((res) => setTimeout(res, 2000 * attempt)); // Recuo exponencial
    }
  }
}

/**
 * Armazena o resumo gerado pelo GPT no banco de dados PostgreSQL.
 * @param {Array} loads - Lista de cargas (utiliza o primeiro load para associar o resumo)
 * @param {string} summaryText - Texto do resumo gerado pelo GPT
 */
async function storeSummary(loads, summaryText) {
  const client = new Client({
    user: "postgres", // Usuário do banco de dados
    password: "postgres", // Senha do banco de dados
    database: "loads_db", // Nome do banco de dados
    host: "postgres-db", // Host do container do banco de dados (nome do serviço no Docker Compose)
    port: 5432, // Porta padrão do PostgreSQL
  });
  await client.connect();

  try {
    // Insere o resumo associado ao primeiro load da lista
    await client.query(
      `INSERT INTO summaries (load_id, resumo) VALUES ($1, $2)`,
      [loads[0].id, summaryText]
    );
    console.log("Resumo armazenado no banco!");
  } catch (error) {
    console.error("Erro ao armazenar resumo:", error);
  } finally {
    await client.end(); // Encerra a conexão com o banco
  }
}

/**
 * Função principal que executa o processo de automação e coleta métricas.
 */
async function runAutomation() {
  const startTime = Date.now();

  try {
    // Aqui você pode colocar o fluxo principal de automação, por exemplo:
    // - Abrir navegador, logar, extrair cargas, enviar para GPT, armazenar resumo, etc.
    console.log("Automação concluída.");
    recordAutomationMetrics(
      "/automation",
      "200",
      (Date.now() - startTime) / 1000
    ); // Registra sucesso nas métricas
  } catch (error) {
    recordAutomationMetrics(
      "/automation",
      "500",
      (Date.now() - startTime) / 1000
    ); // Registra erro nas métricas
    console.error("Erro na automação:", error);
  }
}

// Inicializa o servidor Express para expor as métricas Prometheus
const express = require("express");
const app = express();

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(3001, () =>
  console.log("Métricas disponíveis em http://localhost:3001/metrics")
);
