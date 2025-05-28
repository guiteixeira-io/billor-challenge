const request = require('supertest');
const app = require('../src/server');

test('Deve retornar uma resposta do GPT', async () => {
    const res = await request(app).post('/gpt').send({ prompt: "Olá!" });
    expect(res.status).toBe(200);
});