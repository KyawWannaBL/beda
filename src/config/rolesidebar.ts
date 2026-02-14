import { AppRole } from "@/types/roles";

export interface SidebarItem {
  label: string;
  path: string;
  roles: AppRole[];
}

export const roleSidebar: SidebarItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: [
      "APP_OWNER",
      "SUPER_ADMIN",
      "OPERATIONS_ADMIN",
      "WAREHOUSE_MANAGER",
      "SUPERVISOR",
      "STAFF"
    ],
  },
  {
    label: "Shipments",
    path: "/shipments",
    roles: [
      "OPERATIONS_ADMIN",
      "SUPERVISOR",
      "STAFF",
      "RIDER",
      "DRIVER"
    ],
  },
  {
    label: "Finance",
    path: "/finance",
    roles: [
      "FINANCE_ADMIN",
      "FINANCE_STAFF",
      "FINANCE_USER"
    ],
  },
  {
    label: "User Management",
    path: "/admin/users",
    roles: ["APP_OWNER", "SUPER_ADMIN"],
  },
];
