import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function BranchMetrics() {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data, error } = await supabase
        .from('branch_shipment_metrics')
        .select('*');
      
      if (error) console.error('Error fetching metrics:', error);
      else setMetrics(data || []);
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((m) => (
        <div key={m.branch_id} className="p-4 bg-slate-800 rounded-lg border border-white/10">
          <h3 className="text-luxury-gold font-bold mb-2">Branch {m.branch_id}</h3>
          <div className="flex justify-between text-sm text-white/70">
            <span>Total: {m.total_shipments}</span>
            <span className="text-emerald-400">Delivered: {m.delivered_count}</span>
            <span className="text-amber-400">Pending: {m.pending_count}</span>
          </div>
          <div className="mt-2 text-xs text-white/30">
            Success Rate: {m.delivery_rate}%
          </div>
        </div>
      ))}
    </div>
  );
}