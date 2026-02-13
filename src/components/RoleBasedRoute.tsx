import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

type AnyRole = string;

interface RoleBasedRouteProps {
  allowedRoles: AnyRole[];
  children: React.ReactNode;
}

export default function RoleBasedRoute({ allowedRoles, children }: RoleBasedRouteProps) {
  const location = useLocation();
  const { user, userData, legacyUser, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated || !user || !userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Force password change gate
  if (userData.mustChangePassword) {
    return <Navigate to="/login" state={{ from: location, forceChange: true }} replace />;
  }

  const role = (userData.role || (legacyUser as any)?.role) as AnyRole;

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.includes(role);
    if (!hasAccess) return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
