import React from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { useAuth } from '../hooks/AuthContext';

export default function DashboardManager() {
  const { userData } = useAuth();
  
  // Retrieve role safely from Firebase DB state
  const role = userData?.role || 'investor';

  if (role === 'investor') {
    return <Navigate to="/investor" replace />;
  }

  return <Dashboard />;
}
