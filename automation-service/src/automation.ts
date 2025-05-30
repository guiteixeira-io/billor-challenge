import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import puppeteer, { Page } from "puppeteer";
import axios from "axios";
import { Client } from "pg";
import { recordAutomationMetrics, client as promClient } from "./metrics";

// Interface para representar uma carga
interface Load {
  origem: string;
  destino: string;
  preco: string;
  eta: string;
  id?: number;
}

// Função para login usando Puppeteer
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

// Função para extrair cargas da página
async function extractLoads(page: Page): Promise<Load[]> {
  return await page.evaluate(() => {
    const rows = document.querySelectorAll(".load-row");
    return Array.from(rows)
      .slice(0, 20)
      .map((row: any) => ({
        origem: row.querySelector(".origin")?.textContent || "",
        destino: row.querySelector(".destination")?.textContent || "",
        preco: row.querySelector(".price")?.textContent || "",
        eta: row.querySelector(".eta")?.textContent || "",
      }));
  });
}

// Função para enviar dados para o GPT-service
async function sendDataToGPT(loads: Load[]): Promise<any> {
  try {
    const response = await axios.post(
      `${process.env.GPT_SERVICE_URL}/summarize-loads`,
      { loads }
    );
    console.log("Resposta GPT:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao enviar cargas:", error?.message || error);
    throw error;
  }
}

// Função para tentar enviar dados para o GPT com retry
async function retrySendDataToGPT(
  loads: Load[],
  maxRetries = 3
): Promise<any> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await sendDataToGPT(loads);
    } catch (error) {
      console.error(`Erro ao enviar cargas, tentativa ${attempt + 1}`);
      attempt++;
      await new Promise((res) => setTimeout(res, 2000 * attempt));
    }
  }
  throw new Error("Falha ao enviar dados para o GPT após múltiplas tentativas.");
}

// Função para armazenar resumo no banco de dados
async function storeSummary(loads: Load[], summaryText: string): Promise<void> {
  if (!loads.length || !loads[0].id) {
    console.error("Nenhuma carga válida para armazenar resumo.");
    return;
  }

  const client = new Client({
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DB || "loads_db",
    host: process.env.POSTGRES_HOST || "postgres-db",
    port: Number(process.env.POSTGRES_PORT) || 5432,
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

// Função principal de automação (exemplo)
async function runAutomation(): Promise<void> {
  const startTime = Date.now();
  try {
    // Exemplo: abrir navegador, logar, extrair cargas, enviar para GPT, armazenar resumo
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await login(page, ...);
    // const loads = await extractLoads(page);
    // const summary = await retrySendDataToGPT(loads);
    // await storeSummary(loads, summary.summary);
    // await browser.close();
    recordAutomationMetrics("/automation", "200", (Date.now() - startTime) / 1000);
    console.log("Automação concluída.");
  } catch (error) {
    recordAutomationMetrics("/automation", "500", (Date.now() - startTime) / 1000);
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
