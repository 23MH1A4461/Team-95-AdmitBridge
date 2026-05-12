const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
// Serve the static HTML/CSS/JS files from the 'public' directory
app.use(express.static('public')); 

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const projectContext = `
PROJECT NAME: AdmitBridge - Masters Admission Intelligence Platform
DESCRIPTION: A centralized admission intelligence platform to help students make smarter decisions for international Master's applications. It provides university recommendations, consultancy transparency, admission analytics, profile-based predictions, and application tracking.
TECH STACK: Frontend: React.js, HTML5, CSS3, JavaScript | Backend: Node.js, Express.js | Database: MongoDB | Authentication: JWT | Cloud: Firebase / AWS
KEY FEATURES: Student & Consultancy Management, AI-Based Profile Match Predictor, Consultancy Transparency System, Rejection Analytics Engine, Application Management, Payment System, and Notification System.
`;

let chat;

async function initializeChat() {
    try {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are an expert AI assistant for the AdmitBridge project. Your goal is to answer user questions about AdmitBridge completely and in a user-friendly way. Always provide a clear example. Maintain conversational continuity by connecting current answers to previous context if relevant.\n\nProject Context:\n${projectContext}`
            }
        });
        console.log("Gemini Chat Session Initialized.");
    } catch (error) {
        console.error("Error initializing chat:", error);
    }
}

initializeChat();

// API Endpoint to handle frontend messages
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await chat.sendMessage({ message: message });
        res.json({ reply: response.text });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Failed to communicate with AI" });
    }
});

if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`🚀 AdmitBridge Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;