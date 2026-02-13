import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Package, Clock, TrendingUp, Navigation, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type AnyRole = string;

function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-300/20 bg-amber-400/10">
      <Icon className="h-4 w-4 text-amber-200" />
      <div>
        <div className="text-[11px] text-white/70">{label}</div>
        <div className="font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { userData, legacyUser } = useAuth();
  const role = (userData?.role || (legacyUser as any)?.role || 'STAFF') as AnyRole;

  const isFieldRole = ['RIDER', 'DRIVER', 'HELPER'].includes(role);

  const [taskActive, setTaskActive] = useState(true);

  const kpi = useMemo(() => {
    // Replace these with real values from your shipments/tasks state.
    return {
      remaining: 12,
      etdNext: '18 min',
      successRate: '96%',
    };
  }, []);

  const nextTask = useMemo(() => {
    return {
      wayId: 'WAY-2026-0213-001',
      customer: 'U Aung Min',
      address: 'No. 12, Insein Road, Yangon',
      status: 'NEXT',
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="text-white/60 text-sm">
            Welcome, {userData?.displayName || userData?.email || 'User'} • Role: <span className="text-white">{role}</span>
          </div>
        </div>

        {isFieldRole && (
          <Button
            className="h-12 bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-semibold"
            onClick={() => setTaskActive((s) => !s)}
          >
            <Navigation className="h-4 w-4 mr-2" />
            {taskActive ? 'Stop Task View' : 'Start Task View'}
          </Button>
        )}
      </div>

      {/* Luxury KPI strip */}
      <div className="grid gap-3 md:grid-cols-3">
        <Metric icon={Package} label="Remaining Parcels" value={`${kpi.remaining}`} />
        <Metric icon={Clock} label="ETD to Next Stop" value={kpi.etdNext} />
        <Metric icon={TrendingUp} label="Shift Success Rate" value={kpi.successRate} />
      </div>

      {/* Rider dynamic 70/30 */}
      {isFieldRole && taskActive ? (
        <div className="grid gap-4">
          <Card className="border-white/10 bg-white/5 backdrop-blur overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-amber-200" /> Live Navigation
                <Badge className="ml-2 bg-emerald-400/15 text-emerald-200 border border-emerald-300/20">
                  ACTIVE
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              {/* 70% map */}
              <div className="h-[55vh] md:h-[60vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
                <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.25),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.18),transparent_50%)]" />
                <div className="absolute top-4 left-4 text-xs text-white/70">
                  Map Placeholder — plug in your real Map component here.
                </div>
              </div>

              {/* 30% next task dock */}
              <div className="border-t border-white/10 p-4 bg-slate-950/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-white/60">Next Task</div>
                    <div className="text-lg font-semibold">{nextTask.wayId}</div>
                    <div className="text-sm text-white/80">{nextTask.customer}</div>
                    <div className="text-sm text-white/60">{nextTask.address}</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button className="h-14 bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-semibold">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Start Delivery
                    </Button>
                    <Button variant="outline" className="border-white/15 bg-white/5 hover:bg-white/10">
                      View Route
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Management view */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle>Operations</CardTitle>
            </CardHeader>
            <CardContent className="text-white/70">
              Monitor shipments, exceptions, and daily performance.
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle>Finance</CardTitle>
            </CardHeader>
            <CardContent className="text-white/70">
              Export daily cash vs transaction totals and reconcile COD.
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle>Compliance</CardTitle>
            </CardHeader>
            <CardContent className="text-white/70">
              Audit logs, tag integrity, and fraud prevention controls.
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
