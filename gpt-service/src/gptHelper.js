/**
 * Função responsável por gerar o prompt que será enviado ao modelo GPT.
 * Recebe um array de cargas e monta um texto estruturado para análise.
 * @param {Array} loads - Lista de objetos contendo informações das cargas
 * @returns {string} Prompt formatado para o modelo GPT
 */
function generatePrompt(loads) {
    return `
    Você é um assistente especializado em análise de cargas. 
    Abaixo estão dados de cargas recentes:

    ${loads.map(load => `
    Origem: ${load.origem}
    Destino: ${load.destino}
    Preço: $${load.preco}
    Previsão de chegada: ${load.eta}
    `).join("\n")}

    Gere um resumo das tendências de preço e sugira otimizações de rota.
    `;
}

// Exporta a função para ser utilizada em outros módulos
module.exports = { generatePrompt };