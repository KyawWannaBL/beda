import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Clock, TrendingUp, Navigation } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Executive Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back to Britium Command Center.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all">
          <Navigation className="h-4 w-4" /> Start Operations
        </button>
      </header>

      {/* Metric Cards - Minimalist Layering */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Package, label: 'Pending Dispatches', value: '1,284', trend: '+12.5%' },
          { icon: Clock, label: 'Average Transit Time', value: '1.4 Days', trend: '-2.1%' },
          { icon: TrendingUp, label: 'Operational Efficiency', value: '98.2%', trend: '+0.4%' }
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] rounded-3xl p-2">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                <item.icon className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">{item.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">{item.value}</span>
                  <span className="text-[10px] font-bold text-emerald-600">{item.trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}