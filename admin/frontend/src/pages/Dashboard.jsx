import React from 'react';
import { LayoutDashboard, Users, Building2, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Clock, Server, CheckCircle, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  // Mock Data
  const userGrowthData = [
    { name: 'Jan', students: 4000, consultancies: 240 },
    { name: 'Feb', students: 3000, consultancies: 139 },
    { name: 'Mar', students: 2000, consultancies: 980 },
    { name: 'Apr', students: 2780, consultancies: 390 },
    { name: 'May', students: 1890, consultancies: 480 },
    { name: 'Jun', students: 2390, consultancies: 380 },
    { name: 'Jul', students: 3490, consultancies: 430 },
  ];

  const applicationStatusData = [
    { name: 'Accepted', value: 4500, fill: '#10B981' },
    { name: 'Pending', value: 3200, fill: '#F59E0B' },
    { name: 'Rejected', value: 800, fill: '#EF4444' },
  ];

  const recentActivity = [
    { id: 1, action: 'New Student Registered', details: 'Alice Smith joined the platform.', time: '2 mins ago', icon: <Users size={16} />, color: 'var(--primary-color)' },
    { id: 2, action: 'Consultancy Verified', details: 'Global Ed Advisors was approved by Admin.', time: '1 hour ago', icon: <CheckCircle size={16} />, color: 'var(--success-color)' },
    { id: 3, action: 'High Traffic Alert', details: 'Unusual spike in application submissions.', time: '3 hours ago', icon: <AlertTriangle size={16} />, color: 'var(--warning-color)' },
    { id: 4, action: 'System Backup', details: 'Automated database backup completed.', time: '5 hours ago', icon: <Server size={16} />, color: '#3B82F6' },
  ];

  const StatCard = ({ title, value, change, isPositive, icon }) => (
    <div className="card stat-card">
      <div className="stat-header">
        <div>
          <h3>{title}</h3>
          <h2>{value}</h2>
        </div>
        <div className="stat-icon-wrapper">
          {icon}
        </div>
      </div>
      <div className={`stat-trend ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{change} from last month</span>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container fade-in">
      <div className="page-header">
        <div className="page-header-icon">
          <LayoutDashboard size={24} />
        </div>
        <div className="page-header-text">
          <h1>System Dashboard</h1>
          <p>Overview of platform performance and key metrics.</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Students" value="24,592" change="+12.5%" isPositive={true} icon={<Users size={24} className="text-primary" />} />
        <StatCard title="Active Consultancies" value="1,245" change="+3.2%" isPositive={true} icon={<Building2 size={24} className="text-secondary" />} />
        <StatCard title="Total Applications" value="84,230" change="+18.4%" isPositive={true} icon={<TrendingUp size={24} className="text-success" />} />
        <StatCard title="Average Response Time" value="1.2 Days" change="-0.5%" isPositive={false} icon={<LayoutDashboard size={24} className="text-warning" />} />
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <h3>User Growth Over Time</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="students" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <h3>Application Status Breakdown</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationStatusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="card activity-card">
          <div className="card-header">
            <h3>Recent System Activity</h3>
            <button className="btn-icon"><Activity size={18} /></button>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon-container" style={{ backgroundColor: `${activity.color}15`, color: activity.color }}>
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <h4>{activity.action}</h4>
                  <p>{activity.details}</p>
                </div>
                <div className="activity-time">
                  <Clock size={12} />
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-btn">View All Logs</button>
        </div>

        <div className="card health-card">
          <div className="card-header">
            <h3>System Health</h3>
            <button className="btn-icon"><Server size={18} /></button>
          </div>
          <div className="health-metrics">
            <div className="health-metric">
              <div className="metric-info">
                <span>Server Uptime</span>
                <span className="text-success">99.98%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width: '99%', backgroundColor: 'var(--success-color)'}}></div></div>
            </div>
            <div className="health-metric">
              <div className="metric-info">
                <span>Database Load</span>
                <span className="text-warning">64%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width: '64%', backgroundColor: 'var(--warning-color)'}}></div></div>
            </div>
            <div className="health-metric">
              <div className="metric-info">
                <span>API Latency</span>
                <span className="text-primary">42ms</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{width: '15%', backgroundColor: 'var(--primary-color)'}}></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
