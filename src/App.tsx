import { Routes, Route, Navigate } from 'react-router-dom';
import * as Pages from './pages'; 
import Layout from './components/Layout';
import RoleBasedRoute from './components/RoleBasedRoute';
import { useAuth } from './hooks/useAuth';
import { Toaster } from './components/ui/toaster'; 

function App() {
  const { loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center">
      <div className="h-16 w-16 border-4 border-[#D4AF37] border-t-transparent animate-spin rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]" />
      <p className="mt-4 text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] font-bold animate-pulse">
        Initializing Secure Terminal
      </p>
    </div>
  );

  return (
    <>
      <Routes>
        {/* Public Access Gates */}
        <Route path="/" element={<Pages.EnterprisePortal />} />
        <Route path="/portal" element={<Pages.EnterprisePortal />} />
        <Route path="/login" element={<Pages.Login />} />
        <Route path="/unauthorized" element={<Pages.Unauthorized />} />
        <Route path="/reset-password" element={<Pages.ForcePasswordReset />} />
        <Route path="/landing" element={<Pages.LandingPage />} />
        <Route path="/apk" element={<Pages.DownloadAPK />} />
        <Route path="/manual" element={<Pages.ManualPage />} />
        <Route path="/courier" element={<Pages.CourierApp />} />

        {/* Enterprise Suite (Requires Auth & Shared Navigation) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<RoleBasedRoute><Pages.Dashboard /></RoleBasedRoute>} />
          
          {/* Executive Tier */}
          <Route path="/admin/dashboard" element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'APP_OWNER']}><Pages.AdminDashboard /></RoleBasedRoute>} />
          <Route path="/admin/control" element={<RoleBasedRoute allowedRoles={['APP_OWNER']}><Pages.ControlRoom /></RoleBasedRoute>} />
          <Route path="/admin/users" element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'APP_OWNER']}><Pages.UserManagement /></RoleBasedRoute>} />
          <Route path="/admin/roles" element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'APP_OWNER']}><Pages.RoleManagement /></RoleBasedRoute>} />
          <Route path="/admin/audit" element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'APP_OWNER']}><Pages.AuditDashboard /></RoleBasedRoute>} />
          <Route path="/admin/settings" element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'APP_OWNER']}><Pages.SystemSettings /></RoleBasedRoute>} />

          {/* Operational Tier */}
          <Route path="/operations" element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_ADMIN']}><Pages.Operations /></RoleBasedRoute>} />
          <Route path="/ops/receiving" element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_ADMIN']}><Pages.ReceivingBay /></RoleBasedRoute>} />
          <Route path="/ops/dispatch" element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_ADMIN']}><Pages.DispatchManagement /></RoleBasedRoute>} />
          <Route path="/ops/hub" element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'WAREHOUSE_MANAGER']}><Pages.HubOperations /></RoleBasedRoute>} />
          
          {/* Specialized Modules */}
          <Route path="/finance" element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'FINANCE_ADMIN']}><Pages.Finance /></RoleBasedRoute>} />
          <Route path="/hr" element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN']}><Pages.HumanResources /></RoleBasedRoute>} />
          <Route path="/reports" element={<RoleBasedRoute allowedRoles={['SUPER_ADMIN', 'OPERATIONS_ADMIN']}><Pages.Reports /></RoleBasedRoute>} />
        </Route>

        {/* Global Safety Catch */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster /> 
    </>
  );
}

export default App;