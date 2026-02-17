import React from 'react';

const TerminalLayout = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white font-sans">
    <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-[#121212] p-10 shadow-2xl">
      <h1 className="text-3xl font-bold mb-6 border-b border-white/5 pb-5 text-white/90 tracking-tight">
        {title}
      </h1>
      {children || (
        <div className="py-10 text-center">
          <p className="text-white/40 text-lg animate-pulse">Initializing module secure session...</p>
        </div>
      )}
    </div>
  </div>
);

// Exports to resolve build failures in src/App.tsx
export const EnterprisePortal = () => <TerminalLayout title="Enterprise Portal" />;
export const AdminDashboard = () => <TerminalLayout title="Administrative Control Center" />;
export const Login = () => <TerminalLayout title="Secure Terminal Login" />;
export const Dashboard = () => <TerminalLayout title="Operational Dashboard" />;
export const Operations = () => <TerminalLayout title="Operations Management" />;
export const Finance = () => <TerminalLayout title="Financial Oversight" />;
export const AuditLogs = () => <TerminalLayout title="System Audit Logs" />;
export const Reports = () => <TerminalLayout title="Analytical Reports" />;
export const Unauthorized = () => <TerminalLayout title="403 - Forbidden Access" />;
export const ForcePasswordReset = () => <TerminalLayout title="Required Password Update" />;
export const ChangePassword = () => <TerminalLayout title="Security Settings: Change Password" />;