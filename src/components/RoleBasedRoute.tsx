import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTE_PATHS, UserRole } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';

/**
 * RoleBasedRoute handles authorization for protected pages.
 * It checks if the user is authenticated and if their role is within the allowed list.
 * 
 * @param allowedRoles - Array of UserRole strings permitted to access the route
 * @param children - The component(s) to render if authorized
 */
interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function RoleBasedRoute({ allowedRoles, children }: RoleBasedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const { userData, legacyUser } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user || !userData) {
    return <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />;
  }

  // Check if user's role is allowed for this specific route
  const hasAccess = allowedRoles.includes(legacyUser?.role as UserRole);

  if (!hasAccess) {
    // If user is authenticated but lacks permission, redirect to their default dashboard
    // or a 403-style unauthorized notice. Here we go back to root.
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background px-4">
        <div className="max-w-md w-full rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-foreground">Access Denied</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Your current role ({legacyUser?.role}) does not have permission to view this section.
            Please contact your supervisor if you believe this is an error.
          </p>
          <Navigate to={ROUTE_PATHS.DASHBOARD} replace />
        </div>
      </div>
    );
  }

  // Render protected content if all checks pass
  return <>{children}</>;
}
