const { GoogleGenAI } = require('@google/genai');
const readline = require('readline');
require('dotenv').config();

// Initialize the Gemini client using the key from the .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The project details extracted from your document to give the bot context
const projectContext = `
PROJECT NAME: AdmitBridge - Masters Admission Intelligence Platform
DESCRIPTION: A centralized admission intelligence platform to help students make smarter decisions for international Master's applications. It provides university recommendations, consultancy transparency, admission analytics, profile-based predictions, and application tracking.
TECH STACK: 
- Frontend: React.js, HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Cloud: Firebase / AWS
KEY FEATURES: Student & Consultancy Management, AI-Based Profile Match Predictor, Consultancy Transparency System, Rejection Analytics Engine, Application Management, Payment System (Stripe/Razorpay), and Notification System.
`;

// Initialize the terminal reading interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function startChat() {
  try {
    // Create a continuous chat session. 
    // The SDK automatically handles sending the previous message history back and forth.
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are an expert AI assistant for the AdmitBridge project. Your goal is to answer user questions about AdmitBridge completely and in a user-friendly way. Always provide a clear example to illustrate your point. 
        
        CRITICAL INSTRUCTION: You must maintain conversational continuity. When answering a question, explicitly look at the immediate previous question and answer. If there is a logical way to connect the current topic to the previous topic, you MUST do so. For example, if the user just asked about the frontend UI, and now asks about the database, explain how the database feeds data to that specific frontend UI you just discussed.
        
        Project Context:
        ${projectContext}`
      }
    });

    console.log("Welcome to the AdmitBridge Chatbot! (Type 'exit' to quit)");
    console.log("---------------------------------------------------------");

    // Recursive function to keep asking for user input
    const askQuestion = () => {
      rl.question('\nYou: ', async (userInput) => {
        if (userInput.toLowerCase() === 'exit') {
          console.log('Chatbot closed.');
          rl.close();
          return;
        }

        try {
          process.stdout.write('AdmitBridge Bot is typing...\r');
          
          // Send the message to the chat session
          const response = await chat.sendMessage({ message: userInput });
          
          // Clear the "typing" text and print the response
          process.stdout.write('                                  \r'); 
          console.log(`AdmitBridge Bot:\n${response.text}`);
          
          // Loop back to ask the next question
          askQuestion();
        } catch (error) {
          console.error('\nError communicating with Gemini:', error.message);
          askQuestion();
        }
      });
    };

    askQuestion();
  } catch (error) {
    console.error("Failed to start chat session:", error);
  }
}

startChat();