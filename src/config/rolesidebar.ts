/**
 * @description Master Access Protocol
 * Pure data mapping for role-based module authorization.
 */
export const roleSidebarMap: Record<string, string[]> = {
  APP_OWNER: ["dashboard", "shipments", "qr", "reports", "finance", "hub", "admin", "manual"],
  SUPER_ADMIN: ["dashboard", "shipments", "qr", "reports", "finance", "hub", "admin", "manual"],
  OPERATIONS_ADMIN: ["dashboard", "shipments", "qr", "reports", "hub", "manual"],
  FINANCE_ADMIN: ["dashboard", "reports", "finance", "manual"],
  HR_ADMIN: ["dashboard", "manual"],
  WAREHOUSE_MANAGER: ["dashboard", "hub", "manual"],
  SUPERVISOR: ["dashboard", "shipments", "qr", "hub", "courier", "manual"],
  STAFF: ["dashboard", "hub", "manual"],
  CUSTOMER_SERVICE: ["dashboard", "shipments", "manual"],
  RIDER: ["courier", "manual"],
  DRIVER: ["courier", "manual"],
  HELPER: ["dashboard", "manual"],
  MARKETING_ADMIN: ["dashboard", "reports", "manual"],
  DATA_ENTRY: ["dashboard", "shipments", "qr", "manual"],
  ANALYST: ["dashboard", "reports", "manual"],
  SUBSTATION_MANAGER: ["dashboard", "shipments", "hub", "manual"],
  FINANCE_STAFF: ["dashboard", "finance", "manual"],
  MARKETING: ["dashboard", "manual"],
  MERCHANT: ["dashboard", "manual"],
  CUSTOMER: ["dashboard", "manual"]
};