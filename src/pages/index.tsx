import React, { useState, useEffect } from 'react';

// Common layout for all modules
const TerminalLayout = ({ title, children }: { title: string; children?: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black text-white font-sans">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-[#121212] p-10 shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 border-b border-white/5 pb-5 text-white/90">{title}</h1>
        {!isReady ? (
          <div className="py-20 text-center text-white/40 animate-pulse font-mono">{'>'} INITIALIZING SECURE SESSION...</div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {children || <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">ACCESS GRANTED</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// --- RESTORED PORTAL ---
export const EnterprisePortal = () => (
  <TerminalLayout title="Enterprise Portal">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button onClick={() => window.location.href='/operations'} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/50 text-left transition-all">
        <h3 className="font-bold text-lg">Operations</h3>
        <p className="text-sm text-white/40">Manage substation and grid data.</p>
      </button>
      <button onClick={() => window.location.href='/admin/dashboard'} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/50 text-left transition-all">
        <h3 className="font-bold text-lg">System Admin</h3>
        <p className="text-sm text-white/40">Configuration and user control.</p>
      </button>
    </div>
  </TerminalLayout>
);

// --- FIX: Placeholder for CustomerService to stop build error ---
export const CustomerService = () => <TerminalLayout title="Customer Service Terminal" />;

// --- Other Mandatory Exports for App.tsx ---
export const AdminDashboard = () => <TerminalLayout title="Administrative Control Center" />;
export const Login = () => <TerminalLayout title="Secure Terminal Login" />;
export const Dashboard = () => <TerminalLayout title="Operational Dashboard" />;
export const Operations = () => <TerminalLayout title="Operations Management" />;
export const Finance = () => <TerminalLayout title="Financial Oversight" />;
export const HumanResources = () => <TerminalLayout title="Human Resources" />;
export const Marketing = () => <TerminalLayout title="Marketing & Outreach" />;
export const Substation = () => <TerminalLayout title="Substation Management" />;
export const RoleManagement = () => <TerminalLayout title="Role & Permission Control" />;
export const UserManagement = () => <TerminalLayout title="User Access Management" />;
export const SystemSettings = () => <TerminalLayout title="System Configuration & Settings" />;
export const AuditLogs = () => <TerminalLayout title="System Audit Logs" />;
export const Reports = () => <TerminalLayout title="Analytical Reports" />;
export const Unauthorized = () => <TerminalLayout title="403 - Forbidden Access" />;
export const ForcePasswordReset = () => <TerminalLayout title="Required Password Update" />;
export const ChangePassword = () => <TerminalLayout title="Security Settings: Change Password" />;