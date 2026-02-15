import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ChangePassword from "@/pages/ChangePassword";
import AdminDashboard from "@/pages/AdminDashboard"; // Added import
import Layout from "@/components/Layout"; // Added import
import RoleBasedRoute from "@/components/RoleBasedRoute";
import { AuthProvider } from "@/hooks/useAuth";

function Protected({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  return <RoleBasedRoute allowedRoles={allowedRoles || []}>{children}</RoleBasedRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />

          <Route
            path="/change-password"
            element={
              <Protected>
                <ChangePassword />
              </Protected>
            }
          />

          {/* ENTERPRISE ADMIN ROUTING */}
          <Route
            path="/admin/*"
            element={
              <Protected allowedRoles={['APP_OWNER', 'SUPER_ADMIN']}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </Protected>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}