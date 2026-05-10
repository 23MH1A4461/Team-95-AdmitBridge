import React from 'react';
import { Users, FileCheck, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="dashboard fade-in">
      <div className="page-header">
        <div className="page-header-icon" style={{ backgroundColor: 'var(--primary-color)' }}>
          <TrendingUp size={24} color="white" />
        </div>
        <div className="page-header-text">
          <h1>Consultancy Dashboard</h1>
          <p>Overview of your active students, applications, and performance metrics.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary-color)', padding: '16px', borderRadius: '12px' }}>
            <Users size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '4px', color: 'var(--text-dark)' }}>124</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Active Students</p>
          </div>
        </div>
        <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', padding: '16px', borderRadius: '12px' }}>
            <FileCheck size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '4px', color: 'var(--text-dark)' }}>89</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Pending Applications</p>
          </div>
        </div>
        <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)', padding: '16px', borderRadius: '12px' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '4px', color: 'var(--text-dark)' }}>92%</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Success Rate</p>
          </div>
        </div>
        <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--secondary-color)', padding: '16px', borderRadius: '12px' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', marginBottom: '4px', color: 'var(--text-dark)' }}>$45k</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Revenue (YTD)</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>Recent Student Leads</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-light)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '12px 0' }}>Student Name</th>
              <th style={{ padding: '12px 0' }}>Target Country</th>
              <th style={{ padding: '12px 0' }}>Profile Match</th>
              <th style={{ padding: '12px 0' }}>Status</th>
              <th style={{ padding: '12px 0' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 0', fontWeight: 500 }}>John Doe</td>
              <td style={{ padding: '16px 0' }}>USA</td>
              <td style={{ padding: '16px 0' }}><span style={{ color: 'var(--success-color)', fontWeight: 600 }}>95%</span></td>
              <td style={{ padding: '16px 0' }}><span className="badge badge-pending">New Lead</span></td>
              <td style={{ padding: '16px 0' }}><button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Review Profile</button></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 0', fontWeight: 500 }}>Emma Smith</td>
              <td style={{ padding: '16px 0' }}>UK</td>
              <td style={{ padding: '16px 0' }}><span style={{ color: 'var(--warning-color)', fontWeight: 600 }}>82%</span></td>
              <td style={{ padding: '16px 0' }}><span className="badge badge-review">Contacted</span></td>
              <td style={{ padding: '16px 0' }}><button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>View Details</button></td>
            </tr>
            <tr>
              <td style={{ padding: '16px 0', fontWeight: 500 }}>Michael Chen</td>
              <td style={{ padding: '16px 0' }}>Germany</td>
              <td style={{ padding: '16px 0' }}><span style={{ color: 'var(--success-color)', fontWeight: 600 }}>91%</span></td>
              <td style={{ padding: '16px 0' }}><span className="badge badge-approved">Enrolled</span></td>
              <td style={{ padding: '16px 0' }}><button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>View Details</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
