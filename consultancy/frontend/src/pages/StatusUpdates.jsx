import React from 'react';
import { Activity, CheckCircle, Clock } from 'lucide-react';

const StatusUpdates = () => {
  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-icon" style={{ backgroundColor: 'var(--accent-color)' }}>
          <Activity size={24} color="white" />
        </div>
        <div className="page-header-text">
          <h1>Status Updates</h1>
          <p>Track student application workflows and timeline progression.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '20px' }}>Workflow Tracker: Alex Johnson</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '15px', top: '20px', bottom: '20px', width: '2px', backgroundColor: 'var(--border-color)', zIndex: 1 }}></div>
          
          <div style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 2 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
              <CheckCircle size={16} />
            </div>
            <div>
              <h4 style={{ margin: 0, color: 'var(--text-dark)' }}>Documentation Review</h4>
              <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>Completed on Oct 10, 2026</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 2 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, boxShadow: '0 0 0 4px rgba(212, 175, 55, 0.2)' }}>
              <Clock size={16} />
            </div>
            <div className="card" style={{ padding: '16px', flex: 1, marginTop: '-8px' }}>
              <h4 style={{ margin: 0, color: 'var(--text-dark)', marginBottom: '8px' }}>University Applied</h4>
              <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '16px' }}>Application submitted to Stanford University. Awaiting decision.</p>
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Update Progress</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', position: 'relative', zIndex: 2 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', border: '2px solid var(--border-color)', flexShrink: 0 }}></div>
            <div>
              <h4 style={{ margin: 0, color: 'var(--text-light)' }}>Visa Approval</h4>
              <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdates;
