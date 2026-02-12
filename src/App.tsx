import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import RoleBasedRoute from '@/components/RoleBasedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Shipments from '@/pages/Shipments';
import Finance from '@/pages/Finance';
import Reports from '@/pages/Reports';
import QROperations from '@/pages/QROperations';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to={ROUTE_PATHS.DASHBOARD} replace />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path={ROUTE_PATHS.DASHBOARD} element={<Dashboard />} />
                  <Route path="/shipments" element={<Shipments />} />
                  <Route path="/finance" element={<Finance />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/qr-operations" element={<QROperations />} />
                  
                  {/* Rider Routes */}
                  <Route path={ROUTE_PATHS.RIDER.TAGS} element={<Dashboard />} />
                  <Route path={ROUTE_PATHS.RIDER.PICKUP} element={<Dashboard />} />
                  <Route path={ROUTE_PATHS.RIDER.LABEL} element={<Dashboard />} />
                  <Route path={ROUTE_PATHS.RIDER.WAREHOUSE} element={<Dashboard />} />
                  <Route path={ROUTE_PATHS.RIDER.DELIVERY} element={<Dashboard />} />
                  
                  {/* Office Routes */}
                  <Route path={ROUTE_PATHS.OFFICE.QUEUE} element={<Dashboard />} />
                  <Route path="/office/registration/:ttId" element={<Dashboard />} />
                  
                  {/* Warehouse Routes */}
                  <Route path={ROUTE_PATHS.WAREHOUSE.RECEIVING} element={<Dashboard />} />
                  <Route path={ROUTE_PATHS.WAREHOUSE.DISPATCH} element={<Dashboard />} />
                  
                  {/* Substation Routes */}
                  <Route path={ROUTE_PATHS.SUBSTATION.RECEIVING} element={<Dashboard />} />
                  
                  {/* Supervisor Routes */}
                  <Route path={ROUTE_PATHS.SUPERVISOR.INVENTORY} element={<Dashboard />} />
                  <Route path={ROUTE_PATHS.SUPERVISOR.AUDIT} element={<Dashboard />} />
                  
                  {/* Admin Routes - Placeholder for now */}
                  <Route path="/admin/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Admin Panel</h1><p>Admin functionality coming soon...</p></div>} />
                  <Route path="/merchant/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Merchant Portal</h1><p>Merchant functionality coming soon...</p></div>} />
                  <Route path="/customer/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Customer Portal</h1><p>Customer functionality coming soon...</p></div>} />
                  
                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to={ROUTE_PATHS.DASHBOARD} replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
      <Toaster />
    </Router>
  );
}