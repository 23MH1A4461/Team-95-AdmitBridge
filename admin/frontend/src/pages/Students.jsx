import React, { useState } from 'react';
import { Users, Search, MoreVertical, CheckCircle, XCircle, Clock, FileQuestion, Filter } from 'lucide-react';
import './Students.css';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Mock Student Data
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice.smith@example.com', date: '2023-10-15', status: 'Active', applicationStatus: 'Accepted' },
    { id: 2, name: 'Bob Johnson', email: 'bob.j@example.com', date: '2023-11-02', status: 'Active', applicationStatus: 'Pending' },
    { id: 3, name: 'Charlie Davis', email: 'charlie.d@example.com', date: '2023-11-20', status: 'Suspended', applicationStatus: 'Rejected' },
    { id: 4, name: 'Diana Prince', email: 'diana.p@example.com', date: '2023-12-05', status: 'Active', applicationStatus: 'Accepted' },
    { id: 5, name: 'Ethan Hunt', email: 'ethan.h@example.com', date: '2024-01-12', status: 'Active', applicationStatus: 'None' },
    { id: 6, name: 'Fiona Gallagher', email: 'fiona.g@example.com', date: '2024-02-18', status: 'Suspended', applicationStatus: 'Pending' },
    { id: 7, name: 'George Miller', email: 'george.m@example.com', date: '2024-03-22', status: 'Active', applicationStatus: 'None' },
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const toggleStatus = (id) => {
    setStudents(students.map(student => {
      if (student.id === id) {
        return { ...student, status: student.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return student;
    }));
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || student.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const renderAppStatus = (status) => {
    switch(status) {
      case 'Accepted': return <span className="status-badge active"><CheckCircle size={14} /> Accepted</span>;
      case 'Rejected': return <span className="status-badge rejected"><XCircle size={14} /> Rejected</span>;
      case 'Pending': return <span className="status-badge pending"><Clock size={14} /> Pending</span>;
      case 'None': return <span className="status-badge none" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-light)' }}><FileQuestion size={14} /> No Apps</span>;
      default: return null;
    }
  };

  return (
    <div className="module-container fade-in">
      <div className="page-header">
        <div className="page-header-icon">
          <Users size={24} />
        </div>
        <div className="page-header-text">
          <h1>Manage Students</h1>
          <p>View and manage all registered student accounts.</p>
        </div>
      </div>

      <div className="card table-card">
        <div className="table-header-actions">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search students by name or email..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="filter-group">
               <Filter size={18} className="text-light" />
               <select className="status-filter" value={statusFilter} onChange={handleFilterChange}>
                 <option value="All">All Statuses</option>
                 <option value="Active">Active</option>
                 <option value="Suspended">Suspended</option>
               </select>
            </div>
            <button className="btn-primary">Export CSV</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>App Status</th>
                <th>Account</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>#{student.id.toString().padStart(4, '0')}</td>
                    <td className="font-medium">{student.name}</td>
                    <td className="text-muted">{student.email}</td>
                    <td>{new Date(student.date).toLocaleDateString()}</td>
                    <td>{renderAppStatus(student.applicationStatus)}</td>
                    <td>
                      <span className={`status-badge ${student.status.toLowerCase()}`}>
                        {student.status === 'Active' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center empty-state">
                    No students found matching your search.
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

export default Students;
