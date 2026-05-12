import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
};

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/messages?sender=usr_alex&receiver=usr_consultant`);
      if (response.ok) {
        const data = await response.json();
        const processed = data.map(msg => ({
          ...msg,
          is_self: msg.sender_id === 'usr_alex'
        }));
        setMessages(processed);
        setError(null);
      } else {
        if (messages.length === 0) setError("Failed to fetch messages.");
      }
    } catch (err) {
      console.error(err);
      if (messages.length === 0) setError("Network error: Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!replyText.trim()) return;
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: 'usr_alex',
          sender_name: 'Alex Johnson',
          receiver_id: 'usr_consultant',
          receiver_name: 'Consultant',
          text: replyText
        })
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { ...data.message, is_self: true }]);
        setReplyText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <div className="page-header" style={{ flexShrink: 0 }}>
        <div className="page-header-icon" style={{ backgroundColor: 'var(--primary-color)' }}>
          <MessageSquare size={24} color="white" />
        </div>
        <div className="page-header-text">
          <h1>Consultant Messages</h1>
          <p>Communicate directly with your assigned educational consultant.</p>
        </div>
      </div>

      {error && <div className="error-alert" style={{ marginBottom: '16px' }}>{error}</div>}

      <div className="card" style={{ flex: 1, display: 'flex', padding: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--secondary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>C</div>
            <h3 style={{ margin: 0 }}>AdmitBridge Consultant</h3>
          </div>
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#FAFAFA', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              <p style={{textAlign: 'center', color: 'var(--text-light)'}}>Loading messages...</p>
            ) : messages.length === 0 ? (
              <p style={{textAlign: 'center', color: 'var(--text-light)'}}>No messages yet. Say hello!</p>
            ) : (
              messages.map((msg, idx) => {
                let displayTime = 'Just now';
                if (msg.timestamp) {
                    try {
                        const d = new Date(msg.timestamp);
                        if (!isNaN(d)) displayTime = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                        else displayTime = msg.timestamp; // fallback for old data like "10:30 AM"
                    } catch(e) { displayTime = msg.timestamp; }
                }
                return (
                <div key={idx} style={{ 
                  alignSelf: msg.is_self ? 'flex-end' : 'flex-start', 
                  backgroundColor: msg.is_self ? 'var(--primary-color)' : 'white', 
                  color: msg.is_self ? 'white' : 'var(--text-dark)',
                  padding: '12px 16px', 
                  borderRadius: '16px', 
                  borderBottomLeftRadius: msg.is_self ? '16px' : '4px',
                  borderBottomRightRadius: msg.is_self ? '4px' : '16px',
                  border: msg.is_self ? 'none' : '1px solid var(--border-color)', 
                  maxWidth: '70%', 
                  boxShadow: msg.is_self ? '0 2px 4px rgba(250,114,104,0.2)' : 'none' 
                }}>
                  <p style={{ margin: 0 }}>{msg.text}</p>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: msg.is_self ? 'rgba(255,255,255,0.8)' : 'var(--text-light)', marginTop: '8px' }}>
                    {displayTime}
                  </span>
                </div>
              )})
            )}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', outline: 'none' }} 
            />
            <button className="btn-primary" onClick={handleSend} style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
