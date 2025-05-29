const client = require('prom-client');

// Ativa a coleta de métricas padrão do sistema (CPU, memória, etc.)
client.collectDefaultMetrics();

// Contador de requisições HTTP recebidas pelo serviço
const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Número total de requisições recebidas',
    labelNames: ['route', 'status']
});

// Tempo de execução de automação (histograma)
const automationDuration = new client.Histogram({
    name: 'automation_duration_seconds',
    help: 'Tempo de execução do processo de automação',
    buckets: [1, 2, 5, 10, 20]
});

// Função para registrar métricas após cada automação
function recordAutomationMetrics(route, status, duration) {
    requestCounter.labels(route, status).inc();
    automationDuration.observe(duration);
}

module.exports = { requestCounter, automationDuration, recordAutomationMetrics, client };