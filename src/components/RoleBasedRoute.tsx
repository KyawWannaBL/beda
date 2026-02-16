import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  allowedRoles?: string[];
  children: React.ReactNode;
}

export default function RoleBasedRoute({ allowedRoles, children }: Props) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // 1. Prevent hydration/mount crashes
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-luxury-obsidian">
        <div className="text-luxury-gold animate-pulse font-mono text-xs uppercase tracking-[0.3em]">
          Verifying Encrypted Session...
        </div>
      </div>
    );
  }

  // 2. BREAK THE LOOP: Redirect to /login instead of /
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authority Check (RBAC)
  if (allowedRoles && role && !allowedRoles.includes(role) && role !== 'APP_OWNER') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}