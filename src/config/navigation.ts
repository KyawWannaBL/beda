import { LayoutDashboard, Package, ShieldCheck, Truck, BarChart } from 'lucide-react';
import { AppRole } from '@/types/roles';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles: AppRole[];
  featureFlag?: string; // e.g., 'VITE_ENABLE_ROUTE_MESSAGING'
}

export const enterpriseNav: NavItem[] = [
  {
    title: "Executive Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ['APP_OWNER', 'SUPER_ADMIN', 'OPERATIONS_ADMIN']
  },
  {
    title: "Logistics Hub",
    href: "/hub",
    icon: Package,
    roles: ['OPERATIONS_ADMIN', 'WAREHOUSE_MANAGER', 'SUPERVISOR']
  },
  {
    title: "Route Optimization",
    href: "/planner",
    icon: Truck,
    roles: ['OPERATIONS_ADMIN', 'SUBSTATION_MANAGER'],
    featureFlag: 'VITE_ENABLE_ROUTE_MESSAGING'
  }
];