import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RoleBasedRoute({ allowedRoles, children }: { allowedRoles?: string[], children: React.ReactNode }) {
  const { user, role, loading, profile } = useAuth();
  const location = useLocation();

  // Wait for auth initialization to prevent the "flicker"
  if (loading) return null; 

  if (!user) {
    // Redirect to /login and preserve state to return after auth
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Security Check: Force Password Reset if flagged in profile
  if (profile?.must_change_password && location.pathname !== '/reset-password') {
    return <Navigate to="/reset-password" replace />;
  }

  // Privilege Logic: APP_OWNER bypasses all guards
  if (role === 'APP_OWNER') return <>{children}</>;

  // Standard Role Check
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}