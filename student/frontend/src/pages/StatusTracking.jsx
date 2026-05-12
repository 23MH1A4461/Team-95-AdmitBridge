import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Activity, Check, ChevronDown, ChevronUp, UploadCloud, Send } from 'lucide-react';
import './StatusTracking.css';

const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, { ...options, headers });
};


const StatusTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [application, setApplication] = useState(location.state?.application || null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!application) {
      navigate('/applications');
      return;
    }

    if (application.status === 'Pending') setExpandedStep(2);
    else if (application.status === 'New Lead' || application.status === 'Under Review') setExpandedStep(3);
    else if (application.status === 'Accepted' || application.status === 'Approved' || application.status === 'Rejected') setExpandedStep(4);
    else setExpandedStep(1);
  }, [application?.status, navigate]); // Depend on status so it re-evaluates when polling updates it

  // Polling for live updates
  useEffect(() => {
    if (!application) return;

    const pollInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await authFetch(`${import.meta.env.VITE_API_URL}/students/applications/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Find the current application
          const updatedApp = data.find(app => app._id === application._id);
          
          if (updatedApp && updatedApp.status !== application.status) {
            setApplication(prev => ({
              ...prev,
              status: updatedApp.status
            }));
          }
        }
      } catch (err) {
        console.error("Failed to poll for status updates", err);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(pollInterval);
  }, [application]);

  if (!application) return null;

  const handleResubmit = async () => {
    if (!submissionText.trim()) return;
    setIsSubmitting(true);
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await authFetch(`${import.meta.env.VITE_API_URL}/students/applications/${application._id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Under Review' })
      });
      if (response.ok) {
        setApplication({ ...application, status: 'Under Review' });
        setExpandedStep(3);
        setSubmissionText('');
      } else {
        setError("Failed to submit documents. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error: Failed to submit documents. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStep = (step) => {
    setExpandedStep(expandedStep === step ? null : step);
  };

  const getStepStatus = (stepNumber) => {
    const status = application.status;
    if (stepNumber === 1) return 'completed';
    
    if (stepNumber === 2) {
      if (status === 'Pending') return 'current';
      if (status === 'New Lead' || status === 'Under Review' || status === 'Accepted' || status === 'Approved' || status === 'Rejected') return 'completed';
      return 'upcoming';
    }
    
    if (stepNumber === 3) {
      if (status === 'New Lead' || status === 'Under Review') return 'current';
      if (status === 'Accepted' || status === 'Approved' || status === 'Rejected') return 'completed';
      return 'upcoming';
    }
    
    if (stepNumber === 4) {
      if (status === 'Accepted' || status === 'Approved') return 'completed';
      if (status === 'Rejected') return 'rejected';
      return 'upcoming';
    }
    return 'upcoming';
  };

  return (
    <div className="status-tracking fade-in">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <div className="page-header-icon" style={{ backgroundColor: 'var(--primary-color)' }}>
          <Activity size={24} color="white" />
        </div>
        <div className="page-header-text">
          <h1>Application Status</h1>
          <p>Tracking: <strong>{application.university}</strong></p>
        </div>
      </div>

      <div className="stepper-container card">
        <div className="stepper-header">
          <h2>Current Status</h2>
        </div>
        
        <div className="stepper-body">
          {/* Step 1 */}
          <div className={`stepper-item ${getStepStatus(1)}`}>
            <div className="stepper-icon-container">
              <div className="stepper-icon">{getStepStatus(1) === 'completed' ? <Check size={16} /> : 1}</div>
              <div className="stepper-line"></div>
            </div>
            <div className="stepper-content">
              <div className="stepper-title-row" onClick={() => toggleStep(1)}>
                <h3>Application Sent</h3>
                {expandedStep === 1 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedStep === 1 && (
                <div className="stepper-details fade-in">
                  <p>Your application was successfully forwarded to {application.consultancy}.</p>
                </div>
              )}
            </div>
          </div>

          {/* Step 2 */}
          <div className={`stepper-item ${getStepStatus(2)}`}>
            <div className="stepper-icon-container">
              <div className="stepper-icon">{getStepStatus(2) === 'completed' ? <Check size={16} /> : 2}</div>
              <div className="stepper-line"></div>
            </div>
            <div className="stepper-content">
              <div className="stepper-title-row" onClick={() => toggleStep(2)}>
                <h3>Action Required</h3>
                {expandedStep === 2 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedStep === 2 && (
                <div className="stepper-details fade-in">
                  {application.status === 'Pending' ? (
                    <div className="pending-action-box">
                      <div className="message-from-consultancy">
                        <strong>Message from {application.consultancy}:</strong>
                        <p>{application.message || "Please provide the requested documents."}</p>
                      </div>
                      
                      <div className="submission-form">
                        <label>Your Response / Links to Documents</label>
                        <textarea 
                          placeholder="Provide the requested info or Google Drive links to your documents here..."
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                        />
                        <div className="file-upload-mock">
                          <UploadCloud size={20} />
                          <span>Click to browse or drag and drop files here (Mock)</span>
                        </div>
                        <button 
                          className="btn-primary" 
                          onClick={handleResubmit}
                          disabled={isSubmitting || !submissionText.trim()}
                        >
                          <Send size={16} /> {isSubmitting ? "Submitting..." : "Submit Documents"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>No action is currently required from your side.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Step 3 */}
          <div className={`stepper-item ${getStepStatus(3)}`}>
            <div className="stepper-icon-container">
              <div className="stepper-icon">{getStepStatus(3) === 'completed' ? <Check size={16} /> : 3}</div>
              <div className="stepper-line"></div>
            </div>
            <div className="stepper-content">
              <div className="stepper-title-row" onClick={() => toggleStep(3)}>
                <h3>Under Review</h3>
                {expandedStep === 3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedStep === 3 && (
                <div className="stepper-details fade-in">
                  <p>Our team is reviewing your documents. Once everything is verified, it will be forwarded for the final decision. We will contact you if we need anything else.</p>
                </div>
              )}
            </div>
          </div>

          {/* Step 4 */}
          <div className={`stepper-item ${getStepStatus(4)}`}>
            <div className="stepper-icon-container">
              <div className="stepper-icon">{getStepStatus(4) === 'completed' ? <Check size={16} /> : 4}</div>
            </div>
            <div className="stepper-content">
              <div className="stepper-title-row" onClick={() => toggleStep(4)}>
                <h3>Final Decision</h3>
                {expandedStep === 4 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {expandedStep === 4 && (
                <div className="stepper-details fade-in">
                  {application.status === 'Accepted' || application.status === 'Approved' ? (
                    <div className="decision-box approved">
                      <h4>Congratulations!</h4>
                      <p>Your application to {application.university} has been approved!</p>
                    </div>
                  ) : application.status === 'Rejected' ? (
                    <div className="decision-box rejected">
                      <h4>Application Rejected</h4>
                      <p>Unfortunately, your application was not accepted at this time.</p>
                    </div>
                  ) : (
                    <p>Awaiting final decision from the university.</p>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatusTracking;
