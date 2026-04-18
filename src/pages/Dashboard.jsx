import { Routes, Route } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHome from './dashboard/DashboardHome';
import '../styles/dashboard.css';

// Placeholder components for new views
function ComingSoon({ title }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#F3F4F6' }}>{title}</h2>
      <p>This module is currently being built for the new workflow.</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main className="dashboard-main fade-in">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/submit" element={<ComingSoon title="Submit Startup" />} />
          <Route path="/projects" element={<ComingSoon title="My Projects" />} />
          <Route path="/messages" element={<ComingSoon title="Messages" />} />
          <Route path="/funding" element={<ComingSoon title="Funding Status" />} />
          <Route path="/feedback" element={<ComingSoon title="AI Feedback" />} />
        </Routes>
      </main>
    </div>
  );
}

