export const APP_ROLES = [
  'APP_OWNER',
  'CUSTOMER',
  'CUSTOMER_SERVICE',
  'DATA_ENTRY',
  'DRIVER',
  'FINANCE_STAFF',
  'FINANCE_USER',
  'HELPER',
  'HR_ADMIN',
  'MARKETING_ADMIN',
  'MERCHANT',
  'OPERATIONS_ADMIN',
  'RIDER',
  'STAFF',
  'SUBSTATION_MANAGER',
  'SUPERVISOR',
  'SUPER_ADMIN',
  'WAREHOUSE_MANAGER',
] as const

export type AppRole = (typeof APP_ROLES)[number]

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === 'string' && (APP_ROLES as readonly string[]).includes(value)
}
