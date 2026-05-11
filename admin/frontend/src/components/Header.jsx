import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="admin-header">
      <div className="header-search">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search users, consultancies..." />
      </div>
      
      <div className="header-actions">
        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <button className="icon-button">
          <Settings size={20} />
        </button>
        <div className="header-profile">
          <div className="profile-info">
            <span className="profile-name">System Admin</span>
            <span className="profile-role">Superuser</span>
          </div>
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Admin" className="profile-img" />
        </div>
      </div>
    </header>
  );
};

export default Header;
