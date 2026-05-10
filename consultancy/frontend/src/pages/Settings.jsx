import React from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

const Settings = () => {
  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-icon" style={{ backgroundColor: 'var(--text-dark)' }}>
          <SettingsIcon size={24} color="white" />
        </div>
        <div className="page-header-text">
          <h1>Settings</h1>
          <p>Update your consultancy profile, specializations, and preferences.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '800px' }}>
        <h3 style={{ marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>Consultancy Profile</h3>
        
        <form>
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label>Consultancy Name</label>
              <input type="text" defaultValue="Global Ed Advisors" />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" defaultValue="contact@globaledadvisors.com" />
            </div>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div className="form-group">
              <label>Primary Specialization</label>
              <select defaultValue="engineering">
                <option value="engineering">Engineering & Tech</option>
                <option value="business">Business & MBA</option>
                <option value="medical">Medical Sciences</option>
                <option value="arts">Arts & Humanities</option>
              </select>
            </div>
            <div className="form-group">
              <label>Supported Countries</label>
              <input type="text" defaultValue="USA, UK, Germany, Canada" />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '20px' }}>
            <label>About/Bio</label>
            <textarea rows="4" style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: '#FAFAFA', fontFamily: 'var(--font-family)', fontSize: '0.95rem' }} defaultValue="We specialize in placing top tier students in Ivy League and Russell Group universities."></textarea>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-primary">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
