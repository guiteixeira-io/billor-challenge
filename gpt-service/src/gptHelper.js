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

module.exports = { generatePrompt };