import React, { useState } from 'react';
import { Building2, Search, MoreVertical, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';
import './Consultancies.css';

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return authFetch(url, { ...options, headers });
};


const Consultancies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [consultancies, setConsultancies] = useState([]);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchConsultancies = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        const res = await authFetch(`${import.meta.env.VITE_API_URL}/admin/consultancies`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setConsultancies(data.map(c => ({
            id: c._id.substring(18),
            name: c.email.split('@')[0], // placeholder name
            contact: c.email,
            location: 'Remote',
            students: 0,
            status: 'Verified'
          })));
        } else {
          setError("Server returned an error while fetching consultancies.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error: Failed to fetch consultancies. Please try again later.");
      }
    };
    fetchConsultancies();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const verifyConsultancy = (id) => {
    setConsultancies(consultancies.map(c => c.id === id ? { ...c, status: 'Verified' } : c));
  };

  const rejectConsultancy = (id) => {
    setConsultancies(consultancies.map(c => c.id === id ? { ...c, status: 'Rejected' } : c));
  };

  const filteredConsultancies = consultancies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const renderStatusIcon = (status) => {
    switch(status) {
      case 'Verified': return <CheckCircle size={14} />;
      case 'Pending': return <Clock size={14} />;
      case 'Rejected': return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="module-container fade-in">
      <div className="page-header">
        <div className="page-header-icon">
          <Building2 size={24} />
        </div>
        <div className="page-header-text">
          <h1>Manage Consultancies</h1>
          <p>Review, verify, and monitor partnered consultancies.</p>
        </div>
      </div>

      {error && <div className="error-alert"><XCircle size={18} /> {error}</div>}

      <div className="card table-card">
        <div className="table-header-actions">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search consultancies by name or location..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="filter-group">
               <Filter size={18} className="text-light" />
               <select className="status-filter" value={statusFilter} onChange={handleFilterChange}>
                 <option value="All">All Statuses</option>
                 <option value="Verified">Verified</option>
                 <option value="Pending">Pending</option>
                 <option value="Rejected">Rejected</option>
               </select>
            </div>
            <button className="btn-primary">Add Consultancy</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Agency Name</th>
                <th>Contact Email</th>
                <th>Location</th>
                <th>Assigned Students</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredConsultancies.length > 0 ? (
                filteredConsultancies.map((consultancy) => (
                  <tr key={consultancy.id}>
                    <td>#{consultancy.id}</td>
                    <td className="font-medium">{consultancy.name}</td>
                    <td className="text-muted">{consultancy.contact}</td>
                    <td>{consultancy.location}</td>
                    <td className="text-center">{consultancy.students}</td>
                    <td>
                      <span className={`status-badge ${consultancy.status.toLowerCase()}`}>
                        {renderStatusIcon(consultancy.status)}
                        {consultancy.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center empty-state">
                    No consultancies found matching your search.
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

export default Consultancies;
