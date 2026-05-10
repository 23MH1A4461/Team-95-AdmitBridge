import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AssignedStudents from './pages/AssignedStudents';
import Applications from './pages/Applications';
import StatusUpdates from './pages/StatusUpdates';
import Meetings from './pages/Meetings';
import Messages from './pages/Messages';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assigned-students" element={<AssignedStudents />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/status-updates" element={<StatusUpdates />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
