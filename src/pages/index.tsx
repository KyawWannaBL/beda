export { default as EnterprisePortal } from "./LandingPage";
export { default as Login } from "./Login";
export { default as Dashboard } from "./Dashboard";
export { default as ForcePasswordReset } from "./ForcePasswordReset";
export { default as ChangePassword } from "./ChangePassword";

/**
 * If you haven't created the rest of the pages yet (or they are in different folders),
 * exporting placeholders prevents Vite build from failing.
 *
 * Later: replace these with real imports like:
 * export { default as AdminDashboard } from "./AdminDashboard";
 */
const NotImplemented = (name: string) =>
  function NotImplementedPage() {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <h1 className="text-2xl font-semibold mb-2">{name}</h1>
          <p className="opacity-80">
            This page is not implemented yet. Create{" "}
            <code className="px-1 py-0.5 rounded bg-black/30">src/pages/{name}.tsx</code>{" "}
            and update <code className="px-1 py-0.5 rounded bg-black/30">src/pages/index.ts</code>.
          </p>
        </div>
      </div>
    );
  };

export const AdminDashboard = NotImplemented("AdminDashboard");
export const Operations = NotImplemented("Operations");
export const Finance = NotImplemented("Finance");
export const HumanResources = NotImplemented("HumanResources");
export const Marketing = NotImplemented("Marketing");
export const Substation = NotImplemented("Substation");
export const RoleManagement = NotImplemented("RoleManagement");
export const UserManagement = NotImplemented("UserManagement");
export const SystemSettings = NotImplemented("SystemSettings");
export const AuditLogs = NotImplemented("AuditLogs");
export const Reports = NotImplemented("Reports");
export const Unauthorized = NotImplemented("Unauthorized");
