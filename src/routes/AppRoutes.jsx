import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import Landing from '../pages/Landing';
import Auth from '../pages/Auth';
import Dashboard from '../pages/Dashboard';
import Onboarding from '../pages/Onboarding';
import Settings from '../pages/Settings';
import InvestorDashboard from '../pages/InvestorDashboard';
import DashboardManager from './DashboardManager';
import ScrollToTop from '../components/ScrollToTop';
import StartupDetail from '../pages/StartupDetail';
import Loader from '../components/Loader';

function ProtectedRoute({ children }) {
  const { user, userData, loading } = useAuth();

  if (loading) return <Loader text="Authenticating..." />;
  
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // If the user exists but hasn't completed onboarding, explicitly route to /onboarding
  if (userData && !userData.onboardingComplete) {
    return <Navigate to="/onboarding" />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardManager /></ProtectedRoute>} />
        <Route path="/investor" element={<ProtectedRoute><InvestorDashboard /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/startup/:id" element={<ProtectedRoute><StartupDetail /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
