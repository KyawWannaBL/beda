import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RoleBasedRoute({ allowedRoles, children }: { allowedRoles?: string[], children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // 1. HARD GUARD: If loading is true, NEVER redirect. 
  // Stay on this screen until Supabase answers.
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-luxury-gold border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  // 2. If no user, go to /login. If /login is not exported, this fails.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authority Check
  if (allowedRoles && role && !allowedRoles.includes(role) && role !== 'APP_OWNER') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}