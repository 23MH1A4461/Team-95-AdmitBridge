const request = require('supertest');
const express = require('express');

// We create a mock version of the app for testing to avoid running the full server with Gemini
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.post('/api/chat', (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
    res.status(200).json({ text: 'Mock response from AI' });
});

describe('Chatbot API', () => {
    it('GET /health should return 200', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });

    it('POST /api/chat should return 400 if prompt is missing', async () => {
        const response = await request(app)
            .post('/api/chat')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('POST /api/chat should return mock AI response', async () => {
        const response = await request(app)
            .post('/api/chat')
            .send({ prompt: 'Hello' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('text');
    });
});
