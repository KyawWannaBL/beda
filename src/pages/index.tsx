import React from 'react';

// Import your page components here
// Example: import Dashboard from './Dashboard';

/**
 * Placeholder for pages not yet fully implemented
 */
function NotImplementedPage({ name }: { name: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">{name}</h1>
        <p className="text-white/60">This page is currently under development.</p>
      </div>
    </div>
  );
}

// Export all components used in App.tsx
export const Dashboard = () => <NotImplementedPage name="Dashboard" />;
export const AuditLogs = () => <NotImplementedPage name="Audit Logs" />;
export const Reports = () => <NotImplementedPage name="Reports" />;
export const ForcePasswordReset = () => <NotImplementedPage name="Force Password Reset" />;
export const ChangePassword = () => <NotImplementedPage name="Change Password" />;

// ✅ This was the missing export causing your build error
export const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center p-6">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">403</h1>
      <p className="text-xl text-white/60">Unauthorized Access</p>
    </div>
  </div>
);