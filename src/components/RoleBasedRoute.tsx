import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  allowedRoles?: string[];
  children: React.ReactNode;
}

export default function RoleBasedRoute({ allowedRoles = [], children }: Props) {
  const { user, userData, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!user || !userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userData.must_change_password) {
    return <Navigate to="/change-password" replace />;
  }

  const role = userData.role;

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
