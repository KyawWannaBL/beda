import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { enterpriseNav } from '@/config/navigation';
import { LogOut, Menu, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationBell from './NotificationBell';

const ROUTE_PERMISSIONS: Record<string, string> = {
  '/dashboard': 'dashboard.view',
  '/admin/users': 'users.manage',
  '/inventory': 'inventory.view',
  '/reports': 'reports.view',
  '/settings': 'settings.manage'
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, hasPermission } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Consolidated Navigation Filtering
  const filteredNav = enterpriseNav.filter(item => {
    // 1. Check Feature Flags
    const isFlagEnabled = item.featureFlag 
      ? import.meta.env[item.featureFlag] === 'true' 
      : true;

    if (!isFlagEnabled) return false;

    // 2. Check Permissions
    const requiredPermission = ROUTE_PERMISSIONS[item.href];
    if (requiredPermission) {
      return hasPermission(requiredPermission);
    }

    return true;
  });

  return (
    <div className="flex h-screen bg-luxury-obsidian text-luxury-cream overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 luxury-glass border-r border-white/5 transition-transform duration-300 md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-luxury-gold to-amber-600 flex items-center justify-center shadow-lg shadow-luxury-gold/20">
              <span className="text-luxury-obsidian font-black text-xl">B</span>
            </div>
            <div>
              <h1 className="font-bold tracking-tighter text-xl text-luxury-gold">BRITIUM</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Logistics Cloud</p>
            </div>
          </div>

          <nav className="space-y-2">
            {filteredNav.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-medium text-sm">{item.title}</span>
              </NavLink>
            ))}

            {/* APP_OWNER Exclusive Link */}
            {user?.role === "APP_OWNER" && (
              <NavLink
                to="/admin/users"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <Users className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-medium text-sm">User Management</span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* User Profile / Logout */}
        <div className="absolute bottom-0 w-full p-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
              <User className="h-4 w-4 text-luxury-gold" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.full_name || 'User'}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.role || 'Guest'}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 luxury-glass border-b border-white/5 flex items-center justify-between px-8 z-30">
          <button className="md:hidden p-2 text-white" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden md:block">
            <h2 className="text-sm font-medium text-white/60">System Operational</h2>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-white/40 uppercase">Environment</p>
              <p className="text-xs font-mono text-luxury-gold">PROD-ENTERPRISE</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}