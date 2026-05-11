import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Mail, Globe, Shield, Bell } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    platformName: 'AdmitBridge',
    supportEmail: 'support@admitbridge.com',
    maxApplications: '5',
    maintenanceMode: false,
    emailNotifications: true,
    autoApproval: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Mock API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="module-container fade-in">
      <div className="page-header">
        <div className="page-header-icon">
          <SettingsIcon size={24} />
        </div>
        <div className="page-header-text">
          <h1>System Settings</h1>
          <p>Configure global platform parameters and preferences.</p>
        </div>
      </div>

      <div className="settings-content">
        <div className="card settings-card">
          <form onSubmit={handleSubmit} className="settings-form">
            
            <div className="settings-section">
              <div className="section-header">
                <Globe size={18} className="section-icon" />
                <h3>General Settings</h3>
              </div>
              <div className="form-group">
                <label>Platform Name</label>
                <input 
                  type="text" 
                  name="platformName" 
                  value={formData.platformName} 
                  onChange={handleChange} 
                  required
                />
              </div>
              <div className="form-group">
                <label>Support Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input 
                    type="email" 
                    name="supportEmail" 
                    value={formData.supportEmail} 
                    onChange={handleChange} 
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Max Applications per Student</label>
                <select name="maxApplications" value={formData.maxApplications} onChange={handleChange}>
                  <option value="3">3 Applications</option>
                  <option value="5">5 Applications</option>
                  <option value="10">10 Applications</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>
            </div>

            <hr className="settings-divider" />

            <div className="settings-section">
              <div className="section-header">
                <Shield size={18} className="section-icon" />
                <h3>Security & Preferences</h3>
              </div>
              
              <div className="toggle-group">
                <div className="toggle-info">
                  <h4>Maintenance Mode</h4>
                  <p>Disable access to student and consultancy portals temporarily.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    name="maintenanceMode" 
                    checked={formData.maintenanceMode} 
                    onChange={handleChange} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="toggle-group">
                <div className="toggle-info">
                  <h4>Email Notifications</h4>
                  <p>Send automated emails for status changes and alerts.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    name="emailNotifications" 
                    checked={formData.emailNotifications} 
                    onChange={handleChange} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="toggle-group">
                <div className="toggle-info">
                  <h4>Auto-Approve Consultancies</h4>
                  <p>Automatically verify newly registered consultancies.</p>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    name="autoApproval" 
                    checked={formData.autoApproval} 
                    onChange={handleChange} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              {saveSuccess && (
                <div className="success-message fade-in">
                  <CheckCircle size={16} /> Settings saved successfully!
                </div>
              )}
              <button type="submit" className="btn-primary btn-save" disabled={isSaving}>
                {isSaving ? 'Saving...' : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Optional Sidebar for additional info */}
        <div className="settings-sidebar">
           <div className="card info-card">
              <Bell size={20} className="info-icon text-primary" />
              <h3>System Updates</h3>
              <p className="text-muted text-sm mt-2">Platform is running on Version 2.4.1. All systems are fully operational.</p>
              <button className="btn-outline mt-4">Check for Updates</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
