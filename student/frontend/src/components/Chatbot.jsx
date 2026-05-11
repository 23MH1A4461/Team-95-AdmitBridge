import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! I'm the AdmitBridge AI. Ask me anything about the platform's features, architecture, or how it works!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatBoxRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const formatText = (text) => {
    // Simple markdown formatting for bold text and newlines
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</span>;
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply || "Sorry, I couldn't process that." }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Error connecting to server. Make sure the AdmitBridge Chatbot server is running on port 3000!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // We don't auto-send immediately in React to allow editing, but we could.
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className={`chatbot-fab ${isOpen ? 'hidden' : ''}`} 
        onClick={() => setIsOpen(true)}
        title="Chat with AdmitBridge AI"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-title">
            <span>🚀</span> AdmitBridge AI
          </div>
          <button className="chatbot-close" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="chatbot-messages" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`chat-msg ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}>
              {msg.sender === 'bot' ? formatText(msg.text) : msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="chat-msg bot-msg typing-indicator">
              Thinking...
            </div>
          )}
        </div>

        <div className="chatbot-input-area">
          <button 
            className={`mic-btn ${isListening ? 'listening' : ''}`} 
            onClick={handleMicClick}
            title="Click to speak"
          >
            <Mic size={20} />
          </button>
          <input 
            type="text" 
            placeholder={isListening ? "Listening..." : "Type or speak..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="send-btn" onClick={handleSend}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
