import React from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  Truck, 
  AlertCircle, 
  ArrowUpRight, 
  Clock 
} from 'lucide-react';

// Mock data for the dashboard
const stats = [
  { label: 'Total Shipments', value: '1,284', change: '+12%', icon: Package, color: 'text-blue-400' },
  { label: 'Active Riders', value: '42', change: '+3', icon: Users, iconColor: 'text-emerald-400' },
  { label: 'Revenue (MMK)', value: '4.2M', change: '+18%', icon: TrendingUp, color: 'text-cyan-400' },
  { label: 'Pending Pickups', value: '18', change: 'Critical', icon: AlertCircle, color: 'text-amber-400' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            System Overview
          </h1>
          <p className="text-slate-400 mt-1">Real-time logistics and operations metrics for Britium Express.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
          <Clock size={16} className="text-slate-400" />
          <span className="text-sm text-slate-300 font-mono">Last update: Just now</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="luxury-glass p-6 rounded-2xl border border-slate-700/50 hover:border-slate-500/50 transition-all">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl bg-slate-900/50 ${stat.color || 'text-emerald-400'}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                stat.change.includes('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shipments List */}
        <div className="lg:col-span-2 luxury-glass rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center">
            <h3 className="text-white font-bold">Live Shipment Feed</h3>
            <button className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
              VIEW ALL <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-slate-700/30">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">BR-EX-902{item}</p>
                    <p className="text-xs text-slate-500">To: North Dagon, Yangon</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 uppercase">
                    In Transit
                  </span>
                  <p className="text-[10px] text-slate-600 mt-1 font-mono">Updated 2m ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Fleet Status */}
        <div className="space-y-6">
          <div className="luxury-glass p-6 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-emerald-500/5 to-transparent">
            <h3 className="text-white font-bold mb-4">Fleet Distribution</h3>
            <div className="space-y-4">
              <FleetBar label="Yangon Central" percentage={85} color="bg-emerald-500" />
              <FleetBar label="Mandalay Hub" percentage={62} color="bg-blue-500" />
              <FleetBar label="Naypyidaw" percentage={45} color="bg-cyan-500" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/50 border-dashed">
            <h4 className="text-sm font-bold text-slate-300 mb-2">Need Assistance?</h4>
            <p className="text-xs text-slate-500 mb-4">Contact the technical dispatch team for system-level overrides.</p>
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all">
              SUPPORT TICKET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FleetBar({ label, percentage, color }: { label: string; percentage: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
        <span className="text-slate-400">{label}</span>
        <span className="text-white">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}