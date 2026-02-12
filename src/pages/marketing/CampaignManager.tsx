import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  MessageSquare,
  Bell,
  Split,
  Plus,
  Search,
  Filter,
  BarChart3,
  Calendar,
  MoreVertical,
  Send,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

// Animation variants defined locally to resolve missing module error
const springPresets = {
  gentle: {
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'ab_test';
  status: 'active' | 'draft' | 'completed' | 'scheduled';
  reach: number;
  engagement: number;
  conversion: number;
  lastUpdated: string;
  variants?: {
    name: string;
    performance: number;
    count: number;
  }[];
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-001',
    name: 'Winter Logistics 2026 Promo',
    type: 'email',
    status: 'active',
    reach: 12500,
    engagement: 18.5,
    conversion: 4.2,
    lastUpdated: '2026-02-10 14:30',
  },
  {
    id: 'cmp-002',
    name: 'Instant SMS Alert: North Hub Delay',
    type: 'sms',
    status: 'completed',
    reach: 4500,
    engagement: 94.2,
    conversion: 12.1,
    lastUpdated: '2026-02-09 09:15',
  },
  {
    id: 'cmp-003',
    name: 'New Merchant Onboarding Flow',
    type: 'ab_test',
    status: 'active',
    reach: 2800,
    engagement: 22.4,
    conversion: 8.5,
    lastUpdated: '2026-02-11 10:00',
    variants: [
      { name: 'Variant A: Video Tutorial', performance: 8.2, count: 1400 },
      { name: 'Variant B: Text Guide', performance: 8.8, count: 1400 },
    ]
  },
  {
    id: 'cmp-004',
    name: 'App Push: Weekend Delivery Discount',
    type: 'push',
    status: 'scheduled',
    reach: 55000,
    engagement: 0,
    conversion: 0,
    lastUpdated: '2026-02-11 16:45',
  }
];

const CampaignManager: React.FC = () => {
  const { user, legacyUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = MOCK_CAMPAIGNS.filter(campaign => {
    const matchesTab = activeTab === 'all' || campaign.type === activeTab;
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>;
      case 'completed': return <Badge variant="secondary" className="opacity-70">Completed</Badge>;
      case 'scheduled': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Scheduled</Badge>;
      case 'draft': return <Badge variant="outline">Draft</Badge>;
    }
  };

  const getTypeIcon = (type: Campaign['type']) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4 text-blue-500" />;
      case 'sms': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'push': return <Bell className="w-4 h-4 text-orange-500" />;
      case 'ab_test': return <Split className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Manager</h1>
          <p className="text-muted-foreground mt-1">Execute and monitor multi-channel marketing efforts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="btn-modern">
            <Users className="w-4 h-4 mr-2" />
            View Segments
          </Button>
          <Button className="btn-modern bg-primary text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[ 
          { label: 'Active Campaigns', value: '12', icon: Clock, color: 'text-blue-500' },
          { label: 'Total Reach', value: '842.5k', icon: Users, color: 'text-emerald-500' },
          { label: 'Avg. Open Rate', value: '24.8%', icon: Eye, color: 'text-orange-500' },
          { label: 'Conversions', value: '12.4k', icon: ArrowUpRight, color: 'text-indigo-500' },
        ].map((stat, i) => (
          <motion.div key={i} variants={staggerItem}>
            <Card className="p-4 card-modern flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full md:w-[500px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="push">Push</TabsTrigger>
            <TabsTrigger value="ab_test">A/B</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search campaigns..." 
              className="pl-9 bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Campaign List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredCampaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={springPresets.gentle}
            >
              <Card className="p-5 card-modern group hover:border-primary/50">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                  {/* Name & Type */}
                  <div className="flex-1 min-w-[240px]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 rounded-lg bg-muted">
                        {getTypeIcon(campaign.type)}
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {campaign.type.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {campaign.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {campaign.lastUpdated}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {campaign.reach.toLocaleString()} Reach
                      </span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-tight">Engagement</p>
                      <div className="flex items-end gap-1.5">
                        <span className="text-xl font-bold">{campaign.engagement}%</span>
                        <BarChart3 className="w-4 h-4 text-emerald-500 mb-1" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-tight">Conversion</p>
                      <div className="flex items-end gap-1.5">
                        <span className="text-xl font-bold">{campaign.conversion}%</span>
                        <ArrowUpRight className="w-4 h-4 text-emerald-500 mb-1" />
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-tight">Status</p>
                      <div className="mt-1">{getStatusBadge(campaign.status)}</div>
                    </div>
                  </div>

                  {/* A/B Test Variants Visualization */}
                  {campaign.type === 'ab_test' && campaign.variants && (
                    <div className="flex-1 min-w-[200px] border-l border-border/50 pl-6">
                      <p className="text-xs font-semibold mb-3">A/B Test Performance</p>
                      <div className="space-y-3">
                        {campaign.variants.map((v, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{v.name}</span>
                              <span className="font-bold">{v.performance}%</span>
                            </div>
                            <Progress value={v.performance * 10} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:border-l lg:border-border/50 lg:pl-6">
                    <Button variant="ghost" size="icon" className="hover:text-primary">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-blue-500">
                      <Send className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="gap-2">
                          <Calendar className="w-4 h-4" /> Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Split className="w-4 h-4" /> Create Variation
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive gap-2">
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCampaigns.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
              <Search className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-medium">No campaigns found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            <Button 
              variant="link" 
              className="mt-2" 
              onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignManager;