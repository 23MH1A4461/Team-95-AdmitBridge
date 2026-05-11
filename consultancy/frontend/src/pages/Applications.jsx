import React, { useState, useEffect } from 'react';
import { FileCheck, Edit, MessageSquare } from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Load initially
    const loadApplications = () => {
      const stored = localStorage.getItem('consultancy_applications');
      if (stored) {
        setApplications(JSON.parse(stored));
      }
    };
    
    loadApplications();

    // Listen for cross-tab or same-window storage events
    const handleStorageChange = () => {
      loadApplications();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event to handle same-window storage updates easily
    window.addEventListener('local-storage-update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-update', handleStorageChange);
    };
  }, []);

  const handleResubmit = async (appToUpdate) => {
    const updated = applications.map(app => {
      if (app.name === appToUpdate.name) {
        return { ...app, status: 'Under Review' };
      }
      return app;
    });
    setApplications(updated);
    localStorage.setItem('consultancy_applications', JSON.stringify(updated));
    window.dispatchEvent(new Event('local-storage-update'));
    
    // Sync with backend
    try {
      await fetch('http://localhost:5000/api/applications/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: appToUpdate.name,
          unis: appToUpdate.unis,
          status: 'Under Review'
        })
      });
    } catch (err) {
      console.error("Failed to sync status update to backend", err);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-icon">
          <FileCheck size={24} />
        </div>
        <div className="page-header-text">
          <h1>Application Reviews</h1>
          <p>Review submitted documents and finalize university applications.</p>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-light)', textAlign: 'left' }}>
              <th style={{ padding: '16px' }}>Student Name</th>
              <th style={{ padding: '16px' }}>University</th>
              <th style={{ padding: '16px' }}>Country</th>
              <th style={{ padding: '16px' }}>Last Updated</th>
              <th style={{ padding: '16px' }}>Status</th>
              <th style={{ padding: '16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.filter(app => !['Accepted', 'Rejected'].includes(app.status)).length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-light)' }}>
                  No applications currently under review.
                </td>
              </tr>
            ) : (
              applications.filter(app => !['Accepted', 'Rejected'].includes(app.status)).map((app, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.3s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-color)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{app.name}</td>
                  <td style={{ padding: '16px' }}>{app.unis || 'Pending Selection'}</td>
                  <td style={{ padding: '16px' }}>{app.country}</td>
                  <td style={{ padding: '16px', color: 'var(--text-light)' }}>{new Date().toLocaleDateString()}</td>
                  <td style={{ padding: '16px' }}>
                    <span 
                      className={`badge ${app.status === 'Accepted' || app.status === 'Approved' ? 'badge-approved' : app.status === 'Rejected' ? 'badge-rejected' : app.status === 'Pending' ? 'badge-pending' : 'badge-review'}`}
                      style={app.status === 'Rejected' ? { backgroundColor: '#fef2f2', color: '#ef4444' } : {}}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                    {app.status === 'Pending' ? (
                      <button 
                        className="btn-primary" 
                        onClick={(e) => { e.stopPropagation(); handleResubmit(app); }} 
                        style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary-color)' }}
                      >
                        <FileCheck size={14}/> Student Submitted Details (Re-review)
                      </button>
                    ) : (
                      <>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Edit size={14}/> Update Status</button>
                        <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={14}/> Contact</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;
