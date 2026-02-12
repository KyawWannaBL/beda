import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  TrendingUp,
  CreditCard,
  Terminal,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Cpu,
  Key,
  Globe,
  Zap,
  Ship,
  ChevronRight,
  Copy,
  Download
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { Merchant } from '@/lib/admin-system';
import { SHIPMENT_STATUS } from '@/lib/index';

const ANALYTICS_DATA = [
  { name: 'Feb 05', shipments: 45, revenue: 1200 },
  { name: 'Feb 06', shipments: 52, revenue: 1450 },
  { name: 'Feb 07', shipments: 48, revenue: 1300 },
  { name: 'Feb 08', shipments: 70, revenue: 1900 },
  { name: 'Feb 09', shipments: 61, revenue: 1650 },
  { name: 'Feb 10', shipments: 85, revenue: 2300 },
  { name: 'Feb 11', shipments: 92, revenue: 2600 },
];

const MOCK_SHIPMENTS = [
  {
    id: 'SHP-9021',
    recipient: 'Sarah Connor',
    status: 'IN_TRANSIT_TO_SUBSTATION',
    date: '2026-02-11',
    type: 'Electronics',
    value: '$450.00',
  },
  {
    id: 'SHP-9022',
    recipient: 'John Wick',
    status: 'DELIVERED_POD_CAPTURED',
    date: '2026-02-10',
    type: 'Apparel',
    value: '$120.00',
  },
  {
    id: 'SHP-9023',
    recipient: 'Ellen Ripley',
    status: 'OUT_FOR_DELIVERY',
    date: '2026-02-11',
    type: 'Medical',
    value: '$890.00',
  },
  {
    id: 'SHP-9024',
    recipient: 'Marty McFly',
    status: 'DELIVERY_FAILED_NDR',
    date: '2026-02-09',
    type: 'Automotive',
    value: '$55.00',
  },
];

const MerchantPortal: React.FC = () => {
  const { user, legacyUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // In a real app, we'd cast the user to Merchant based on role
  const merchant = user as unknown as Merchant;

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10 space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 px-2 py-0.5">
              2026 Enterprise Node
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {merchant?.businessName || 'Global Merchant'}
          </h1>
          <p className="text-muted-foreground">
            Operational integrity: <span className="text-emerald-500 font-medium">99.8%</span> | System Status: Optimal
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="btn-modern bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Shipment
          </Button>
          <Button variant="outline" className="btn-modern border-border/50">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between border-b border-border/50 pb-px mb-8 overflow-x-auto">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            {['overview', 'shipments', 'analytics', 'billing', 'api'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 py-4 capitalize text-sm font-medium transition-all"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Shipments"
              value="1,284"
              change="+12.5%"
              icon={<Package className="w-5 h-5 text-primary" />}
              description="vs last 30 days"
            />
            <MetricCard
              title="In-Transit"
              value="42"
              icon={<Clock className="w-5 h-5 text-amber-500" />}
              description="Active deliveries"
            />
            <MetricCard
              title="Revenue Generated"
              value="$45,200"
              change="+8.2%"
              icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
              description="Settled amounts"
            />
            <MetricCard
              title="Success Rate"
              value="98.4%"
              icon={<CheckCircle2 className="w-5 h-5 text-indigo-500" />}
              description="SLA compliance"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2 card-modern">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Delivery Intelligence</CardTitle>
                  <CardDescription>Daily volume and revenue performance metrics</CardDescription>
                </div>
                <Badge variant="secondary">Real-time Sync</Badge>
              </CardHeader>
              <CardContent className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ANALYTICS_DATA}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                      itemStyle={{ color: 'var(--primary)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Business Insights Widget */}
            <Card className="card-modern border-primary/10 bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">AI Insights</span>
                </div>
                <CardTitle className="text-xl">Logistics Optimizer</CardTitle>
                <CardDescription>2026 Predictive Analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Route Efficiency</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-1.5" />
                </div>
                <div className="p-4 rounded-xl bg-background/50 border border-border/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold">Quick Action Suggestion</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Volume to <strong>Downtown</strong> is projected to increase by 22% tomorrow. We recommend early dispatch for high-value electronics.
                  </p>
                  <Button size="sm" className="w-full text-xs">Optimize Batch</Button>
                </div>
                <div className="flex items-center justify-between text-xs pt-2">
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-indigo-400" />
                    <span>Carbon Offset: 1.2t</span>
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Shipments Tab */}
        <TabsContent value="shipments">
          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle>Shipment Manifest</CardTitle>
                <CardDescription>Track and manage your current logistics lifecycle</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search ID, name..." className="pl-10 h-9 bg-muted/30 border-none" />
                </div>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table className="table-modern">
                <TableHeader>
                  <TableRow>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_SHIPMENTS.map((shp) => (
                    <TableRow key={shp.id} className="group">
                      <TableCell className="font-mono font-medium text-primary">{shp.id}</TableCell>
                      <TableCell>{shp.recipient}</TableCell>
                      <TableCell className="text-muted-foreground">{shp.type}</TableCell>
                      <TableCell>{shp.value}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${
                            shp.status === 'DELIVERED_POD_CAPTURED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            shp.status === 'DELIVERY_FAILED_NDR' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                            'bg-primary/10 text-primary border-primary/20'
                          }`}
                        >
                          {shp.status.toLowerCase().replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Access Tab */}
        <TabsContent value="api">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 card-modern">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Terminal className="w-5 h-5 text-primary" />
                  <CardTitle>Developer Access</CardTitle>
                </div>
                <CardDescription>Integrate our logistics engine directly into your 2026 commerce stack</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">Production API Key</p>
                      <p className="text-xs text-muted-foreground">Created on 2026-01-15</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-background rounded border border-border/50 font-mono text-xs overflow-hidden text-ellipsis">
                      sk_live_2026_x782...kL92
                    </code>
                    <Button variant="outline" size="icon">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Quick Documentation</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <DocLink title="Create Shipment" endpoint="POST /v1/shipments" />
                    <DocLink title="Track Package" endpoint="GET /v1/tracking/:id" />
                    <DocLink title="Webhook Alerts" endpoint="POST /v1/webhooks" />
                    <DocLink title="Rate Estimator" endpoint="GET /v1/rates" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern h-fit">
              <CardHeader>
                <CardTitle>Usage Limits</CardTitle>
                <CardDescription>Enterprise Tier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">API Requests</span>
                    <span className="font-medium">12k / 50k</span>
                  </div>
                  <Progress value={24} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Webhook Calls</span>
                    <span className="font-medium">8.2k / 10k</span>
                  </div>
                  <Progress value={82} className="h-1" />
                </div>
                <Button variant="secondary" className="w-full text-xs mt-4">
                  Upgrade Tier
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other Tabs Placeholder */}
        {['analytics', 'billing'].includes(activeTab) && (
           <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
               <BarChart3 className="w-8 h-8 text-primary animate-pulse" />
             </div>
             <div className="space-y-1">
               <h3 className="text-xl font-bold">Detailed {activeTab} View Loading</h3>
               <p className="text-muted-foreground">Connecting to the 2026 Data Lake...</p>
             </div>
           </div>
        )}
      </Tabs>
    </div>
  );
};

/**
 * Sub-components
 */

const MetricCard: React.FC<{
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  description: string;
}> = ({ title, value, change, icon, description }) => (
  <Card className="card-modern overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/5">{icon}</div>
        {change && (
          <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
            {change}
          </Badge>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</p>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const DocLink: React.FC<{ title: string; endpoint: string }> = ({ title, endpoint }) => (
  <div className="flex flex-col p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer group">
    <span className="text-sm font-medium group-hover:text-primary transition-colors">{title}</span>
    <span className="text-[10px] font-mono text-muted-foreground mt-1">{endpoint}</span>
  </div>
);

export default MerchantPortal;