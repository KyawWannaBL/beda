import React, { useEffect, useMemo, useState } from 'react';
import EnhancedDashboard from './EnhancedDashboard';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Package, Route, ShieldCheck } from 'lucide-react';

import { mockShipments } from '@/data/index';
import { Shipment, ROUTE_PATHS } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GOLD = 'text-[rgba(212,175,55,0.95)]';
const BRITIUM_BIG_PRIMARY =
  'w-full h-14 text-lg font-semibold shadow-lg bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-400 hover:opacity-95';

type Gps = { lat: number; lng: number; accuracyM: number };

function useLiveGps() {
  const [gps, setGps] = useState<Gps | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    const w = navigator.geolocation.watchPosition(
      (pos) => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracyM: pos.coords.accuracy }),
      () => setGps(null),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 12000 }
    );
    return () => navigator.geolocation.clearWatch(w);
  }, []);

  return gps;
}

function OSMMap({ gps }: { gps: Gps | null }) {
  const fallback = { lat: 16.8409, lng: 96.1735 }; // Yangon center
  const p = gps ?? { ...fallback, accuracyM: 0 };

  const delta = 0.02;
  const left = p.lng - delta;
  const right = p.lng + delta;
  const top = p.lat + delta;
  const bottom = p.lat - delta;

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    `${left},${bottom},${right},${top}`
  )}&layer=mapnik&marker=${encodeURIComponent(`${p.lat},${p.lng}`)}`;

  return (
    <div className="h-full w-full relative">
      <iframe title="map" className="h-full w-full" src={src} />
      <div className="absolute top-3 left-3">
        <Badge className="bg-black/60 text-white border border-white/10 backdrop-blur">
          <MapPin className="w-3 h-3 mr-1" />
          {p.lat.toFixed(5)}, {p.lng.toFixed(5)} {gps ? `(±${Math.round(p.accuracyM)}m)` : '(demo)'}
        </Badge>
      </div>
    </div>
  );
}

function LuxuryKpiStrip(props: { remaining: number; etdText: string; successRatePct: number }) {
  return (
    <div className="w-full rounded-xl border bg-black/60 backdrop-blur px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">
          <div className={`${GOLD} font-semibold`}>Remaining Parcels</div>
          <div className="text-lg font-bold">{props.remaining}</div>
        </div>
        <div className="text-sm">
          <div className={`${GOLD} font-semibold`}>ETD to Next Stop</div>
          <div className="text-lg font-bold">{props.etdText}</div>
        </div>
        <div className="text-sm text-right">
          <div className={`${GOLD} font-semibold`}>Shift Success Rate</div>
          <div className="text-lg font-bold">{Math.round(props.successRatePct)}%</div>
        </div>
      </div>
    </div>
  );
}

function guessStatusKind(status: any) {
  const s = String(status ?? '').toLowerCase();
  if (s.includes('deliver')) return 'delivered';
  if (s.includes('return')) return 'return';
  if (s.includes('reject') || s.includes('fail') || s.includes('ndr')) return 'reject';
  return 'other';
}

function RiderDashboard() {
  const navigate = useNavigate();
  const gps = useLiveGps();

  const [activeId, setActiveId] = useState<string | null>(null);

  const { remaining, delivered, failed, activeShipment } = useMemo(() => {
    const all = mockShipments as Shipment[];

    let deliveredCount = 0;
    let failedCount = 0;
    let remainingCount = 0;

    for (const sh of all) {
      const k = guessStatusKind((sh as any).status);
      if (k === 'delivered') deliveredCount += 1;
      else if (k === 'return' || k === 'reject') failedCount += 1;
      else remainingCount += 1;
    }

    const active = activeId ? all.find((s) => String((s as any).id ?? s.trackingNumber) === activeId) : null;
    return { remaining: remainingCount, delivered: deliveredCount, failed: failedCount, activeShipment: active };
  }, [activeId]);

  const successRatePct = useMemo(() => {
    const totalDone = delivered + failed;
    if (totalDone === 0) return 100;
    return (delivered / totalDone) * 100;
  }, [delivered, failed]);

  const etdText = useMemo(() => {
    // Simple estimate: 6 minutes per remaining item (cap)
    const mins = Math.min(45, Math.max(5, remaining * 6));
    return `${mins} min (est)`;
  }, [remaining]);

  const taskActive = Boolean(activeShipment);

  return (
    <div className="h-[100dvh] w-full flex flex-col gap-3 p-3">
      <LuxuryKpiStrip remaining={remaining} etdText={etdText} successRatePct={successRatePct} />

      {taskActive ? (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <div className="flex-[7] min-h-0 rounded-xl overflow-hidden border">
            <OSMMap gps={gps} />
          </div>

          <div className="flex-[3] min-h-0 rounded-xl overflow-hidden border bg-background">
            <Card className="h-full border-0">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-primary" />
                  Next Task
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Route className="w-4 h-4" />
                  Shipment: <span className="font-mono text-foreground">{(activeShipment as any).trackingNumber}</span>
                </div>

                <div className="text-sm">
                  <div className={`${GOLD} font-semibold`}>Customer</div>
                  <div className="font-medium">{(activeShipment as any).receiverName ?? '—'}</div>
                  <div className="text-xs text-muted-foreground">{(activeShipment as any).receiverCity ?? '—'}</div>
                </div>

                <div className="text-sm">
                  <div className={`${GOLD} font-semibold`}>Merchant</div>
                  <div className="font-medium">{(activeShipment as any).senderName ?? '—'}</div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Verified Logistics Protocol: signature binds GPS + network time
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    className={BRITIUM_BIG_PRIMARY}
                    onClick={() => {
                      const anyRoutes = ROUTE_PATHS as any;
                      const deliveryPath =
                        anyRoutes?.RIDER?.DELIVERY ||
                        anyRoutes?.RIDER?.DELIVERY_FLOW ||
                        '/delivery-flow';
                      navigate(deliveryPath);
                    }}
                  >
                    Start Delivery (Scan)
                  </Button>

                  <Button variant="outline" className="h-14" onClick={() => setActiveId(null)}>
                    End Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 rounded-xl border overflow-hidden bg-background">
          <div className="p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Management View</h2>
                <p className="text-sm text-muted-foreground">Select a task to enter Navigation Mode (70/30)</p>
              </div>
              <Button variant="outline" className="gap-2" onClick={() => navigate(ROUTE_PATHS.CREATE_SHIPMENT)}>
                <Package className="w-4 h-4" />
                New Shipment
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(mockShipments as Shipment[]).slice(0, 6).map((s) => {
                const id = String((s as any).id ?? (s as any).trackingNumber);
                return (
                  <Card key={id} className="border-primary/10">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Tracking</div>
                          <div className="font-mono font-bold text-primary">{(s as any).trackingNumber}</div>
                        </div>
                        <Badge variant="outline">{String((s as any).status)}</Badge>
                      </div>

                      <div className="text-sm">
                        <div className={`${GOLD} font-semibold`}>Customer</div>
                        <div className="font-medium">{(s as any).receiverName ?? '—'}</div>
                        <div className="text-xs text-muted-foreground">{(s as any).receiverCity ?? '—'}</div>
                      </div>

                      <Button className="h-12 w-full" onClick={() => setActiveId(id)}>
                        Enter Navigation Mode
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, legacyUser } = useAuth();
  const role = (legacyUser as any)?.role ?? (user as any)?.role ?? '';
  const isRider = String(role).toUpperCase().includes('RIDER');

  // Keep original dashboard for non-rider roles.
  return isRider ? <RiderDashboard /> : <EnhancedDashboard />;
}
