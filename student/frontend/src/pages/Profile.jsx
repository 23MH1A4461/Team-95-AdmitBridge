import React, { useState, useEffect, useRef } from 'react';
import { User, Save, CheckCircle, Edit3, MapPin, Target, Mail, Phone, Briefcase, Award, GraduationCap, DollarSign, BookOpen, Camera } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    cgpa: '8.5',
    exam_type: 'ielts',
    exam_score: '7.5',
    country: 'US',
    branch: 'Computer Science',
    budget: '30000',
    backlogs: '0',
    intake: 'Fall',
    photo: null
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
      setFormData(prev => ({ ...prev, ...JSON.parse(savedProfile) }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('studentProfile', JSON.stringify(formData));
      window.dispatchEvent(new Event('profileUpdated'));
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Error saving profile. If you uploaded a photo, the file size might be too large. Please use a smaller image.");
    }
  };

  const renderViewMode = () => (
    <div className="profile-view">
      <div className="profile-cover"></div>
      
      <div className="profile-header">
        <div className="profile-photo-container">
          {formData.photo ? (
            <img src={formData.photo} alt="Profile" className="profile-photo-img" />
          ) : (
            <div className="profile-photo-placeholder">
              <User size={64} color="white" />
            </div>
          )}
        </div>
        
        <div className="profile-title-area">
          <h2>{formData.name}</h2>
          <p className="profile-subtitle">Student ID: #1048291</p>
        </div>
      </div>

      <div className="profile-details-grid">
        <div className="detail-card">
          <div className="detail-icon"><Mail size={24} /></div>
          <div className="detail-content">
            <span className="detail-label">Email</span>
            <span className="detail-value">{formData.email}</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon"><Phone size={24} /></div>
          <div className="detail-content">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{formData.phone}</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon"><Target size={24} /></div>
          <div className="detail-content">
            <span className="detail-label">Target Country</span>
            <span className="detail-value">{formData.country === 'US' ? 'USA' : formData.country || 'Not Set'}</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon"><Briefcase size={24} /></div>
          <div className="detail-content">
            <span className="detail-label">Preferred Branch</span>
            <span className="detail-value">{formData.branch || 'Not Set'}</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon"><GraduationCap size={24} /></div>
          <div className="detail-content">
            <span className="detail-label">Current CGPA</span>
            <span className="detail-value">{formData.cgpa ? `${formData.cgpa} / 10.0` : 'Not Set'}</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon"><Award size={24} /></div>
          <div className="detail-content">
            <span className="detail-label">{formData.exam_type ? formData.exam_type.toUpperCase() : 'Test'} Score</span>
            <span className="detail-value">{formData.exam_score || 'Not Set'}</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon"><BookOpen size={24} /></div>
          <div className="detail-content">
            <span className="detail-label">Backlogs</span>
            <span className="detail-value">{formData.backlogs || '0'}</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon"><DollarSign size={24} /></div>
          <div className="detail-content">
            <span className="detail-label">Budget (Per Year)</span>
            <span className="detail-value">{formData.budget ? `$${parseInt(formData.budget).toLocaleString()}` : 'Not Set'}</span>
          </div>
        </div>
      </div>

      <div className="view-actions">
        {saved && <span className="save-indicator"><CheckCircle size={18} /> Saved successfully!</span>}
        <button className="btn-primary edit-btn" onClick={() => setIsEditing(true)}>
          <Edit3 size={18} /> Edit Profile
        </button>
      </div>
    </div>
  );

  const renderEditMode = () => (
    <div className="profile-edit-wrapper fade-in">
      <div className="profile-edit">
        <form className="template-form-card" onSubmit={handleSubmit}>
          
          <div className="template-header">
            <h2>Edit Profile</h2>
            {/* Optional visual stepper mimicking the image */}
            <div className="template-stepper">
               <div className="step active"><span className="step-num">1</span> Basic Details</div>
               <div className="step-line"></div>
               <div className="step"><span className="step-num">2</span> Academic</div>
               <div className="step-line"></div>
               <div className="step"><span className="step-num">3</span> Preferences</div>
            </div>
          </div>

          {/* Section 1: Basic Details & Photo */}
          <div className="template-section">
            <h3 className="template-section-title">Basic Details</h3>
            
            <div className="basic-details-flex">
              <div className="basic-details-inputs">
                <div className="form-group-template full-width">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Full Name" required />
                </div>
                <div className="template-grid">
                  <div className="form-group-template">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" required />
                  </div>
                  <div className="form-group-template">
                    <label>Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Phone" />
                  </div>
                </div>
              </div>

              <div className="template-photo-upload">
                <div className="photo-circle-btn" onClick={() => fileInputRef.current.click()}>
                  {formData.photo ? (
                    <img src={formData.photo} alt="Preview" />
                  ) : (
                    <Camera size={28} color="white" />
                  )}
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} style={{ display: 'none' }} />
                <span className="photo-add-text" onClick={() => fileInputRef.current.click()}>Add Photo</span>
              </div>
            </div>
          </div>

          {/* Section 2: Academics */}
          <div className="template-section">
            <h3 className="template-section-title">Academic Details</h3>
            <div className="template-grid">
              <div className="form-group-template">
                <label>Academic Percentage / CGPA</label>
                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="e.g. 8.5" required />
              </div>
              <div className="form-group-template">
                <label>Number of Backlogs</label>
                <input type="number" name="backlogs" value={formData.backlogs} onChange={handleChange} placeholder="e.g. 0" />
              </div>
              <div className="form-group-template">
                <label>Standardized Test</label>
                <select name="exam_type" value={formData.exam_type} onChange={handleChange}>
                  <option value="ielts">IELTS</option>
                  <option value="toefl">TOEFL</option>
                  <option value="duolingo">Duolingo</option>
                  <option value="gre">GRE</option>
                </select>
              </div>
              <div className="form-group-template">
                <label>Test Score</label>
                <input type="number" step="0.1" name="exam_score" value={formData.exam_score} onChange={handleChange} placeholder="e.g. 7.5" />
              </div>
            </div>
          </div>

          {/* Section 3: Preferences */}
          <div className="template-section">
            <h3 className="template-section-title">Study Preferences</h3>
            <div className="template-grid">
              <div className="form-group-template">
                <label>Preferred Country</label>
                <select name="country" value={formData.country} onChange={handleChange}>
                  <option value="US">USA</option>
                  <option value="UK">UK</option>
                  <option value="Germany">Germany</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
              <div className="form-group-template">
                <label>Preferred Branch</label>
                <select name="branch" value={formData.branch} onChange={handleChange}>
                  <option value="">Select Branch</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Electronics and Communication">Electronics and Communication</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Software Engineering">Software Engineering</option>
                </select>
              </div>
              <div className="form-group-template">
                <label>Preferred Intake</label>
                <select name="intake" value={formData.intake} onChange={handleChange}>
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              <div className="form-group-template">
                <label>Budget (USD Per Year)</label>
                <input type="number" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. 30000" />
              </div>
            </div>
          </div>

          <div className="template-actions">
            <button type="button" className="btn-cancel-pill" onClick={() => setIsEditing(false)}>Cancel</button>
            <button type="submit" className="btn-save-pill">Save & Continue</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="profile-page fade-in">
      {isEditing ? renderEditMode() : renderViewMode()}
    </div>
  );
};

export default Profile;
