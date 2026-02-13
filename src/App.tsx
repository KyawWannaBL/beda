import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Shipments from '@/pages/Shipments';
import Reports from '@/pages/Reports';
import Finance from '@/pages/Finance';
import HubOperations from '@/pages/HubOperations';
import QROperations from '@/pages/QROperations';
import ManualPage from '@/pages/ManualPage';
import CourierApp from '@/pages/CourierApp';

import Layout from '@/components/Layout';
import RoleBasedRoute from '@/components/RoleBasedRoute';
import { AuthProvider } from '@/hooks/useAuth';

function Protected({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: any[] }) {
  return (
    <RoleBasedRoute allowedRoles={(allowedRoles as any[]) || ([] as any[])}>
      {children}
    </RoleBasedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Layout>
                  <Dashboard />
                </Layout>
              </Protected>
            }
          />
          <Route
            path="/shipments"
            element={
              <Protected>
                <Layout>
                  <Shipments />
                </Layout>
              </Protected>
            }
          />
          <Route
            path="/qr"
            element={
              <Protected>
                <Layout>
                  <QROperations />
                </Layout>
              </Protected>
            }
          />
          <Route
            path="/reports"
            element={
              <Protected>
                <Layout>
                  <Reports />
                </Layout>
              </Protected>
            }
          />
          <Route
            path="/finance"
            element={
              <Protected>
                <Layout>
                  <Finance />
                </Layout>
              </Protected>
            }
          />
          <Route
            path="/hub"
            element={
              <Protected>
                <Layout>
                  <HubOperations />
                </Layout>
              </Protected>
            }
          />
          <Route
            path="/manual"
            element={
              <Protected>
                <Layout>
                  <ManualPage />
                </Layout>
              </Protected>
            }
          />
          <Route
            path="/courier"
            element={
              <Protected>
                <Layout>
                  <CourierApp />
                </Layout>
              </Protected>
            }
          />

          {/* Default */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
