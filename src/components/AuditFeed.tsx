import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Activity, Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface AuditEntry {
  id: string;
  action: string;
  table_name: string;
  changes: any;
  created_at: string;
  user_email?: string;
}

const AuditFeed = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);

  useEffect(() => {
    // 1. Initial Fetch of recent logs
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data) setLogs(data);
    };

    fetchLogs();

    // 2. Realtime Subscription for Luxury Updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_log' },
        (payload) => {
          setLogs((prev) => [payload.new as AuditEntry, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'insert': return <Package className="text-emerald-400" size={18} />;
      case 'update': return <Truck className="text-amber-400" size={18} />;
      case 'delete': return <AlertCircle className="text-rose-400" size={18} />;
      default: return <Activity className="text-blue-400" size={18} />;
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Activity size={18} className="text-indigo-400" />
          Live Audit Feed
        </h3>
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>

      <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                  {getIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 font-medium truncate">
                    {log.table_name.charAt(0).toUpperCase() + log.table_name.slice(1)} {log.action.toLowerCase()}d
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {log.user_email || 'System Process'} • {format(new Date(log.created_at), 'HH:mm:ss')}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            Waiting for activity...
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditFeed;