import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  requiredPermission?: string;
  children: React.ReactNode;
}

export default function RoleBasedRoute({ requiredPermission, children }: Props) {
  // We now use 'user' (which contains the profile) and the 'hasPermission' helper
  const { user, hasPermission, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle password change enforcement (checking snake_case from DB profile)
  if (user.must_change_password) {
    return <Navigate to="/change-password" replace />;
  }

  // --- PERMISSION CHECK UPGRADE ---
  // If a permission is required and the user lacks it, redirect to unauthorized
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}