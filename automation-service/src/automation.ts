import dotenv from "dotenv";
dotenv.config();

import puppeteer, { Page } from "puppeteer";
import axios from "axios";
import { Client } from "pg";
import express, { Request, Response } from "express";
import { recordAutomationMetrics, client as promClient } from "./metrics";

/**
 * Realiza login em um portal usando Puppeteer.
 */
async function login(
  page: Page,
  url: string,
  username: string,
  password: string
): Promise<void> {
  await page.goto(url);
  await page.type("#username", username);
  await page.type("#password", password);
  await page.click("#login-button");
  await page.waitForNavigation();
}

/**
 * Extrai as cargas da página atual usando seletores do DOM.
 */
interface Load {
  origem: string;
  destino: string;
  preco: string;
  eta: string;
  id?: number;
}

async function extractLoads(page: Page): Promise<Load[]> {
  return await page.evaluate(() => {
    const rows = document.querySelectorAll(".load-row");
    return Array.from(rows)
      .slice(0, 20)
      .map((row: any) => ({
        origem: row.querySelector(".origin")?.innerText,
        destino: row.querySelector(".destination")?.innerText,
        preco: row.querySelector(".price")?.innerText,
        eta: row.querySelector(".eta")?.innerText,
      }));
  });
}

/**
 * Envia os dados das cargas para o serviço GPT e exibe a resposta.
 */
async function sendDataToGPT(loads: Load[]): Promise<void> {
  try {
    const response = await axios.post(
      `${process.env.GPT_SERVICE_URL}/summarize-loads`,
      { loads }
    );
    console.log("Resposta GPT:", response.data);
  } catch (error: any) {
    console.error("Erro ao enviar cargas:", error.message);
    throw error;
  }
}

/**
 * Tenta enviar os dados das cargas para o GPT com lógica de nova tentativa (retry).
 */
async function retrySendDataToGPT(loads: Load[], maxRetries = 3): Promise<void> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      await sendDataToGPT(loads);
      return;
    } catch (error) {
      console.error(`Erro ao enviar cargas, tentativa ${attempt + 1}`);
      attempt++;
      await new Promise((res) => setTimeout(res, 2000 * attempt));
    }
  }
}

/**
 * Armazena o resumo gerado pelo GPT no banco de dados PostgreSQL.
 */
async function storeSummary(loads: Load[], summaryText: string): Promise<void> {
  if (!loads.length || !loads[0].id) {
    console.error("Nenhuma carga válida para armazenar resumo.");
    return;
  }

  const client = new Client({
    user: "postgres",
    password: "postgres",
    database: "loads_db",
    host: "postgres-db",
    port: 5432,
  });
  await client.connect();

  try {
    await client.query(
      `INSERT INTO summaries (load_id, resumo) VALUES ($1, $2)`,
      [loads[0].id, summaryText]
    );
    console.log("Resumo armazenado no banco!");
  } catch (error) {
    console.error("Erro ao armazenar resumo:", error);
  } finally {
    await client.end();
  }
}

/**
 * Função principal que executa o processo de automação e coleta métricas.
 */
async function runAutomation(): Promise<void> {
  const startTime = Date.now();

  try {
    // Exemplo de fluxo principal de automação
    console.log("Automação concluída.");
    recordAutomationMetrics(
      "/automation",
      "200",
      (Date.now() - startTime) / 1000
    );
  } catch (error) {
    recordAutomationMetrics(
      "/automation",
      "500",
      (Date.now() - startTime) / 1000
    );
    if (error instanceof Error) {
      console.error("Erro:", error.message);
    } else {
      console.error("Erro desconhecido:", error);
    }
  }
}

// Inicializa o servidor Express para expor as métricas Prometheus
const app = express();

app.get("/metrics", async (req: Request, res: Response) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(3001, () =>
  console.log("Métricas disponíveis em http://localhost:3001/metrics")
);
