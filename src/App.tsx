import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Shipments from "@/pages/Shipments";
import Reports from "@/pages/Reports";
import Finance from "@/pages/Finance";
import HubOperations from "@/pages/HubOperations";
import QROperations from "@/pages/QROperations";
import ManualPage from "@/pages/ManualPage";
import CourierApp from "@/pages/CourierApp";

import Layout from "@/components/Layout";
import RoleBasedRoute from "@/components/RoleBasedRoute";
import { AuthProvider } from "@/hooks/useAuth";

/* ------------------------------------------
   ROLE GROUPINGS
------------------------------------------ */

const SUPER_ROLES = ["APP_OWNER", "SUPER_ADMIN"];

const ADMIN_ROLES = [
  "OPERATIONS_ADMIN",
  "FINANCE_ADMIN",
  "HR_ADMIN",
  "MARKETING_ADMIN",
  "CUSTOMER_SERVICE_ADMIN",
];

const SUBSTATION_ROLES = [
  "SUPERVISOR",
  "SUBSTATION_MANAGER",
  "WAREHOUSE_MANAGER",
  "OPERATIONS_STAFF",
  "FINANCE_STAFF",
  "FINANCE_USER",
  "CUSTOMER_SERVICE",
  "DATA_ENTRY",
  "RIDER",
  "DRIVER",
  "HELPER",
  "STAFF",
];

const ALL_AUTH_ROLES = [
  ...SUPER_ROLES,
  ...ADMIN_ROLES,
  ...SUBSTATION_ROLES,
];

/* ------------------------------------------
   PROTECTED WRAPPER
------------------------------------------ */
function Protected({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: UserRole[] }) {
  return (
    <RoleBasedRoute allowedRoles={allowedRoles || []}>
      {children}
    </RoleBasedRoute>
  );
}

/* ------------------------------------------
   APP
------------------------------------------ */

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* DASHBOARD (All authenticated users) */}
          <Route
            path="/dashboard"
            element={
              <Protected allowedRoles={ALL_AUTH_ROLES}>
                <Layout>
                  <Dashboard />
                </Layout>
              </Protected>
            }
          />

          {/* SHIPMENTS (Operational + Admin) */}
          <Route
            path="/shipments"
            element={
              <Protected allowedRoles={[...ADMIN_ROLES, ...SUBSTATION_ROLES]}>
                <Layout>
                  <Shipments />
                </Layout>
              </Protected>
            }
          />

          {/* QR OPERATIONS (Substation + Supervisor + Admin) */}
          <Route
            path="/qr"
            element={
              <Protected allowedRoles={[
                ...ADMIN_ROLES,
                "SUPERVISOR",
                "SUBSTATION_MANAGER",
                "DATA_ENTRY",
                "WAREHOUSE_MANAGER"
              ]}>
                <Layout>
                  <QROperations />
                </Layout>
              </Protected>
            }
          />

          {/* HUB OPERATIONS */}
          <Route
            path="/hub"
            element={
              <Protected allowedRoles={[
                "OPERATIONS_ADMIN",
                "SUPERVISOR",
                "WAREHOUSE_MANAGER",
                "SUBSTATION_MANAGER"
              ]}>
                <Layout>
                  <HubOperations />
                </Layout>
              </Protected>
            }
          />

          {/* FINANCE */}
          <Route
            path="/finance"
            element={
              <Protected allowedRoles={[
                "FINANCE_ADMIN",
                "FINANCE_USER",
                "FINANCE_STAFF",
                "APP_OWNER",
                "SUPER_ADMIN"
              ]}>
                <Layout>
                  <Finance />
                </Layout>
              </Protected>
            }
          />

          {/* REPORTS (Admin + Supervisor) */}
          <Route
            path="/reports"
            element={
              <Protected allowedRoles={[
                ...SUPER_ROLES,
                ...ADMIN_ROLES,
                "SUPERVISOR",
                "SUBSTATION_MANAGER"
              ]}>
                <Layout>
                  <Reports />
                </Layout>
              </Protected>
            }
          />

          {/* COURIER APP (Rider Only) */}
          <Route
            path="/courier"
            element={
              <Protected allowedRoles={["RIDER"]}>
                <Layout>
                  <CourierApp />
                </Layout>
              </Protected>
            }
          />

          {/* MANUAL (All authenticated users) */}
          <Route
            path="/manual"
            element={
              <Protected allowedRoles={ALL_AUTH_ROLES}>
                <Layout>
                  <ManualPage />
                </Layout>
              </Protected>
            }
          />

          {/* FALLBACK ROUTES */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
