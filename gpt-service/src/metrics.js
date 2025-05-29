const client = require('prom-client');

client.collectDefaultMetrics();
const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Número total de requisições'
});

module.exports = { requestCounter, client };

const express = require('express');
const { requestCounter, client } = require('./metrics');

const app = express();
app.use(express.json());

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(3001, () => console.log('Métricas disponíveis em http://localhost:3001/metrics'));