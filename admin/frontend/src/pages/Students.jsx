import React, { useState } from 'react';
import { Users, Search, MoreVertical, CheckCircle, XCircle, Clock, FileQuestion, Filter } from 'lucide-react';
import './Students.css';

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
};


const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        const res = await authFetch(`${import.meta.env.VITE_API_URL}/admin/students`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Transform if needed to match UI expectations
          setStudents(data.map(u => ({
            id: u._id.substring(18), // pseudo ID
            name: u.email.split('@')[0], // mock name since User only has email
            email: u.email,
            date: u.createdAt,
            status: 'Active',
            applicationStatus: 'None' // We could fetch apps to join this later
          })));
        } else {
          setError("Server returned an error while fetching students.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error: Failed to fetch students. Please try again later.");
      }
    };
    fetchStudents();
  }, []);

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

      {error && <div className="error-alert"><XCircle size={18} /> {error}</div>}

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
