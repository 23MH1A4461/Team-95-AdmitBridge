import React, { useState } from 'react';
import { FileText, Search, MoreVertical, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';
import './Applications.css';

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Mock Applications Data
  const [applications, setApplications] = useState([
    { id: 'APP-1001', student: 'Alice Smith', consultancy: 'Global Ed Advisors', date: '2023-11-15', status: 'Accepted' },
    { id: 'APP-1002', student: 'Bob Johnson', consultancy: 'Prime UniPath', date: '2023-12-02', status: 'Pending' },
    { id: 'APP-1003', student: 'Charlie Davis', consultancy: 'Global Ed Advisors', date: '2023-12-05', status: 'Rejected' },
    { id: 'APP-1004', student: 'Diana Prince', consultancy: 'AdmitSuccess', date: '2024-01-10', status: 'Accepted' },
    { id: 'APP-1005', student: 'Fiona Gallagher', consultancy: 'Future Scholars', date: '2024-02-22', status: 'Pending' },
    { id: 'APP-1006', student: 'George Miller', consultancy: 'Prime UniPath', date: '2024-03-01', status: 'Pending' },
    { id: 'APP-1007', student: 'Bob Johnson', consultancy: 'AdmitSuccess', date: '2024-03-15', status: 'Pending' },
  ]);

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
