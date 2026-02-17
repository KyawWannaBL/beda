import {
  LayoutDashboard,
  Truck,
  Building2,
  DollarSign,
  Users,
  Shield,
  Settings,
  FileText,
  ClipboardList,
  Megaphone,
  BadgeCheck,
} from 'lucide-react'

import type { AppRole } from '@/types/roles'

export type NavItem = {
  name: string
  href: string
  icon: any
  roles?: AppRole[]
}

// Single source of truth for sidebar navigation.
export const enterpriseNav: NavItem[] = [
  {
    name: 'Executive Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Operations',
    href: '/operations',
    icon: Truck,
    roles: ['APP_OWNER', 'SUPER_ADMIN', 'OPERATIONS_ADMIN', 'SUPERVISOR', 'WAREHOUSE_MANAGER', 'SUBSTATION_MANAGER'],
  },
  {
    name: 'Substation',
    href: '/substation',
    icon: Building2,
    roles: ['APP_OWNER', 'SUPER_ADMIN', 'SUBSTATION_MANAGER', 'SUPERVISOR', 'OPERATIONS_ADMIN'],
  },
  {
    name: 'Finance',
    href: '/finance',
    icon: DollarSign,
    roles: ['APP_OWNER', 'SUPER_ADMIN', 'FINANCE_STAFF', 'FINANCE_USER'],
  },
  {
    name: 'Human Resources',
    href: '/hr',
    icon: ClipboardList,
    roles: ['APP_OWNER', 'SUPER_ADMIN', 'HR_ADMIN'],
  },
  {
    name: 'Marketing',
    href: '/marketing',
    icon: Megaphone,
    roles: ['APP_OWNER', 'SUPER_ADMIN', 'MARKETING_ADMIN'],
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
    roles: ['APP_OWNER', 'SUPER_ADMIN'],
  },
  {
    name: 'Role Management',
    href: '/admin/roles',
    icon: Shield,
    roles: ['APP_OWNER', 'SUPER_ADMIN'],
  },
  {
    name: 'System Settings',
    href: '/settings',
    icon: Settings,
    roles: ['APP_OWNER', 'SUPER_ADMIN'],
  },
  {
    name: 'Audit Logs',
    href: '/audit',
    icon: BadgeCheck,
    roles: ['APP_OWNER', 'SUPER_ADMIN'],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    roles: ['APP_OWNER', 'SUPER_ADMIN', 'FINANCE_STAFF', 'FINANCE_USER', 'OPERATIONS_ADMIN', 'SUPERVISOR'],
  },
]

export function navForRole(role: AppRole | null | undefined): NavItem[] {
  return enterpriseNav.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true
    if (!role) return false
    return item.roles.includes(role)
  })
}
