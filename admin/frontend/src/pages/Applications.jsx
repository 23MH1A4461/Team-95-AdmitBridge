import React, { useState } from 'react';
import { FileText, Search, MoreVertical, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';
import './Applications.css';

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
};


const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchApps = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        const res = await authFetch(`${import.meta.env.VITE_API_URL}/admin/applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setApplications(data.map(app => ({
            id: app._id.substring(18),
            student: app.studentName || 'Unknown Student',
            consultancy: app.consultancyName,
            date: app.appliedAt,
            status: app.status
          })));
        } else {
          setError("Server returned an error while fetching applications.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error: Failed to fetch applications. Please try again later.");
      }
    };
    fetchApps();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const updateStatus = (id, newStatus) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.consultancy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const renderStatusIcon = (status) => {
    switch(status) {
      case 'Accepted': return <CheckCircle size={14} />;
      case 'Pending': return <Clock size={14} />;
      case 'Rejected': return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="module-container fade-in">
      <div className="page-header">
        <div className="page-header-icon">
          <FileText size={24} />
        </div>
        <div className="page-header-text">
          <h1>System Applications</h1>
          <p>Monitor all student applications across partner consultancies.</p>
        </div>
      </div>

      {error && <div className="error-alert"><XCircle size={18} /> {error}</div>}

      <div className="card table-card">
        <div className="table-header-actions">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by student, consultancy, or ID..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="filter-group">
             <Filter size={18} className="text-light" />
             <select className="status-filter" value={statusFilter} onChange={handleFilterChange}>
               <option value="All">All Statuses</option>
               <option value="Accepted">Accepted</option>
               <option value="Pending">Pending</option>
               <option value="Rejected">Rejected</option>
             </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Student</th>
                <th>Target Consultancy</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Admin Override</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="text-muted font-medium">{app.id}</td>
                    <td className="font-medium">{app.student}</td>
                    <td>{app.consultancy}</td>
                    <td>{new Date(app.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {renderStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {app.status === 'Pending' && (
                          <>
                            <button className="btn-action verify" onClick={() => updateStatus(app.id, 'Accepted')}>Force Accept</button>
                            <button className="btn-action suspend" onClick={() => updateStatus(app.id, 'Rejected')}>Reject</button>
                          </>
                        )}
                        {app.status !== 'Pending' && (
                           <button className="btn-action" style={{color: 'var(--text-light)', cursor: 'default'}}>Resolved</button>
                        )}
                        <button className="btn-icon">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center empty-state">
                    No applications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applications;
