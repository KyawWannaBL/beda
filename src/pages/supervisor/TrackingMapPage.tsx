import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Search,
  Filter,
  Layers,
  Maximize2,
  MoreHorizontal,
  Truck,
  User,
  Clock,
  Battery,
  Signal,
  ChevronRight,
  Activity,
  Target,
  AlertCircle,
  Package,
  Phone,
  History,
  X
} from 'lucide-react';
// Language context - using simple state for now
const useLanguageContext = () => ({ language: 'en' });
const translations = { en: {} };
import { SHIPMENT_STATUS } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

/**
 * Britium Express - Tracking Map Page
 * Real-time GPS simulation and route visualization
 * © 2026 Britium Express
 */

interface RiderLocation {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'offline';
  battery: number;
  signal: number;
  lat: number;
  lng: number;
  lastUpdated: string;
  currentShipment?: string;
  speed: number;
}

const TrackingMapPage: React.FC = () => {
  const { language } = useLanguageContext();
  const t = (key: string) => translations[language][key as keyof typeof translations['en']] || key;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

  // Mock Riders Data
  const riders: RiderLocation[] = [
    { id: 'R-1024', name: 'Aung Kyaw', status: 'active', battery: 85, signal: 4, lat: 40, lng: 30, lastUpdated: '2 mins ago', currentShipment: 'BRT-99283', speed: 35 },
    { id: 'R-2051', name: 'Kyaw Zeya', status: 'active', battery: 42, signal: 5, lat: 60, lng: 70, lastUpdated: 'Just now', currentShipment: 'BRT-88120', speed: 42 },
    { id: 'R-3092', name: 'Min Thu', status: 'idle', battery: 98, signal: 3, lat: 25, lng: 85, lastUpdated: '15 mins ago', speed: 0 },
    { id: 'R-4011', name: 'Htet Lin', status: 'active', battery: 67, signal: 5, lat: 75, lng: 45, lastUpdated: '1 min ago', currentShipment: 'BRT-77451', speed: 28 },
    { id: 'R-5520', name: 'Zarni', status: 'offline', battery: 12, signal: 0, lat: 10, lng: 10, lastUpdated: '2 hours ago', speed: 0 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsMapLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredRiders = useMemo(() => {
    return riders.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.currentShipment && r.currentShipment.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const selectedRider = riders.find(r => r.id === selectedRiderId);

  return (
    <div className="h-screen flex flex-col bg-navy-900">
      {/* Top Controls Bar */}
      <div className="flex-shrink-0 bg-navy-800/50 backdrop-blur-sm border-b border-gold-500/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">{t('way.trackingMap')}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <Badge variant="outline" className="border-success text-success">
                34 Riders Online
              </Badge>
              <Badge variant="outline" className="border-warning text-warning">
                12 Idle
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Input
              placeholder="Search riders, shipments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Rider List */}
        <div className="w-80 bg-navy-800/30 backdrop-blur-sm border-r border-gold-500/20 flex flex-col">
          <div className="p-4 border-b border-gold-500/20">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
                <TabsTrigger value="active">{t('common.active')}</TabsTrigger>
                <TabsTrigger value="idle">Idle</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {filteredRiders.map((rider) => (
                <motion.div
                  key={rider.id}
                  onClick={() => setSelectedRiderId(rider.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    selectedRiderId === rider.id
                      ? 'border-gold-500 bg-gold-500/5 shadow-lg shadow-gold-500/10'
                      : 'border-border hover:border-gold-400/50 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        rider.status === 'active' ? 'bg-success animate-pulse' :
                        rider.status === 'idle' ? 'bg-warning' : 'bg-destructive'
                      }`} />
                      <div>
                        <div className="font-medium text-white">{rider.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {rider.id}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <Battery className="w-3 h-3" />
                        <span>{rider.battery}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Signal className="w-3 h-3" />
                        <span>{rider.signal}/5</span>
                      </div>
                    </div>
                  </div>

                  {rider.currentShipment && (
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <Package className="w-3 h-3 text-gold-400" />
                        <span className="text-gold-400">{rider.currentShipment}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Activity className="w-3 h-3" />
                        <span>{rider.speed} km/h</span>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground mt-2">
                    {rider.lastUpdated}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {/* Stylized Simulated Map */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
            {isMapLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
                  <p className="text-white">Initializing Live Map...</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full overflow-hidden">
                {/* Grid Background Overlay */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#FFD700" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Simulated Map Paths (SVG) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  {/* Simulated Route for selected rider */}
                  {selectedRider && selectedRider.status === 'active' && (
                    <path
                      d={`M ${selectedRider.lat} ${selectedRider.lng} Q ${selectedRider.lat + 10} ${selectedRider.lng + 10} ${selectedRider.lat + 20} ${selectedRider.lng + 5}`}
                      stroke="#FFD700"
                      strokeWidth="0.5"
                      fill="none"
                      strokeDasharray="2,2"
                      className="animate-pulse"
                    />
                  )}
                </svg>

                {/* Animated Markers */}
                <div className="absolute inset-0">
                  {riders.map((rider) => (
                    <div
                      key={rider.id}
                      style={{ left: `${rider.lat}%`, top: `${rider.lng}%` }}
                      onClick={() => setSelectedRiderId(rider.id)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                    >
                      <div className="relative">
                        {/* Pulsing Aura for active riders */}
                        {rider.status === 'active' && (
                          <div className="absolute inset-0 w-8 h-8 bg-gold-500/30 rounded-full animate-ping" />
                        )}
                        
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          rider.status === 'active' ? 'bg-success border-white' :
                          rider.status === 'idle' ? 'bg-warning border-white' :
                          'bg-destructive border-white'
                        }`}>
                          <Truck className="w-3 h-3 text-white" />
                        </div>

                        {/* Tooltip Overlay */}
                        {(selectedRiderId === rider.id || rider.status === 'active') && (
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-navy-800/90 backdrop-blur-sm border border-gold-500/20 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span>{rider.name}</span>
                              <span>|</span>
                              <span>{rider.speed} km/h</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map Floating UI */}
                <div className="absolute top-4 left-4 space-y-2">
                  <Button variant="outline" size="sm" className="bg-navy-800/50 backdrop-blur-sm">
                    <Layers className="w-4 h-4 mr-2" />
                    Layers
                  </Button>
                  <Button variant="outline" size="sm" className="bg-navy-800/50 backdrop-blur-sm">
                    <Target className="w-4 h-4 mr-2" />
                    Center
                  </Button>
                </div>

                {/* Bottom Legend Overlay */}
                <div className="absolute bottom-4 left-4 bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-success rounded-full" />
                      <span className="text-white">In Transit</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-warning rounded-full" />
                      <span className="text-white">Idle</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-destructive rounded-full" />
                      <span className="text-white">Offline</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floating Details Panel (Bottom Right) */}
          {selectedRider && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute bottom-4 right-4 w-80"
            >
              <Card className="bg-navy-800/90 backdrop-blur-sm border-gold-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{selectedRider.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{selectedRider.id}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRiderId(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Current Status</div>
                      <Badge variant={selectedRider.status === 'active' ? 'default' : 'secondary'}>
                        {selectedRider.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Live Speed</div>
                      <div className="text-sm font-medium text-white">{selectedRider.speed} km/h</div>
                    </div>
                  </div>

                  {selectedRider.currentShipment ? (
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Current Job</div>
                      <div className="flex items-center justify-between p-2 bg-navy-700/50 rounded-lg">
                        <div>
                          <Badge variant="outline" className="text-xs">In Progress</Badge>
                          <div className="font-medium text-white mt-1">{selectedRider.currentShipment}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Downtown Business District
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Currently not assigned to any delivery.
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Rider
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <History className="w-4 h-4 mr-2" />
                      View History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingMapPage;