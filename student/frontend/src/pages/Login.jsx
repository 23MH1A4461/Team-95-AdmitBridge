import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('student');

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'student') {
      const redirectTo = location.state?.redirectTo || '/dashboard';
      navigate(redirectTo);
    } else if (role === 'consultancy') {
      window.location.href = 'http://localhost:5174/';
    } else if (role === 'admin') {
      window.location.href = 'http://localhost:5175/';
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-left">
        <div className="auth-logo">
          <img src={logo} alt="AdmitBridge Logo" />
        </div>
        <div className="auth-content">
          <h1>Welcome Back to AdmitBridge</h1>
          <p>Sign in to continue to your dashboard.</p>
          
          <div className="role-tabs">
            <button type="button" className={`role-tab ${role === 'student' ? 'active' : ''}`} onClick={() => setRole('student')}>Student</button>
            <button type="button" className={`role-tab ${role === 'consultancy' ? 'active' : ''}`} onClick={() => setRole('consultancy')}>Consultancy</button>
            <button type="button" className={`role-tab ${role === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')}>Admin</button>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>
            
            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            
            <button type="submit" className="btn-primary w-100">Sign In</button>
          </form>
          
          <p className="auth-footer">
            Don't have an account? <a href="/register">Sign up for free</a>
          </p>
        </div>
      </div>
      <div className="auth-right">
        {/* We can use an abstract background or image here */}
        <div className="auth-testimonial">
          <h2>"AdmitBridge made my Stanford application process completely stress-free!"</h2>
          <p>- Sarah Jenkins, MS Computer Science</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
