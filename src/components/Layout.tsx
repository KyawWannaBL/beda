import React, { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { roleSidebarMap } from "@/config/roleSidebar";
import {
  LayoutDashboard, Package, QrCode, BarChart3,
  DollarSign, Warehouse, BookOpen, Truck,
  LogOut, Menu, Shield, X
} from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  // Call hook inside the component function to fix the "Black Screen" crash
  const { userData, legacyUser, logout, isLoading } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'my'>('en');

  const role = userData?.role || (legacyUser as any)?.role || 'STAFF';

  const navItems = [
    { id: 'dashboard', labelEn: 'Dashboard', labelMy: 'ဒက်ရှ်ဘုတ်', href: '/dashboard', icon: LayoutDashboard },
    { id: 'shipments', labelEn: 'Shipments', labelMy: 'ပို့ဆောင်မှုများ', href: '/shipments', icon: Package, badge: 'OPS' },
    { id: 'qr', labelEn: 'QR Operations', labelMy: 'QR လုပ်ငန်းများ', href: '/qr', icon: QrCode },
    { id: 'reports', labelEn: 'Reports', labelMy: 'အစီရင်ခံစာများ', href: '/reports', icon: BarChart3 },
    { id: 'finance', labelEn: 'Finance', labelMy: 'ဘဏ္ဍာရေး', href: '/finance', icon: DollarSign },
    { id: 'hub', labelEn: 'Hub Ops', labelMy: 'ဟပ် လုပ်ငန်းများ', href: '/hub', icon: Warehouse },
    { id: 'courier', labelEn: 'Courier App', labelMy: 'Courier App', href: '/courier', icon: Truck },
    { id: 'manual', labelEn: 'Manual', labelMy: 'လမ်းညွှန်', href: '/manual', icon: BookOpen },
  ];

  // Dynamically filter visibility based on the roleSidebarMap
  const visibleItems = useMemo(() => {
    const allowedIds = roleSidebarMap[role] || ["dashboard", "manual"];
    return navItems.filter((item) => allowedIds.includes(item.id));
  }, [role]);

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <span className="font-bold text-amber-400 tracking-widest">BRITIUM</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(l => l === 'en' ? 'my' : 'en')}>
              {language.toUpperCase()}
            </Button>
            <Button variant="outline" size="sm" className="text-red-400 border-red-400/20" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl grid md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block border-r border-white/10 p-6 space-y-2">
          {visibleItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-2 rounded-xl transition",
                isActive ? "bg-white/10 text-amber-400" : "text-white/60 hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{language === 'en' ? item.labelEn : item.labelMy}</span>
            </NavLink>
          ))}
        </aside>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}