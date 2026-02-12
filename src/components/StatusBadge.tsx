import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Truck,
  Package,
  FileText,
  Printer,
  MapPin,
  UserCheck,
  XCircle,
  ShieldAlert,
  Archive,
  PackageCheck
} from 'lucide-react';
import {
  SHIPMENT_STATUS,
  TAG_STATUS,
  type ShipmentStatus,
  type TagStatus
} from '@/lib/index';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatusBadgeProps {
  status: ShipmentStatus | TagStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<
  ShipmentStatus | TagStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  // Shipment Statuses
  [SHIPMENT_STATUS.TT_ASSIGNED_AT_PICKUP]: {
    label: 'Tag Assigned',
    icon: ShieldAlert,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  [SHIPMENT_STATUS.PICKED_UP_PENDING_REGISTRATION]: {
    label: 'Pending Registration',
    icon: Clock,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  [SHIPMENT_STATUS.REGISTERED_READY_FOR_LABEL]: {
    label: 'Registered',
    icon: FileText,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  [SHIPMENT_STATUS.LABEL_PRINTED]: {
    label: 'Label Printed',
    icon: Printer,
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  },
  [SHIPMENT_STATUS.LABEL_APPLIED_VERIFIED]: {
    label: 'Label Verified',
    icon: PackageCheck,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  [SHIPMENT_STATUS.ARRIVED_WAREHOUSE_GATE]: {
    label: 'At WH Gate',
    icon: MapPin,
    color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  },
  [SHIPMENT_STATUS.WAREHOUSE_RECEIVED_VERIFIED]: {
    label: 'WH Received',
    icon: Archive,
    color: 'text-primary bg-primary/10 border-primary/20',
  },
  [SHIPMENT_STATUS.WAREHOUSE_DISPATCHED]: {
    label: 'Dispatched',
    icon: Truck,
    color: 'text-blue-600 bg-blue-600/10 border-blue-600/20',
  },
  [SHIPMENT_STATUS.IN_TRANSIT_TO_SUBSTATION]: {
    label: 'In Transit',
    icon: Truck,
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  },
  [SHIPMENT_STATUS.SUBSTATION_RECEIVED_VERIFIED]: {
    label: 'SS Received',
    icon: Package,
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
  },
  [SHIPMENT_STATUS.OUT_FOR_DELIVERY]: {
    label: 'Out for Delivery',
    icon: Truck,
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
  },
  [SHIPMENT_STATUS.DELIVERED_POD_CAPTURED]: {
    label: 'Delivered',
    icon: CheckCircle2,
    color: 'text-success bg-success/10 border-success/20',
  },
  [SHIPMENT_STATUS.DELIVERY_FAILED_NDR]: {
    label: 'Delivery Failed',
    icon: XCircle,
    color: 'text-destructive bg-destructive/10 border-destructive/20',
  },

  // Tag Statuses
  [TAG_STATUS.IN_STOCK]: {
    label: 'In Stock',
    icon: Package,
    color: 'text-muted-foreground bg-muted border-border',
  },
  [TAG_STATUS.ISSUED_TO_RIDER]: {
    label: 'Issued',
    icon: UserCheck,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  [TAG_STATUS.USED]: {
    label: 'Used',
    icon: CheckCircle2,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  [TAG_STATUS.VOID]: {
    label: 'Voided',
    icon: XCircle,
    color: 'text-destructive bg-destructive/10 border-destructive/20',
  },
  [TAG_STATUS.LOST_SUSPECT]: {
    label: 'Lost/Suspect',
    icon: AlertTriangle,
    color: 'text-destructive bg-destructive border-destructive/20 text-destructive-foreground',
  },
  [TAG_STATUS.RETURNED_TO_STOCK]: {
    label: 'Returned',
    icon: Archive,
    color: 'text-muted-foreground bg-muted border-border',
  },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) return null;

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <div
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        config.color,
        sizeClasses[size]
      )}
    >
      <Icon size={iconSizes[size]} className="shrink-0" />
      <span className="whitespace-nowrap">{config.label}</span>
    </div>
  );
}
