export const ROUTE_PATHS = {
  LOGIN: '/login',
  DASHBOARD: '/',
  RIDER: {
    TAGS: '/rider/tags',
    PICKUP: '/rider/pickup',
    LABEL: '/rider/label',
    WAREHOUSE: '/rider/warehouse',
    DELIVERY: '/rider/delivery',
  },
  OFFICE: {
    QUEUE: '/office/queue',
    REGISTRATION: '/office/registration/:ttId',
  },
  WAREHOUSE: {
    RECEIVING: '/warehouse/receiving',
    DISPATCH: '/warehouse/dispatch',
  },
  SUBSTATION: {
    RECEIVING: '/substation/receiving',
  },
  SUPERVISOR: {
    INVENTORY: '/supervisor/inventory',
    AUDIT: '/supervisor/audit',
  },
} as const;

export const USER_ROLES = {
  // Operational Roles
  RDR: 'Rider',
  DES: 'Data Entry Staff',
  WH: 'Warehouse Staff',
  DRV: 'Driver',
  SSM: 'Substation Manager',
  SSR: 'Substation Rider',
  SUP: 'Supervisor',
  
  // Admin Roles
  SUPER_ADMIN: 'Super Administrator',
  FINANCE_ADMIN: 'Finance Administrator',
  OPERATIONS_ADMIN: 'Operations Administrator',
  MARKETING_ADMIN: 'Marketing Administrator',
  CUSTOMER_SERVICE_ADMIN: 'Customer Service Administrator',
  
  // Business Roles
  MERCHANT: 'Merchant',
  CUSTOMER: 'Customer',
  MARKETING: 'Marketing Manager',
  CUSTOMER_SERVICE: 'Customer Service',
  FINANCE_USER: 'Finance User',
  ANALYST: 'Business Analyst',
} as const;

export type UserRole = keyof typeof USER_ROLES;

export const PERMISSIONS = {
  TAG_ISSUE: 'TAG-ISSUE',
  TAG_VIEW: 'TAG-VIEW',
  TAG_VOID_REQ: 'TAG-VOID-REQ',
  TAG_VOID_APP: 'TAG-VOID-APP',
  TAG_LOST_MARK: 'TAG-LOST-MARK',
  TAG_EOD_RECON: 'TAG-EOD-RECON',
  TAG_EOD_APP: 'TAG-EOD-APP',
  PUP_TT_ASSIGN: 'PUP-TT-ASSIGN',
  PUP_PHOTO_CAPTURE: 'PUP-PHOTO-CAPTURE',
  PUP_QUICK_EDIT: 'PUP-QUICK-EDIT',
  REG_FULL_CREATE: 'REG-FULL-CREATE',
  REG_FULL_EDIT: 'REG-FULL-EDIT',
  LBL_PRINT: 'LBL-PRINT',
  LBL_REPRINT: 'LBL-REPRINT',
  LBL_ACTIVATE: 'LBL-ACTIVATE',
  LOC_SCAN: 'LOC-SCAN',
  WH_RECEIVE: 'WH-RECEIVE',
  WH_DISPATCH: 'WH-DISPATCH',
  SS_RECEIVE: 'SS-RECEIVE',
  POD_SIGN: 'POD-SIGN',
  POD_OTP: 'POD-OTP',
  POD_PHOTO: 'POD-PHOTO',
  NDR_CREATE: 'NDR-CREATE',
  AUD_VIEW: 'AUD-VIEW',
} as const;

export const SHIPMENT_STATUS = {
  TT_ASSIGNED_AT_PICKUP: 'TT_ASSIGNED_AT_PICKUP',
  PICKED_UP_PENDING_REGISTRATION: 'PICKED_UP_PENDING_REGISTRATION',
  REGISTERED_READY_FOR_LABEL: 'REGISTERED_READY_FOR_LABEL',
  LABEL_PRINTED: 'LABEL_PRINTED',
  LABEL_APPLIED_VERIFIED: 'LABEL_APPLIED_VERIFIED',
  ARRIVED_WAREHOUSE_GATE: 'ARRIVED_WAREHOUSE_GATE',
  WAREHOUSE_RECEIVED_VERIFIED: 'WAREHOUSE_RECEIVED_VERIFIED',
  WAREHOUSE_DISPATCHED: 'WAREHOUSE_DISPATCHED',
  IN_TRANSIT_TO_SUBSTATION: 'IN_TRANSIT_TO_SUBSTATION',
  SUBSTATION_RECEIVED_VERIFIED: 'SUBSTATION_RECEIVED_VERIFIED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED_POD_CAPTURED: 'DELIVERED_POD_CAPTURED',
  DELIVERY_FAILED_NDR: 'DELIVERY_FAILED_NDR',
} as const;

export type ShipmentStatus = keyof typeof SHIPMENT_STATUS;

export const TAG_STATUS = {
  IN_STOCK: 'IN_STOCK',
  ISSUED_TO_RIDER: 'ISSUED_TO_RIDER',
  USED: 'USED',
  VOID: 'VOID',
  LOST_SUSPECT: 'LOST_SUSPECT',
  RETURNED_TO_STOCK: 'RETURNED_TO_STOCK',
} as const;

export type TagStatus = keyof typeof TAG_STATUS;

// User interface moved to end of file to avoid conflicts

export interface TamperTag {
  id: string;
  status: TagStatus;
  batchId: string;
  issuedTo: string;
  issueDate: string;
  voidReason?: string;
  voidPhoto?: string;
}

export interface Shipment {
  id: string;
  awb?: string;
  tamperTagId: string;
  status: ShipmentStatus;
  pieces: number;
  type: 'box' | 'bag' | 'document' | 'other';
  condition: 'OK' | 'Damaged';
  cod: {
    required: boolean;
    amount?: number;
  };
  destinationTownship?: string;
  sender?: {
    name: string;
    phone: string;
  };
  receiver?: {
    name: string;
    phone: string;
    address: string;
    township: string;
  };
  photos: string[];
  riderId: string;
  createdAt: string;
  registeredAt?: string;
  labelPrintedCount: number;
  lastLocation?: string;
}

export interface PickupRecord {
  ttId: string;
  timestamp: string;
  gps: string;
  riderId: string;
  photos: string[];
  details: {
    pieces: number;
    type: string;
    condition: string;
    codAmount?: number;
    destinationTownship?: string;
  };
}

export interface PODRecord {
  shipmentId: string;
  recipientName: string;
  relationship: 'Self' | 'Family' | 'Neighbor' | 'Guard' | 'Other';
  signature: string;
  photo?: string;
  timestamp: string;
  gps: string;
  otpVerified: boolean;
}

export const MOCK_TOWNSHIPS = [
  'Downtown',
  'North District',
  'South District',
  'East Industrial',
  'West Waterfront',
  'Airport Zone',
];

export const NDR_REASONS = [
  'No answer',
  'Refused by recipient',
  'Address not found',
  'COD amount dispute',
  'Customer rescheduled',
  'Restricted access',
];

// Legacy User interface for backward compatibility
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions?: string[];
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date;
  batchId?: string;
}