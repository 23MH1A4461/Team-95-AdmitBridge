import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('student');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (role === 'student') {
        const redirectTo = location.state?.redirectTo || '/dashboard';
        navigate(redirectTo);
      } else if (role === 'consultancy') {
        window.location.href = `${import.meta.env.VITE_CONSULTANCY_PORTAL_URL}/?token=${data.token}`;
      } else if (role === 'admin') {
        window.location.href = `${import.meta.env.VITE_ADMIN_PORTAL_URL}/?token=${data.token}`;
      }
    } catch (err) {
      setError(err.message);
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
            {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
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
