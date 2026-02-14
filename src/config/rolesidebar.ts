import { UserRole } from "@/lib/types"

export interface SidebarItem {
  label: string
  path: string
  roles: UserRole[]
}

export const roleSidebar: SidebarItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: [
      "APP_OWNER",
      "SUPER_ADMIN",
      "OPERATIONS_ADMIN",
      "FINANCE_ADMIN",
      "SUPERVISOR",
      "WAREHOUSE_MANAGER",
      "SUBSTATION_MANAGER",
      "STAFF",
      "RIDER",
      "DRIVER"
    ],
  },
  {
    label: "Shipments",
    path: "/shipments",
    roles: [
      "APP_OWNER",
      "SUPER_ADMIN",
      "OPERATIONS_ADMIN",
      "SUPERVISOR",
      "WAREHOUSE_MANAGER",
      "SUBSTATION_MANAGER",
      "STAFF"
    ],
  },
  {
    label: "Finance",
    path: "/finance",
    roles: [
      "APP_OWNER",
      "SUPER_ADMIN",
      "FINANCE_ADMIN",
      "FINANCE_STAFF",
      "FINANCE_USER"
    ],
  },
  {
    label: "Admin Panel",
    path: "/admin",
    roles: [
      "APP_OWNER",
      "SUPER_ADMIN"
    ],
  },
]
