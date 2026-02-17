export type AppRole = 
  | "APP_OWNER"
  | "SUPER_ADMIN"
  | "OPERATIONS_ADMIN"
  | "SUPERVISOR"
  | "SUBSTATION_MANAGER"
  | "WAREHOUSE_MANAGER"
  | "DATA_ENTRY"
  | "CUSTOMER_SERVICE"
  | "FINANCE_STAFF"
  | "FINANCE_USER"
  | "HR_ADMIN"
  | "MARKETING_ADMIN"
  | "RIDER"
  | "DRIVER"
  | "HELPER"
  | "STAFF"
  | "MERCHANT"
  | "CUSTOMER";


export interface UserProfile {
  user_id: string;
  role: AppRole;
  full_name: string;
  substation_id?: string;
}