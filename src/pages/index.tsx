import React from 'react';

/**
 * Common layout for implemented pages to maintain UI consistency
 */
const PageLayout = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
    <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl">
      <h1 className="text-3xl font-bold mb-6 border-b border-white/10 pb-4">{title}</h1>
      {children || <p className="text-white/60 text-lg">System module active. Content loading...</p>}
    </div>
  </div>
);

// Primary application entry points
export const EnterprisePortal = () => <PageLayout title="Enterprise Portal" />;
export const Login = () => <PageLayout title="Secure Login" />;
export const Dashboard = () => <PageLayout title="Operational Dashboard" />;

// Administrative and System Pages
export const AuditLogs = () => <PageLayout title="Audit Trail & Logs" />;
export const Reports = () => <PageLayout title="System Reports" />;
export const Unauthorized = () => (
  <PageLayout title="403 - Access Denied">
    <p className="text-red-400 font-medium">You do not have the required permissions to view this terminal.</p>
  </PageLayout>
);

// Password Management
export const ForcePasswordReset = () => <PageLayout title="Required Password Reset" />;
export const ChangePassword = () => <PageLayout title="Security Settings: Change Password" />;