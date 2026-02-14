import { UserRole } from "@/types/roles";
import { roleSidebarMap } from "@/config/roleSidebar";
import { useAuth } from "@/hooks/useAuth";

const { userData } = useAuth();

const allowedMenus = roleSidebarMap[userData?.role || "STAFF"];

export const roleSidebarMap: Record<UserRole, string[]> = {
  APP_OWNER: ["dashboard", "shipments", "reports", "finance", "hub", "admin"],
  SUPER_ADMIN: ["dashboard", "shipments", "reports", "finance", "hub", "admin"],
  OPERATIONS_ADMIN: ["dashboard", "shipments", "hub"],
  FINANCE_ADMIN: ["dashboard", "finance", "reports"],
  HR_ADMIN: ["dashboard"],
  WAREHOUSE_MANAGER: ["dashboard", "hub"],
  SUPERVISOR: ["dashboard", "shipments"],
  STAFF: ["dashboard"],
  CUSTOMER_SERVICE: ["dashboard", "shipments"],
  RIDER: ["courier"],
  DRIVER: ["courier"],
  HELPER: ["dashboard"],
  MARKETING_ADMIN: ["dashboard", "reports"],
  DATA_ENTRY: ["dashboard", "shipments"],
  ANALYST: ["dashboard", "reports"],
  SUBSTATION_MANAGER: ["dashboard", "shipments"],
  FINANCE_STAFF: ["dashboard", "finance"],
  MARKETING: ["dashboard"],
  MERCHANT: ["dashboard"],
  CUSTOMER: ["dashboard"]
};

