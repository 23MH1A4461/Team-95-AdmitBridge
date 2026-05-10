import React from 'react';
import { Calendar, Video, Clock } from 'lucide-react';

const Meetings = () => {
  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-icon" style={{ backgroundColor: 'var(--primary-color)' }}>
          <Calendar size={24} color="white" />
        </div>
        <div className="page-header-text">
          <h1>Meetings</h1>
          <p>Schedule and manage consultation sessions with your students.</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3>Upcoming Schedule</h3>
          <button className="btn-primary">Schedule New Meeting</button>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '24px', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(14, 165, 164, 0.1)', borderRadius: '12px', minWidth: '80px' }}>
              <strong style={{ display: 'block', color: 'var(--secondary-color)', fontSize: '1.2rem' }}>Oct</strong>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)' }}>24</span>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-dark)' }}>Profile Evaluation & Strategy</h4>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', marginBottom: '4px', fontSize: '0.9rem' }}>
                <Clock size={16} /> 10:00 AM - 11:00 AM EST
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                Student: <strong>Alex Johnson</strong>
              </p>
            </div>
            <button className="btn-secondary" style={{ backgroundColor: 'var(--secondary-color)', color: 'white', borderColor: 'var(--secondary-color)' }}>
              <Video size={18} /> Join Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meetings;
