import React, { useState, useEffect } from 'react';
import { Eye, MapPin, FileText, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Applications.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/applications');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const formattedApps = data.map((app, index) => ({
              id: `APP-00${index + 1}`,
              name: app.name,
              message: app.message,
              university: app.unis || 'Pending Selection',
              country: app.country,
              consultancy: app.consultancyName || 'Assigned Consultancy',
              date: new Date().toLocaleDateString(), // Mocking date since it's not in backend
              status: app.status || 'New Lead'
            }));
            setApplications(formattedApps);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      }
      
      // Fallback
      setApplications([
        {
          id: "APP-001",
          university: "Stanford University",
          country: "USA",
          consultancy: "Global Ed Advisors",
          date: "Oct 12, 2026",
          status: "Under Review"
        },
        {
          id: "APP-002",
          university: "University of Oxford",
          country: "UK",
          consultancy: "EduBridge UK",
          date: "Sep 28, 2026",
          status: "Approved"
        },
        {
          id: "APP-003",
          university: "Technical University of Munich",
          country: "Germany",
          consultancy: "German Scholars prep",
          date: "Nov 02, 2026",
          status: "Pending"
        }
      ]);
      setLoading(false);
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': 
      case 'New Lead':
      case 'New':
        return <span className="badge badge-pending">{status}</span>;
      case 'Under Review': return <span className="badge badge-review">Under Review</span>;
      case 'Approved': 
      case 'Accepted':
        return <span className="badge badge-approved">{status}</span>;
      case 'Rejected': return <span className="badge badge-rejected">Rejected</span>;
      default: return <span className="badge">{status || 'Unknown'}</span>;
    }
  };

  return (
    <div className="applications fade-in">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of your university applications.</p>
      </div>
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>Loading your applications...</div>
      ) : (
        <div className="applications-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {applications.map((app) => (
            <div key={app.id} className="card app-card">
              <div className="app-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span className="app-id" style={{ fontWeight: 'bold', color: 'var(--text-light)' }}>{app.id}</span>
                {getStatusBadge(app.status)}
              </div>
              <div className="app-body">
                <h3 style={{ marginBottom: '10px' }}>{app.university}</h3>
                <p className="location" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-light)', marginBottom: '15px' }}><MapPin size={16}/> {app.country}</p>
                <div className="app-details" style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
                  <p><strong>Consultancy:</strong> {app.consultancy}</p>
                  <p><strong>Applied On:</strong> {app.date}</p>
                </div>
              </div>
              <div className="app-footer">
                <button 
                  className="btn-primary"
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '8px 14px',
                    fontSize: '0.85rem'
                  }}
                  onClick={() => navigate('/status', { state: { application: app } })}
                >
                  <Compass size={14} /> Track Your Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
