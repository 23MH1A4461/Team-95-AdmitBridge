import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, GraduationCap, MapPin, Award } from 'lucide-react';

const AssignedStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('NotReviewed');
  const [filterCountry, setFilterCountry] = useState('All Countries');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New states for Document Verification and Info Requests
  const [verification, setVerification] = useState({
    personal: false,
    academic: false,
    preferences: false
  });
  const [additionalRequest, setAdditionalRequest] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setVerification({ personal: false, academic: false, preferences: false });
    setAdditionalRequest('');
    setRequestSent(false);
  };

  const handleStatusUpdate = async (newStatus, studentToUpdate = selectedStudent, message = null) => {
    if (!studentToUpdate) return;
    
    // Update main list
    const updatedStudents = students.map(s => {
      // using name as identifier since we might not have ID in mock data
      if (s.name === studentToUpdate.name) {
        return { ...s, status: newStatus };
      }
      return s;
    });
    setStudents(updatedStudents);
    
    // Persist to localStorage so Applications.jsx can read it
    localStorage.setItem('consultancy_applications', JSON.stringify(updatedStudents));
    
    // Sync with backend
    try {
      await fetch('http://localhost:5000/api/applications/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: studentToUpdate.name,
          unis: studentToUpdate.unis,
          status: newStatus,
          message: message
        })
      });
    } catch (err) {
      console.error("Failed to sync status update to backend", err);
    }
    
    // Close the modal
    setSelectedStudent(null);
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        let currentStudents = [];
        const stored = localStorage.getItem('consultancy_applications');
        if (stored) {
          currentStudents = JSON.parse(stored);
        } else {
          currentStudents = [
            { name: 'Alex Johnson', initials: 'AJ', status: 'Pending', course: 'Computer Science', country: 'USA', score: '310', unis: 'Stanford, MIT', email: 'alex@example.com', cgpa: '8.5' },
            { name: 'Maria Garcia', initials: 'MG', status: 'Applied', course: 'Data Science', country: 'UK', score: '7.5', unis: 'Oxford, Cambridge', email: 'maria@example.com', cgpa: '9.0' }
          ];
        }

        try {
          const response = await fetch('http://localhost:5000/api/applications');
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              // Merge backend data with local data
              data.forEach(backendApp => {
                const exists = currentStudents.find(s => s.name === backendApp.name && s.unis === backendApp.unis);
                if (!exists) {
                  currentStudents = [backendApp, ...currentStudents];
                }
              });
            }
          }
        } catch (e) {
          console.warn("Backend fetch failed, using local/fallback data");
        }

        setStudents(currentStudents);
        localStorage.setItem('consultancy_applications', JSON.stringify(currentStudents));
        window.dispatchEvent(new Event('local-storage-update'));
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const uniqueCountries = ['All Countries', ...new Set(students.map(s => s.country).filter(Boolean))];

  const filteredStudents = students.filter(student => {
    // 1. Status Filter
    let statusMatch = true;
    if (filterStatus === 'NotReviewed') {
      statusMatch = !['Pending', 'Under Review', 'Accepted', 'Rejected'].includes(student.status);
    } else if (filterStatus === 'Pending') {
      statusMatch = ['Pending', 'Under Review'].includes(student.status);
    } else if (filterStatus === 'Reviewed') {
      statusMatch = ['Accepted', 'Rejected'].includes(student.status);
    }

    // 2. Country Filter
    let countryMatch = true;
    if (filterCountry !== 'All Countries') {
      countryMatch = student.country === filterCountry;
    }

    // 3. Search Query Filter
    let searchMatch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      searchMatch = (student.name?.toLowerCase().includes(q)) || (student.course?.toLowerCase().includes(q));
    }

    return statusMatch && countryMatch && searchMatch;
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-icon" style={{ backgroundColor: 'var(--primary-color)' }}>
          <GraduationCap size={24} color="white" />
        </div>
        <div className="page-header-text">
          <h1>Assigned Students</h1>
          <p>Manage and track the progress of your assigned student profiles.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Search students by name or course..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', minWidth: '150px', fontWeight: 500, color: 'var(--primary-color)', backgroundColor: '#fff8f1' }}
        >
          <option value="NotReviewed">Not Reviewed</option>
          <option value="Pending">Pending Info</option>
          <option value="Reviewed">Reviewed Applications</option>
          <option value="All">All Students</option>
        </select>
        <select 
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', minWidth: '150px' }}
        >
          {uniqueCountries.map((country, idx) => (
            <option key={idx} value={country}>{country}</option>
          ))}
        </select>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} /> More Filters
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {loading ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>Loading student applications...</p>
        ) : filteredStudents.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            {filterStatus === 'NotReviewed' ? 'No new applications to review.' : filterStatus === 'Pending' ? 'No applications are pending more info.' : filterStatus === 'Reviewed' ? 'No applications have been reviewed yet.' : 'No students found.'}
          </p>
        ) : (
          filteredStudents.map((student, index) => (
            <div className="card" key={index} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {student.initials}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>{student.name}</h3>
                <span className={`badge ${student.status === 'Applied' ? 'badge-approved' : student.status === 'Pending' ? 'badge-pending' : 'badge-review'}`} style={{ marginTop: '4px', fontSize: '0.75rem' }}>
                  {student.status}
                </span>
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                <GraduationCap size={16} /> <strong>Course:</strong> {student.course}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                <MapPin size={16} /> <strong>Country:</strong> {student.country}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                <Award size={16} /> <strong>Score:</strong> {student.score}
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '16px', paddingTop: '16px', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                <strong>Target Unis:</strong> {student.unis}
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}
              onClick={() => handleSelectStudent(student)}
            >
              <Eye size={16} /> View Details
            </button>
          </div>
        )))}
      </div>

      {selectedStudent && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content card fade-in" style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', backgroundColor: 'white', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h2 style={{ margin: 0, color: 'var(--text-dark)' }}>Application Details</h2>
              <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)' }}>&times;</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {/* Personal Info */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>
                  <h4 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.1rem' }}>Personal Information</h4>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', color: verification.personal ? 'var(--success-color)' : '#ef4444', fontWeight: 500 }}>
                    <input type="checkbox" checked={verification.personal} onChange={(e) => setVerification({...verification, personal: e.target.checked})} style={{ cursor: 'pointer' }} />
                    {verification.personal ? 'Verified' : 'Not Verified'}
                  </label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-light)' }}>Full Name:</strong> <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{selectedStudent.name}</span></p>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-light)' }}>Email:</strong> <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{selectedStudent.email || 'student@example.com'}</span></p>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-light)' }}>Phone:</strong> <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{selectedStudent.phone || '+1 (555) 123-4567'}</span></p>
                </div>
              </div>
              
              {/* Academic Info */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>
                  <h4 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.1rem' }}>Academic Profile</h4>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', color: verification.academic ? 'var(--success-color)' : '#ef4444', fontWeight: 500 }}>
                    <input type="checkbox" checked={verification.academic} onChange={(e) => setVerification({...verification, academic: e.target.checked})} style={{ cursor: 'pointer' }} />
                    {verification.academic ? 'Verified' : 'Not Verified'}
                  </label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-light)' }}>CGPA:</strong> <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{selectedStudent.cgpa || '8.5 / 10.0'}</span></p>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-light)' }}>Backlogs:</strong> <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{selectedStudent.backlogs !== undefined ? selectedStudent.backlogs : '0'}</span></p>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-light)' }}>{selectedStudent.exam_type ? selectedStudent.exam_type.toUpperCase() : 'Test'} Score:</strong> <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{selectedStudent.exam_score || selectedStudent.score || 'N/A'}</span></p>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>
                  <h4 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.1rem' }}>Study Preferences</h4>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', color: verification.preferences ? 'var(--success-color)' : '#ef4444', fontWeight: 500 }}>
                    <input type="checkbox" checked={verification.preferences} onChange={(e) => setVerification({...verification, preferences: e.target.checked})} style={{ cursor: 'pointer' }} />
                    {verification.preferences ? 'Verified' : 'Not Verified'}
                  </label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-light)' }}>Target Country:</strong> <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{selectedStudent.country}</span></p>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-light)' }}>Course/Branch:</strong> <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{selectedStudent.course || selectedStudent.branch}</span></p>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-light)' }}>Intake:</strong> <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{selectedStudent.intake || 'Fall 2025'}</span></p>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-light)' }}>Budget (Yearly):</strong> <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{selectedStudent.budget ? `$${selectedStudent.budget}` : '$30,000'}</span></p>
                </div>
              </div>

              {/* Application Status */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>
                  <h4 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.1rem' }}>Application Status</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong style={{ color: 'var(--text-light)' }}>Current Status:</strong> <span className={`badge ${selectedStudent.status === 'Applied' ? 'badge-approved' : selectedStudent.status === 'Pending' ? 'badge-pending' : 'badge-review'}`}>{selectedStudent.status}</span></p>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-light)' }}>Target Universities:</strong> <span style={{ color: 'var(--text-dark)', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{selectedStudent.unis || 'Pending Selection'}</span></p>
                  <p style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: 'var(--text-light)' }}>Application Date:</strong> <span style={{ color: 'var(--text-dark)', fontWeight: 500 }}>{new Date().toLocaleDateString()}</span></p>
                </div>
              </div>
            </div>

            {/* Request Additional Information Section */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '12px', fontSize: '1.1rem' }}>Request Additional Information</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '16px' }}>Do you need more details or specific documents from the student? Send them a request below.</p>
              <textarea 
                value={additionalRequest}
                onChange={(e) => setAdditionalRequest(e.target.value)}
                placeholder="e.g., Please upload your 12th-grade mark sheet and provide your exact IELTS TRF number..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', minHeight: '100px', marginBottom: '16px', fontFamily: 'inherit', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => { 
                    if(!additionalRequest.trim()) return;
                    setRequestSent(true); 
                    const currentStudent = selectedStudent;
                    
                    // Show success message for 1.2s before closing
                    setTimeout(() => {
                      setRequestSent(false); 
                      handleStatusUpdate('Pending', currentStudent, additionalRequest); 
                      setAdditionalRequest(''); 
                    }, 1200); 
                  }}
                  disabled={!additionalRequest.trim()}
                  style={{ opacity: !additionalRequest.trim() ? 0.6 : 1, cursor: !additionalRequest.trim() ? 'not-allowed' : 'pointer' }}
                >
                  Send Request to Student
                </button>
                {requestSent && <span className="fade-in" style={{ color: 'var(--success-color)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>✓ Request Sent! Status changed to Pending.</span>}
              </div>
            </div>

            <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn-primary" onClick={() => setSelectedStudent(null)}>Close Window</button>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => handleStatusUpdate('Rejected')}
                >
                  Reject Application
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => handleStatusUpdate('Accepted')}
                >
                  Accept Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedStudents;
