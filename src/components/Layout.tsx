import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  QrCode,
  Truck,
  ClipboardCheck,
  Database,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  User,
  Warehouse,
  Send,
  FileSearch,
  MapPin,
  Crown,
  Settings,
  DollarSign,
  Users,
  TrendingUp,
  Headphones,
  Store,
  Shield,
  BarChart3,
  CreditCard,
  MessageSquare,
  Megaphone,
  Bell,
  Search,
  Globe,
  Cpu,
  Activity,
  Languages,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { ROUTE_PATHS, type UserRole, USER_ROLES } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  nameMyanmar: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
  badge?: string;
  badgeColor?: string;
  children?: NavItem[];
}

// Language type
type Language = 'en' | 'my';

export default function Layout({ children }: LayoutProps) {
  const { user, userData, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Enhanced navigation with Myanmar translations and role-based access
  const navigation: NavItem[] = [
    // Dashboard
    {
      name: 'Dashboard',
      nameMyanmar: 'ဒက်ရှ်ဘုတ်',
      href: ROUTE_PATHS.DASHBOARD,
      icon: LayoutDashboard,
      roles: ['RDR', 'DES', 'WH', 'SUP', 'SSM', 'SSR', 'SUPER_ADMIN', 'FINANCE_ADMIN', 'OPERATIONS_ADMIN', 'MARKETING_ADMIN', 'CUSTOMER_SERVICE_ADMIN', 'MERCHANT', 'CUSTOMER', 'MARKETING', 'CUSTOMER_SERVICE', 'FINANCE_USER', 'ANALYST'],
    },
    
    // Operations Section
    {
      name: 'Operations',
      nameMyanmar: 'လုပ်ငန်းများ',
      href: '/operations',
      icon: Truck,
      roles: ['RDR', 'DES', 'WH', 'SUP', 'SSM', 'SSR', 'OPERATIONS_ADMIN', 'SUPER_ADMIN'],
      badge: 'OPS',
      badgeColor: 'bg-electric-blue',
      children: [
        {
          name: 'Shipments',
          nameMyanmar: 'ပို့ဆောင်မှုများ',
          href: '/shipments',
          icon: Package,
          roles: ['RDR', 'DES', 'WH', 'SUP', 'SSM', 'SSR', 'OPERATIONS_ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'QR Operations',
          nameMyanmar: 'QR လုပ်ငန်းများ',
          href: '/qr-operations',
          icon: QrCode,
          roles: ['RDR', 'DES', 'WH', 'SUP', 'OPERATIONS_ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'Courier App',
          nameMyanmar: 'ပို့ဆောင်သူ အက်ပ်',
          href: '/courier-app',
          icon: Truck,
          roles: ['RDR', 'SUP', 'OPERATIONS_ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'Hub Operations',
          nameMyanmar: 'ဗဟိုချက် လုပ်ငန်းများ',
          href: '/hub-operations',
          icon: Warehouse,
          roles: ['WH', 'SSM', 'SUP', 'OPERATIONS_ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'Tamper Tags',
          nameMyanmar: 'တမ်ပါ တက်ဂ်များ',
          href: '/tamper-tags',
          icon: ShieldAlert,
          roles: ['SUP', 'OPERATIONS_ADMIN', 'SUPER_ADMIN'],
        }
      ]
    },

    // Admin Section
    {
      name: 'Administration',
      nameMyanmar: 'စီမံခန့်ခွဲမှု',
      href: '/admin',
      icon: Crown,
      roles: ['SUPER_ADMIN', 'FINANCE_ADMIN', 'OPERATIONS_ADMIN', 'MARKETING_ADMIN', 'CUSTOMER_SERVICE_ADMIN'],
      badge: 'ADMIN',
      badgeColor: 'bg-neon-purple',
      children: [
        {
          name: 'Super Admin',
          nameMyanmar: 'စူပါ စီမံခန့်ခွဲသူ',
          href: '/admin/super-admin',
          icon: Shield,
          roles: ['SUPER_ADMIN'],
        },
        {
          name: 'Finance Admin',
          nameMyanmar: 'ဘဏ္ဍာရေး စီမံခန့်ခွဲသူ',
          href: '/admin/finance',
          icon: DollarSign,
          roles: ['FINANCE_ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'Operations Admin',
          nameMyanmar: 'လုပ်ငန်း စီမံခန့်ခွဲသူ',
          href: '/admin/operations',
          icon: Settings,
          roles: ['OPERATIONS_ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'Marketing Admin',
          nameMyanmar: 'စျေးကွက်ရှာဖွေရေး စီမံခန့်ခွဲသူ',
          href: '/admin/marketing',
          icon: Megaphone,
          roles: ['MARKETING_ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'Service Admin',
          nameMyanmar: 'ဝန်ဆောင်မှု စီမံခန့်ခွဲသူ',
          href: '/admin/customer-service',
          icon: Headphones,
          roles: ['CUSTOMER_SERVICE_ADMIN', 'SUPER_ADMIN'],
        }
      ]
    },

    // Business Section
    {
      name: 'Business',
      nameMyanmar: 'စီးပွားရေး',
      href: '/business',
      icon: Store,
      roles: ['MERCHANT', 'CUSTOMER', 'MARKETING', 'CUSTOMER_SERVICE', 'FINANCE_USER', 'ANALYST'],
      badge: 'BIZ',
      badgeColor: 'bg-cyber-gold',
      children: [
        {
          name: 'Merchant Portal',
          nameMyanmar: 'ကုန်သည် ပေါ်တယ်',
          href: '/merchant/portal',
          icon: Store,
          roles: ['MERCHANT'],
        },
        {
          name: 'Customer Portal',
          nameMyanmar: 'ဖောက်သည် ပေါ်တယ်',
          href: '/customer/portal',
          icon: User,
          roles: ['CUSTOMER'],
        },
        {
          name: 'Marketing',
          nameMyanmar: 'စျေးကွက်ရှာဖွေရေး',
          href: '/marketing',
          icon: TrendingUp,
          roles: ['MARKETING', 'MARKETING_ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'Customer Service',
          nameMyanmar: 'ဖောက်သည် ဝန်ဆောင်မှု',
          href: '/customer-service',
          icon: MessageSquare,
          roles: ['CUSTOMER_SERVICE', 'CUSTOMER_SERVICE_ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'Finance',
          nameMyanmar: 'ဘဏ္ဍာရေး',
          href: '/finance',
          icon: CreditCard,
          roles: ['FINANCE_USER', 'FINANCE_ADMIN', 'SUPER_ADMIN'],
        },
        {
          name: 'Analytics',
          nameMyanmar: 'ခွဲခြမ်းစိတ်ဖြာမှု',
          href: '/analytics',
          icon: BarChart3,
          roles: ['ANALYST', 'SUPER_ADMIN'],
        }
      ]
    }
  ];

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => 
    userData?.role && item.roles.includes(userData.role)
  ).map(item => ({
    ...item,
    children: item.children?.filter(child => 
      userData?.role && child.roles.includes(userData.role)
    )
  }));

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  const NavItem = ({ item, isChild = false }: { item: NavItem; isChild?: boolean }) => {
    const isActive = location.pathname === item.href || 
                    (item.children && item.children.some(child => location.pathname === child.href));
    const hasChildren = item.children && item.children.length > 0;
    const expanded = isExpanded(item.name);

    return (
      <div className="space-y-1">
        <div
          className={cn(
            "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
            isChild ? "ml-6 pl-8" : "",
            isActive
              ? "bg-gradient-to-r from-electric-blue/20 to-neon-purple/20 text-white border border-electric-blue/30 shadow-lg shadow-electric-blue/20"
              : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
          )}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(item.name)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-electric-blue" : "text-white/60 group-hover:text-white"
                )} />
                <span className={`font-cyber ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {language === 'my' ? item.nameMyanmar : item.name}
                </span>
                {item.badge && (
                  <Badge className={`text-xs ${item.badgeColor} text-white border-0 font-cyber`}>
                    {item.badge}
                  </Badge>
                )}
              </button>
            ) : (
              <NavLink
                to={item.href}
                className="flex items-center gap-3 flex-1"
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-electric-blue" : "text-white/60 group-hover:text-white"
                )} />
                <span className={`font-cyber ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {language === 'my' ? item.nameMyanmar : item.name}
                </span>
                {item.badge && (
                  <Badge className={`text-xs ${item.badgeColor} text-white border-0 font-cyber`}>
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            )}
          </div>
          
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(item.name)}
              className="p-1 rounded-md hover:bg-white/10 transition-colors"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-white/60" />
              ) : (
                <ChevronRight className="h-4 w-4 text-white/60" />
              )}
            </button>
          )}
        </div>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              {item.children?.map((child) => (
                <NavItem key={child.name} item={child} isChild />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="cyber-card h-full rounded-none border-r border-white/10 bg-deep-space/95 backdrop-blur-xl">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="logo-cyber p-2">
                <img 
                  src="/favicon.ico" 
                  alt="Britium Express" 
                  className="w-8 h-8 animate-neon-pulse"
                />
              </div>
              <div>
                <h1 className={`font-cyber font-bold text-lg gradient-text ${language === 'my' ? 'myanmar-heading' : ''}`}>
                  BRITIUM EXPRESS
                </h1>
                <p className={`text-xs text-white/60 font-modern ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {language === 'my' ? 'သယ်ယူပို့ဆောင်ရေးစနစ်' : 'Delivery System'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-electric-blue/30">
                <AvatarFallback className="bg-gradient-to-br from-electric-blue to-neon-purple text-white font-cyber">
                  {userData?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className={`font-cyber font-semibold text-white truncate ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {userData?.displayName || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className={`text-sm text-white/60 truncate font-modern ${language === 'my' ? 'myanmar-text' : ''}`}>
                  {userData?.role || 'CUSTOMER'}
                </p>
              </div>
              <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs font-cyber">
                ACTIVE
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 space-y-3">
            {/* Language Switcher */}
            <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
              <button
                onClick={() => setLanguage('en')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-md text-xs font-cyber transition-all",
                  language === 'en' 
                    ? "bg-electric-blue text-white shadow-lg" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('my')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-md text-xs font-cyber myanmar-text transition-all",
                  language === 'my' 
                    ? "bg-electric-blue text-white shadow-lg" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                မြန်မာ
              </button>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              className="w-full btn-holographic"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className={language === 'my' ? 'myanmar-text' : ''}>
                {language === 'my' ? 'ထွက်ရန်' : 'Logout'}
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-16 border-b border-white/10 bg-deep-space/95 backdrop-blur-xl">
          <div className="flex h-full items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder={language === 'my' ? 'ရှာဖွေရန်...' : 'Search...'}
                  className="input-cyber pl-10 w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative text-white/60 hover:text-white hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-holographic-pink rounded-full animate-pulse" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-electric-blue/30">
                      <AvatarFallback className="bg-gradient-to-br from-electric-blue to-neon-purple text-white text-xs font-cyber">
                        {userData?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 cyber-card border-white/20" align="end">
                  <DropdownMenuLabel className={`font-cyber ${language === 'my' ? 'myanmar-text' : ''}`}>
                    {language === 'my' ? 'အကောင့်' : 'My Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10">
                    <User className="mr-2 h-4 w-4" />
                    <span className={language === 'my' ? 'myanmar-text' : ''}>
                      {language === 'my' ? 'ပရိုဖိုင်' : 'Profile'}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white/80 hover:text-white hover:bg-white/10">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className={language === 'my' ? 'myanmar-text' : ''}>
                      {language === 'my' ? 'ဆက်တင်များ' : 'Settings'}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-holographic-pink hover:text-white hover:bg-holographic-pink/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className={language === 'my' ? 'myanmar-text' : ''}>
                      {language === 'my' ? 'ထွက်ရန်' : 'Log out'}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}