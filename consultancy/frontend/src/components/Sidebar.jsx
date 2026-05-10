import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileCheck, Activity, Calendar, MessageSquare, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/assigned-students', name: 'Assigned Students', icon: <Users size={20} /> },
    { path: '/applications', name: 'Reviews', icon: <FileCheck size={20} /> },
    { path: '/status-updates', name: 'Status Updates', icon: <Activity size={20} /> },
    { path: '/meetings', name: 'Meetings', icon: <Calendar size={20} /> },
    { path: '/messages', name: 'Messages', icon: <MessageSquare size={20} /> },
    { path: '/settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
