import React, { useState, useEffect, useRef } from 'react';
import { Bell, Briefcase, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [error, setError] = useState(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      // Clear error only when manually fetching or opening dropdown? We'll just leave it.
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notifications?role=consultant`); // using mock
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      // Don't show global UI error for background notification polling, just keep it out of the user's face
      // setError("Failed to load notifications.");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <div className="header-logo">
        <Briefcase color="var(--primary-color)" size={28}/>
        <h2>AdmitBridge Partner</h2>
      </div>
      
      <div className="header-search">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search students, applications, or messages..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="header-actions">
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {notifications.length > 0 && <span className="badge-dot">{notifications.length}</span>}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown" style={{ position: 'absolute', top: '100%', right: '0', marginTop: '15px', width: '320px', backgroundColor: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 1000, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-color)' }}>
                <h4 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1rem' }}>Notifications</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }} onClick={() => setNotifications([])}>Mark all read</span>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif, idx) => (
                    <div key={idx} style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <p style={{ margin: '0 0 6px 0', fontWeight: '600', color: 'var(--text-dark)', fontSize: '0.9rem' }}>{notif.title}</p>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.4' }}>{notif.message}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: '500' }}>{notif.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="header-profile">
          <Briefcase size={18} />
          <span>Global Ed Advisors</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
