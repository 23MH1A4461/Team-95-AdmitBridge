import React from 'react';
import './Settings.css';

import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="settings fade-in">
      <div className="page-header">
        <div className="page-header-icon" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <SettingsIcon size={24} color="white" />
        </div>
        <div className="page-header-text">
          <h1>Settings</h1>
          <p>Manage your account preferences and security.</p>
        </div>
      </div>
      <div className="settings-content card" style={{ marginTop: '20px' }}>
        <div className="settings-section" style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' }}>Notifications</h3>
          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label>Email Alerts for Application Status</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label>SMS Alerts for Consultancy Messages</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
        <div className="settings-section">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' }}>Security</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary">Change Password</button>
            <button className="btn-secondary">Enable Two-Factor Auth</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
