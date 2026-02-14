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
import { useAuth } from "@/hooks/useAuth";

import {
  LayoutDashboard,
  Package,
  QrCode,
  BarChart3,
  DollarSign,
  Warehouse,
  BookOpen,
  Truck,
  LogOut,
  Menu,
} from 'lucide-react';

type AnyRole = string;
type Language = 'en' | 'my';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  labelEn: string;
  labelMy: string;
  href: string;
  icon: React.ElementType;
  roles?: AnyRole[]; // if empty/undefined => all authenticated
  badge?: string;
}
const { userData } = useAuth();

const allowedMenus = roleSidebarMap[userData?.role || "STAFF"];

const ALL: AnyRole[] = [];

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { userData, legacyUser, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  const role = (userData?.role || (legacyUser as any)?.role || 'STAFF') as AnyRole;

  const navItems: NavItem[] = useMemo(
    () => [
      { labelEn: 'Dashboard', labelMy: 'ဒက်ရှ်ဘုတ်', href: '/dashboard', icon: LayoutDashboard, roles: ALL },
      { labelEn: 'Shipments', labelMy: 'ပို့ဆောင်မှုများ', href: '/shipments', icon: Package, roles: ALL, badge: 'OPS' },
      { labelEn: 'QR Operations', labelMy: 'QR လုပ်ငန်းများ', href: '/qr', icon: QrCode, roles: ALL },
      { labelEn: 'Reports', labelMy: 'အစီရင်ခံစာများ', href: '/reports', icon: BarChart3, roles: ['APP_OWNER','SUPER_ADMIN','OPERATIONS_ADMIN','FINANCE_ADMIN','ANALYST','FINANCE_USER'] },
      { labelEn: 'Finance', labelMy: 'ဘဏ္ဍာရေး', href: '/finance', icon: DollarSign, roles: ['APP_OWNER','SUPER_ADMIN','FINANCE_ADMIN','FINANCE_USER'] },
      { labelEn: 'Hub Ops', labelMy: 'ဟပ် လုပ်ငန်းများ', href: '/hub', icon: Warehouse, roles: ['APP_OWNER','SUPER_ADMIN','OPERATIONS_ADMIN','SUPERVISOR','STAFF'] },
      { labelEn: 'Courier App', labelMy: 'Courier App', href: '/courier', icon: Truck, roles: ['RIDER','DRIVER','HELPER','SUPERVISOR','OPERATIONS_ADMIN','SUPER_ADMIN'] },
      { labelEn: 'Manual', labelMy: 'လမ်းညွှန်', href: '/manual', icon: BookOpen, roles: ALL },
    ],
    []
  );

  const visibleItems = navItems.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(role);
  });

  const displayName =
    userData?.displayName ||
    (legacyUser as any)?.name ||
    userData?.email?.split('@')?.[0] ||
    'User';

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const NavList = (
    <div className="space-y-1">
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const label = language === 'my' ? item.labelMy : item.labelEn;
        return (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition',
                'hover:bg-white/10',
                isActive ? 'bg-white/10 text-white' : 'text-white/75'
              )
            }
            onClick={() => setSidebarOpen(false)}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{label}</span>
            {item.badge && (
              <Badge className="bg-amber-400/15 text-amber-200 border border-amber-300/20">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="md:hidden border-white/15 bg-white/5 hover:bg-white/10"
              onClick={() => setSidebarOpen((s) => !s)}
            >
              <Menu className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-3">
              <img
                src="/britium-logo.png"
                onError={(e) => ((e.currentTarget.style.display = 'none'))}
                alt="Britium Express"
                className="h-9 w-9 rounded-lg bg-white/10 p-1"
              />
              <div>
                <div className="font-semibold leading-tight">Britium Express</div>
                <div className="text-[11px] text-white/60">Role: {role}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-white/15 bg-white/5 hover:bg-white/10"
              onClick={() => setLanguage((l) => (l === 'en' ? 'my' : 'en'))}
            >
              {language === 'en' ? 'MY' : 'EN'}
            </Button>

            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9 border border-white/10 bg-white/5">
                <AvatarFallback className="bg-transparent text-white">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="hidden sm:block">
                <div className="text-sm font-medium">{displayName}</div>
                <div className="text-xs text-white/60">{userData?.email}</div>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-white/15 bg-white/5 hover:bg-white/10"
              onClick={onLogout}
              title="Logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl grid md:grid-cols-[260px_1fr] gap-0">
        {/* Desktop sidebar */}
        <aside className="hidden md:block border-r border-white/10 px-4 py-6">
          <div className="mb-4">
            <div className="text-xs text-white/50">Navigation</div>
          </div>
          {NavList}
          <Separator className="my-6 bg-white/10" />
          <div className="text-xs text-white/50">
            Luxury UI • Verified Protocols
          </div>
        </aside>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black/60"
              onClick={() => setSidebarOpen(false)}
            >
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                className="absolute left-0 top-0 h-full w-[280px] border-r border-white/10 bg-slate-950/90 backdrop-blur p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-semibold">Menu</div>
                  <Button
                    variant="outline"
                    className="border-white/15 bg-white/5 hover:bg-white/10"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Close
                  </Button>
                </div>
                {NavList}
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main */}
        <main className="px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
