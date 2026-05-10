import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate register
    navigate('/dashboard');
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-left">
        <div className="auth-logo">
          <img src={logo} alt="AdmitBridge Logo" />
        </div>
        <div className="auth-content">
          <h1>Create Your Account</h1>
          <p>Join AdmitBridge to start your study abroad journey.</p>
          
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>
            
            <button type="submit" className="btn-primary w-100">Sign Up</button>
          </form>
          
          <p className="auth-footer">
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </div>
      </div>
      <div className="auth-right auth-right-register">
        <div className="auth-testimonial">
          <h2>"AdmitBridge's personalized college suggestions were incredibly accurate."</h2>
          <p>- David Chen, Accepted to MIT</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
