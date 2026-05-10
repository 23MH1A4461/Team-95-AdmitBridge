import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import logo from '../assets/logo.png';
import './Header.css';

const Header = () => {
  const [userProfile, setUserProfile] = useState({ name: 'Student', photo: null });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
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
      const response = await fetch('http://localhost:5000/api/notifications?role=student');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const loadProfile = () => {
    const saved = localStorage.getItem('studentProfile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if(parsed.name) setUserProfile(parsed);
      } catch(e) {}
    }
  };

  useEffect(() => {
    loadProfile();
    fetchNotifications();
    window.addEventListener('profileUpdated', loadProfile);
    
    const interval = setInterval(fetchNotifications, 3000);
    
    return () => {
      window.removeEventListener('profileUpdated', loadProfile);
      clearInterval(interval);
    };
  }, []);

  const getInitials = (name) => {
    if(!name || name === 'Student') return 'S';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="AdmitBridge Logo" />
      </div>
      
      <nav className="header-nav">
        <NavLink to="/explore" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Explore</NavLink>
        <NavLink to="/resources" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Resources</NavLink>
        <NavLink to="/college-finder" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>College Finder</NavLink>
      </nav>
      
      <div className="header-actions">
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {notifications.length > 0 && <span className="badge-dot">{notifications.length}</span>}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown" style={{ position: 'absolute', top: '100%', right: '0', marginTop: '15px', width: '320px', backgroundColor: 'var(--card-bg)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', zIndex: 1000, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-light)' }}>
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
                    <div key={idx} style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-light)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
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
        <NavLink to="/profile" className="header-profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {userProfile.photo ? (
            <img src={userProfile.photo} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold' }}>
              {getInitials(userProfile.name)}
            </div>
          )}
          <span style={{ fontWeight: '500', color: '#FFFFFF' }}>{userProfile.name}</span>
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
