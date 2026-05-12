const request = require('supertest');

// Mock @google/genai
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        chats: {
          create: jest.fn().mockReturnValue({
            sendMessage: jest.fn().mockImplementation(({ message }) => {
              if (message === 'fail') {
                return Promise.reject(new Error('AI failed'));
              }
              return Promise.resolve({ text: 'Mock response from AI' });
            })
          })
        }
      };
    })
  };
});

const app = require('./server');

describe('Chatbot API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('POST /api/chat should return mock AI response', async () => {
        const response = await request(app)
            .post('/api/chat')
            .send({ message: 'Hello' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ reply: 'Mock response from AI' });
    });

    it('POST /api/chat should handle AI service failure gracefully', async () => {
        // We pass 'fail' to trigger the Promise.reject in our mock
        const response = await request(app)
            .post('/api/chat')
            .send({ message: 'fail' });
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to communicate with AI' });
    });
});
