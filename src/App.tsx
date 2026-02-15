import { Routes, Route, Navigate } from 'react-router-dom';
import {
  EnterprisePortal,
  Dashboard,
  AdminDashboard, 
  Operations,
  Finance,
  HumanResources,
  Marketing,
  Substation,
  RoleManagement,
  UserManagement,
  SystemSettings,
  AuditLogs,
  Reports,
  Unauthorized
} from './pages';
import Layout from './components/Layout';
import RoleBasedRoute from './components/RoleBasedRoute';
import { useAuth } from './hooks/useAuth';

/**
 * Main Application Component
 * Handles global routing, authentication state, and role-based access control.
 */
function App() {
  const { loading } = useAuth();

  // Show a centralized loading state while checking Supabase session
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* --- Public Access Routes --- */}
      <Route path="/" element={<EnterprisePortal />} />
      <Route path="/portal" element={<EnterprisePortal />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* --- Private Enterprise Routes (Requires Auth & Layout) --- */}
      <Route element={<Layout />}>
        
        {/* General Dashboard (Base access) */}
        <Route
          path="/dashboard"
          element={
            <RoleBasedRoute>
              <Dashboard />
            </RoleBasedRoute>
          }
        />

        {/* Master Admin Mission Control */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />
        
        {/* Logistics & Supply Chain */}
        <Route
          path="/operations"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'OPERATIONS_STAFF']}>
              <Operations />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/substation"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'SUBSTATION_MANAGER']}>
              <Substation />
            </RoleBasedRoute>
          }
        />
        
        {/* Revenue & Growth */}
        <Route
          path="/finance"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'FINANCE_ADMIN', 'FINANCE_STAFF', 'FINANCE_USER']}>
              <Finance />
            </RoleBasedRoute>
          }
        />
        
        <Route
          path="/marketing"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'MARKETING_ADMIN', 'MARKETING']}>
              <Marketing />
            </RoleBasedRoute>
          }
        />

        {/* Personnel & Administration */}
        <Route
          path="/hr"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN']}>
              <HumanResources />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN']}>
              <UserManagement />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/admin/roles"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN']}>
              <RoleManagement />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN']}>
              <SystemSettings />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/admin/audit"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN']}>
              <AuditLogs />
            </RoleBasedRoute>
          }
        />

        {/* Data & Analytics */}
        <Route
          path="/reports"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN']}>
              <Reports />
            </RoleBasedRoute>
          }
        />
      </Route>

      {/* --- Fallback Route --- */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;