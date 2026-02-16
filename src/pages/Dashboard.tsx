import React, { useState } from 'react';
import { Package, Clock, ShieldCheck, Navigation, Map as MapIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useRealtimeMetrics } from '../hooks/useRealtimeMetrics';
import { useAuth } from '../hooks/useAuth';

import RoutePlanner from '@/components/RoutePlanner';
import RealTimeMapView from '@/components/RealTimeMapView';
import AuditFeed from '@/components/AuditFeed';
import FleetStatus from '@/components/FleetStatus';
import RevenueForecast from '@/components/RevenueForecast';

export default function Dashboard() {
  const { pending, transitTime } = useRealtimeMetrics();
  const { role } = useAuth(); 
  const [selectedCity, setSelectedCity] = useState('Yangon');

  return (
    <div className="space-y-10 pb-20 max-w-[1650px] mx-auto animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-luxury-gold" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Secure Operations Command</span>
          </div>
          <h1 className="text-4xl font-bold text-luxury-cream tracking-tight">
            Britium <span className="text-luxury-gold uppercase">{role === 'APP_OWNER' ? 'Executive' : 'Console'}</span>
          </h1>
        </div>
        <div className="luxury-glass px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[11px] font-mono text-white/60 uppercase tracking-widest">Global Ops Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-1 space-y-6">
          <Card className="luxury-card border-none group hover:border-luxury-gold/20 transition-all">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-luxury-gold/10 transition-all">
                <Package className="h-7 w-7 text-luxury-gold" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-bold mb-1">Live Dispatches</p>
                <span className="text-3xl font-bold text-luxury-cream">{pending}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="luxury-card border-none group hover:border-emerald-500/20 transition-all">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-all">
                <Clock className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-bold mb-1">Avg. Transit</p>
                <span className="text-3xl font-bold text-luxury-cream">{transitTime}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="xl:col-span-3"><RevenueForecast /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <RoutePlanner />
          <FleetStatus />
        </div>
        <div className="lg:col-span-8 space-y-8">
          <div className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl h-[500px]">
            <RealTimeMapView city={selectedCity} />
          </div>
          <AuditFeed />
        </div>
      </div>
    </div>
  );
}