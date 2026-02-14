export type AppRole = 
  | 'APP_OWNER' 
  | 'SUPER_ADMIN' 
  | 'OPERATIONS_ADMIN' 
  | 'FINANCE_ADMIN'
  | 'HR_ADMIN'
  | 'MARKETING_ADMIN'
  | 'CUSTOMER_SERVICE_ADMIN'
  | 'SUPERVISOR'
  | 'SUBSTATION_MANAGER'
  | 'WAREHOUSE_MANAGER'
  | 'RIDER'
  | 'DRIVER'
  | 'STAFF';

export interface UserProfile {
  user_id: string;
  role: AppRole;
  full_name: string;
  substation_id?: string;
}