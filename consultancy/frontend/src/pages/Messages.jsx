import React from 'react';
import { MessageSquare, Send } from 'lucide-react';

const Messages = () => {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <div className="page-header" style={{ flexShrink: 0 }}>
        <div className="page-header-icon" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <MessageSquare size={24} color="white" />
        </div>
        <div className="page-header-text">
          <h1>Messages</h1>
          <p>Communicate directly with your assigned students.</p>
        </div>
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', padding: 0, overflow: 'hidden' }}>
        <div style={{ width: '300px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
            <input type="text" placeholder="Search chats..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(14, 165, 164, 0.05)', cursor: 'pointer', borderLeft: '3px solid var(--secondary-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: 'var(--text-dark)' }}>Alex Johnson</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>10:30 AM</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Did you get my documents?</p>
            </div>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.3s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-color)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: 'var(--text-dark)' }}>Maria Garcia</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Yesterday</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Thank you for the guidance!</p>
            </div>
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AJ</div>
            <h3 style={{ margin: 0 }}>Alex Johnson</h3>
          </div>
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#FAFAFA', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ alignSelf: 'flex-start', backgroundColor: 'white', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid var(--border-color)', maxWidth: '70%' }}>
              <p style={{ margin: 0 }}>Hi, I uploaded my transcripts. Did you get my documents?</p>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '8px' }}>10:30 AM</span>
            </div>
            <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--secondary-color)', color: 'white', padding: '12px 16px', borderRadius: '16px', borderBottomRightRadius: '4px', maxWidth: '70%', boxShadow: '0 2px 4px rgba(14,165,164,0.2)' }}>
              <p style={{ margin: 0 }}>Yes, I just reviewed them. They look great! I'll initiate the Stanford application tomorrow.</p>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>10:45 AM</span>
            </div>
          </div>
          <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
            <input type="text" placeholder="Type your reply..." style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', outline: 'none' }} />
            <button className="btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0 }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
