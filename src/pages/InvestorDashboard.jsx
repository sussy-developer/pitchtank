import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';
import Marketplace from './investor/Marketplace';
import InvestorHome from './investor/InvestorHome';
import MyInvestments from './investor/MyInvestments';
import '../styles/investor.css';

// Placeholder components for new views
function ComingSoon({ title }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
      <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#F3F4F6' }}>{title}</h2>
      <p>We are currently refining the investor experience for this module.</p>
    </div>
  );
}

export default function InvestorDashboard() {
  return (
    <div className="investor-layout">
      {/* Sidebar now replaced by the shared DashboardSidebar which checks role */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="investor-main">
        <Routes>
          <Route path="/" element={<InvestorHome />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/investments" element={<MyInvestments />} />
          <Route path="/watchlist" element={<ComingSoon title="Watchlist" />} />
          <Route path="/messages" element={<ComingSoon title="Messages" />} />
          <Route path="/analytics" element={<ComingSoon title="Analytics" />} />
        </Routes>
      </main>
    </div>
  );
}

