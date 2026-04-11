import React from 'react';
import Dashboard from '../pages/Dashboard';
import InvestorDashboard from '../pages/InvestorDashboard';
import { useAuth } from '../hooks/AuthContext';

export default function DashboardManager() {
  const { userData } = useAuth();
  
  // Retrieve role safely from Firebase DB state
  const role = userData?.role || 'investor';

  if (role === 'investor') {
    return <InvestorDashboard />;
  }

  return <Dashboard />;
}
