import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  DollarSign,
  Users,
  QrCode,
  FileCheck,
  Warehouse,
  Send,
  AlertCircle,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTE_PATHS } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, userData, legacyUser } = useAuth();

  const getRoleMetrics = () => {
    switch (legacyUser?.role) {
      case 'RDR':
        return [
          { label: 'Today\'s Pickups', value: '12', icon: QrCode, change: '+2', color: 'text-primary' },
          { label: 'Pending Delivery', value: '8', icon: Package, change: '-3', color: 'text-chart-2' },
          { label: 'Tags in Batch', value: '184/200', icon: ShieldCheck, change: 'Recon Required', color: 'text-chart-3' },
          { label: 'COD Collected', value: '$450.00', icon: DollarSign, change: '+15%', color: 'text-success' },
        ];
      case 'DES':
        return [
          { label: 'Pending Queue', value: '45', icon: Clock, change: '+5', color: 'text-destructive' },
          { label: 'Today Registered', value: '128', icon: FileCheck, change: '+12%', color: 'text-primary' },
          { label: 'Label Errors', value: '2', icon: AlertCircle, change: 'Critical', color: 'text-destructive' },
          { label: 'Active Riders', value: '24', icon: Users, change: 'Stable', color: 'text-chart-2' },
        ];
      case 'WH':
        return [
          { label: 'Awaiting Gate', value: '14', icon: Truck, change: 'Arrivals', color: 'text-primary' },
          { label: 'To Receive', value: '86', icon: Warehouse, change: 'High Load', color: 'text-chart-3' },
          { label: 'Dispatch Pending', value: '3', icon: Send, change: 'Manifests', color: 'text-chart-5' },
          { label: 'Damages Reported', value: '1', icon: AlertCircle, change: '-50%', color: 'text-success' },
        ];
      case 'SUP':
        return [
          { label: 'Total Shipments', value: '2,450', icon: Package, change: '+12%', color: 'text-primary' },
          { label: 'Security Alerts', value: '3', icon: ShieldCheck, change: 'Action Needed', color: 'text-destructive' },
          { label: 'System Revenue', value: '$45,200', icon: DollarSign, change: '+8%', color: 'text-success' },
          { label: 'Active Hubs', value: '6', icon: MapPin, change: 'All Online', color: 'text-chart-2' },
        ];
      default:
        return [
          { label: 'Total Shipments', value: '1,250', icon: Package, change: '+12%', color: 'text-primary' },
          { label: 'In Transit', value: '45', icon: Truck, change: '+8%', color: 'text-chart-2' },
          { label: 'Revenue', value: '$125,000', icon: DollarSign, change: '+15%', color: 'text-success' },
          { label: 'Active Users', value: '156', icon: Users, change: '+5%', color: 'text-chart-5' },
        ];
    }
  };

  const getQuickActions = () => {
    const actions = [];
    if (legacyUser?.role === 'RDR') {
      actions.push(
        { title: 'New Pickup', description: 'Attach TT & Photo Evidence', path: ROUTE_PATHS.RIDER.PICKUP, icon: QrCode },
        { title: 'Label Activation', description: 'Print & Verify AWB Label', path: ROUTE_PATHS.RIDER.LABEL, icon: FileCheck },
        { title: 'Warehouse Drop', description: 'Scan Gate & Handover', path: ROUTE_PATHS.RIDER.WAREHOUSE, icon: Warehouse },
        { title: 'Tag Management', description: 'Reconciliation & Voiding', path: ROUTE_PATHS.RIDER.TAGS, icon: ShieldCheck }
      );
    }
    if (legacyUser?.role === 'DES') {
      actions.push(
        { title: 'Registration Queue', description: 'Verify TT Records', path: ROUTE_PATHS.OFFICE.QUEUE, icon: Clock },
        { title: 'Data Audit', description: 'Check Address Accuracy', path: '#', icon: FileCheck }
      );
    }
    if (legacyUser?.role === 'WH') {
      actions.push(
        { title: 'Receiving Bay', description: 'Scan & Inspect Parcels', path: ROUTE_PATHS.WAREHOUSE.RECEIVING, icon: Warehouse },
        { title: 'Create Manifest', description: 'Group for Dispatch', path: ROUTE_PATHS.WAREHOUSE.DISPATCH, icon: Send }
      );
    }
    if (legacyUser?.role === 'SUP') {
      actions.push(
        { title: 'Security Audit', description: 'Reprint & Tag Alerts', path: ROUTE_PATHS.SUPERVISOR.AUDIT, icon: ShieldCheck },
        { title: 'Inventory Control', description: 'Issue Tag Batches', path: ROUTE_PATHS.SUPERVISOR.INVENTORY, icon: Package }
      );
    }
    return actions;
  };

  const stats = getRoleMetrics();
  const actions = getQuickActions();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {legacyUser?.name || 'User'}
        </h1>
        <p className="text-muted-foreground">
          Operation Center • {legacyUser?.role} Role • February 11, 2026
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="card-modern overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} transition-transform group-hover:scale-110`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{stat.value}</div>
              <p className="text-xs mt-1">
                <span className={stat.change.includes('-') ? 'text-destructive' : 'text-primary font-medium'}>
                  {stat.change}
                </span>{' '}
                <span className="text-muted-foreground">status update</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Critical Tasks</CardTitle>
                  <CardDescription>Actions requiring immediate attention</CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[
                  { id: 'TT-00912', task: 'Missing Tag Photo Evidence', time: '10m ago', priority: 'High', status: 'Pending' },
                  { id: 'AWB-5521', task: 'Relabel Request: Damaged QR', time: '25m ago', priority: 'Medium', status: 'Review' },
                  { id: 'M-99120', task: 'Manifest Reconciliation Mismatch', time: '1h ago', priority: 'High', status: 'Action' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${item.priority === 'High' ? 'bg-destructive' : 'bg-chart-4'}`} />
                      <div>
                        <p className="font-medium text-sm">{item.task}</p>
                        <p className="text-xs text-muted-foreground font-mono">{item.id} • {item.time}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="card-modern bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All geofence constraints active. QR scanning verification enforced for all custody handovers.
                </p>
                <div className="mt-4 flex gap-2">
                  <div className="px-2 py-1 bg-primary/10 text-primary text-[10px] rounded font-semibold uppercase tracking-wider">
                    Encryption Active
                  </div>
                  <div className="px-2 py-1 bg-primary/10 text-primary text-[10px] rounded font-semibold uppercase tracking-wider">
                    GPS Synced
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="card-modern bg-chart-2/5 border-chart-2/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-chart-2" />
                  SLA Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Average registration time is 4.2 minutes. Pickup to WH arrival currently within target range.
                </p>
                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-chart-2 w-[88%]" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => action.path !== '#' && navigate(action.path)}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{action.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{action.description}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="card-modern overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-2">
                <Users className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-xs font-medium">Support & Training</p>
                <p className="text-[10px] text-muted-foreground">View SOP manuals and system tutorials</p>
                <Button variant="secondary" size="sm" className="mt-2 w-full">Open Guide</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
