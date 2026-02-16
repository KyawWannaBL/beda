import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Use relative path for stability

interface Props {
  allowedRoles?: string[];
  requiredPermission?: string;
  children: React.ReactNode;
}

export default function RoleBasedRoute({ allowedRoles, requiredPermission, children }: Props) {
  const { user, role, hasPermission, loading } = useAuth();
  const location = useLocation();

  // 1. Prevent "Black Screen" during init
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-emerald-500 font-mono animate-pulse text-xs tracking-[0.3em]">
          VERIFYING ENCRYPTED SESSION...
        </div>
      </div>
    );
  }

  // 2. Redirect to Login if no session exists
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. Role-Based Access Control (RBAC)
  if (allowedRoles && role && !allowedRoles.includes(role) && role !== 'APP_OWNER') {
    console.warn(`Access Denied: Role '${role}' lacks authority for this module.`);
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Permission-Based Access Control
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}