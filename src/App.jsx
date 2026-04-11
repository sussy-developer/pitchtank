import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import PricingModal from './components/PricingModal';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './hooks/AuthContext';
import './styles/app.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const location = useLocation();

  // Hide navbar on auth page (it has its own logo/back)
  const hideNavbar = location.pathname === '/auth';
  // Hide navbar on dashboard & settings (they have their own sidebars)
  const hideOnDashboard = location.pathname === '/dashboard' || location.pathname === '/settings';

  return (
    <AuthProvider>
      <ScrollToTop />
      {!hideNavbar && !hideOnDashboard && (
        <Navbar onPricingClick={() => setIsPricingOpen(true)} />
      )}
      <AppRoutes />
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </AuthProvider>
  );
}
