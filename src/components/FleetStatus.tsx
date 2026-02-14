// src/components/FleetStatus.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Truck, Circle, UserCheck } from 'lucide-react';

export default function FleetStatus() {
  const [riders, setRiders] = useState<any[]>([]);

  useEffect(() => {
    const fetchFleet = async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('full_name, status, current_load')
        .eq('role', 'RIDER');
      if (data) setRiders(data);
    };

    fetchFleet();
    const sub = supabase.channel('fleet-sync').on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, fetchFleet).subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  return (
    <div className="luxury-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <UserCheck className="h-4 w-4 text-luxury-gold" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Active Fleet</h3>
      </div>
      
      <div className="space-y-4">
        {riders.map((rider, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-luxury-gold/10 flex items-center justify-center">
                <Truck className="h-4 w-4 text-luxury-gold" />
              </div>
              <div>
                <p className="text-xs font-bold text-luxury-cream">{rider.full_name}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-tighter">Load: {rider.current_load || 0} Parcels</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-white/40 uppercase">{rider.status || 'Idle'}</span>
              <Circle className={`h-2 w-2 fill-current ${rider.status === 'active' ? 'text-emerald-500' : 'text-white/20'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}