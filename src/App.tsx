import { Routes, Route, useLocation } from 'react-router-dom';
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

function App() {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<EnterprisePortal />} />
      <Route path="/portal" element={<EnterprisePortal />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes - Wrapped in shared Layout */}
      <Route element={<Layout />}>
        
        {/* User Specific Dashboards */}
        <Route
          path="/dashboard"
          element={
            <RoleBasedRoute>
              <Dashboard />
            </RoleBasedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN']}>
              <AdminDashboard />
            </RoleBasedRoute>
          }
        />
        
        {/* Operations & Logistics */}
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
        
        {/* Business & Finance */}
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

        {/* Administration & HR */}
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

        <Route
          path="/reports"
          element={
            <RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_ADMIN', 'FINANCE_ADMIN']}>
              <Reports />
            </RoleBasedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;