import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  Scan,
  Package,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ClipboardList,
  ArrowRight,
  MapPin,
  ShieldAlert,
  Search
} from 'lucide-react';
import {
  ROUTE_PATHS,
  SHIPMENT_STATUS,
  MOCK_TOWNSHIPS,
  Shipment
} from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import StatusBadge from '@/components/StatusBadge';
import QRScanner from '@/components/QRScanner';

// Mock data for shipments available for dispatch
const MOCK_AVAILABLE_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-001',
    awb: 'AWB-2026-1001',
    tamperTagId: 'TT-99001',
    status: 'WAREHOUSE_RECEIVED_VERIFIED',
    pieces: 1,
    type: 'box',
    condition: 'OK',
    cod: { required: true, amount: 150 },
    destinationTownship: 'Downtown',
    photos: [],
    riderId: 'rdr_1',
    createdAt: '2026-02-11T10:00:00Z',
    labelPrintedCount: 1,
  },
  {
    id: 'SHP-002',
    awb: 'AWB-2026-1002',
    tamperTagId: 'TT-99002',
    status: 'WAREHOUSE_RECEIVED_VERIFIED',
    pieces: 2,
    type: 'bag',
    condition: 'OK',
    cod: { required: false },
    destinationTownship: 'North District',
    photos: [],
    riderId: 'rdr_2',
    createdAt: '2026-02-11T11:00:00Z',
    labelPrintedCount: 1,
  },
  {
    id: 'SHP-003',
    awb: 'AWB-2026-1003',
    tamperTagId: 'TT-99003',
    status: 'WAREHOUSE_RECEIVED_VERIFIED',
    pieces: 1,
    type: 'document',
    condition: 'OK',
    cod: { required: false },
    destinationTownship: 'Downtown',
    photos: [],
    riderId: 'rdr_1',
    createdAt: '2026-02-11T12:00:00Z',
    labelPrintedCount: 1,
  }
];

const DispatchManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, legacyUser } = useAuth();
  const [step, setStep] = useState<'INITIAL' | 'LOCATION' | 'MANIFEST' | 'SCANNING' | 'RECONCILE'>('INITIAL');
  const [destination, setDestination] = useState<string>('');
  const [scannedParcels, setScannedParcels] = useState<Shipment[]>([]);
  const [isGateVerified, setIsGateVerified] = useState(false);
  const [manifestId, setManifestId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAvailable = useMemo(() => {
    if (!destination) return [];
    return MOCK_AVAILABLE_SHIPMENTS.filter(s => 
      s.destinationTownship === destination && 
      !scannedParcels.find(p => p.id === s.id)
    );
  }, [destination, scannedParcels]);

  const handleStartDispatch = () => {
    setStep('LOCATION');
  };

  const handleLocationScan = (code: string) => {
    if (code.includes('WH_DISPATCH')) {
      setIsGateVerified(true);
      setStep('MANIFEST');
      toast.success('Dispatch Location Verified');
    } else {
      toast.error('Invalid Location QR. Please scan the WH_DISPATCH poster.');
    }
  };

  const handleCreateManifest = () => {
    if (!destination) {
      toast.error('Please select a destination substation');
      return;
    }
    const newId = `MAN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    setManifestId(newId);
    setStep('SCANNING');
    toast.success(`Manifest ${newId} Created`);
  };

  const handleParcelScan = (code: string) => {
    const parcel = MOCK_AVAILABLE_SHIPMENTS.find(s => s.awb === code || s.tamperTagId === code);
    
    if (!parcel) {
      toast.error('Parcel not found in system');
      return;
    }

    if (parcel.destinationTownship !== destination) {
      toast.error(`Warning: Destination mismatch. This parcel is for ${parcel.destinationTownship}`);
      return;
    }

    if (scannedParcels.find(p => p.id === parcel.id)) {
      toast.warning('Parcel already scanned');
      return;
    }

    setScannedParcels(prev => [...prev, parcel]);
    toast.success(`Parcel ${parcel.awb} Added to Manifest`);
  };

  const handleCloseManifest = () => {
    const expectedCount = MOCK_AVAILABLE_SHIPMENTS.filter(s => s.destinationTownship === destination).length;
    if (scannedParcels.length < expectedCount) {
      setStep('RECONCILE');
    } else {
      completeDispatch();
    }
  };

  const completeDispatch = () => {
    toast.success('Dispatch Manifest Closed and Dispatched Successfully');
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Warehouse Dispatch</h1>
            <p className="text-muted-foreground">Create manifests and verify shipments for outbound transport.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              <ShieldAlert className="mr-1 h-3 w-3" />
              Dual Control Enforced
            </Badge>
          </div>
        </div>

        {/* Step 0: Initial State */}
        {step === 'INITIAL' && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                <Truck className="h-12 w-12" />
              </div>
              <CardTitle className="mb-2">Ready to Dispatch?</CardTitle>
              <CardDescription className="max-w-xs mb-6">
                Scan the Dispatch Bay Location QR to begin creating a new transport manifest.
              </CardDescription>
              <Button size="lg" onClick={handleStartDispatch} className="btn-modern">
                Begin Dispatch Flow
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Location Verification */}
        {step === 'LOCATION' && (
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Step 1: Verify Location
              </CardTitle>
              <CardDescription>Scan the QR code at WH_DISPATCH bay.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="qr-scanner-frame mx-auto aspect-square max-w-[300px]">
                <QRScanner onScan={handleLocationScan} expectedType="LOCATION" />
              </div>
              <Button variant="outline" className="w-full" onClick={() => setStep('INITIAL')}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Create Manifest */}
        {step === 'MANIFEST' && (
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Step 2: Destination & Driver</CardTitle>
              <CardDescription>Select where these parcels are going.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Destination Substation</label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {MOCK_TOWNSHIPS.map(town => (
                    <Button
                      key={town}
                      variant={destination === town ? 'default' : 'outline'}
                      className="h-auto flex-col py-4 text-xs"
                      onClick={() => setDestination(town)}
                    >
                      <MapPin className="mb-1 h-4 w-4" />
                      {town}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Available for {destination || '...'}</p>
                      <p className="text-xs text-muted-foreground">
                        {filteredAvailable.length} parcels waiting
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full btn-modern"
                  disabled={!destination} 
                  onClick={handleCreateManifest}
                >
                  Create Dispatch Manifest
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Scanning Parcels */}
        {step === 'SCANNING' && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card className="card-modern">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Scanning Manifest: {manifestId}</CardTitle>
                      <CardDescription>Scan AWB or Tamper Tag for {destination}</CardDescription>
                    </div>
                    <Badge className="bg-primary">{scannedParcels.length} Scanned</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="qr-scanner-frame aspect-video">
                    <QRScanner onScan={handleParcelScan} expectedType="AWB" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Manual Entry (AWB/TT)" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button onClick={() => handleParcelScan(searchQuery)}>Add</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-modern">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-primary" />
                    Scanned in this Manifest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {scannedParcels.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-8">No parcels scanned yet.</p>
                      ) : (
                        scannedParcels.map(p => (
                          <div key={p.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono font-medium">{p.awb}</span>
                            </div>
                            <Badge variant="outline">{p.tamperTagId}</Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="card-modern sticky top-8">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Manifest Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Expected</span>
                      <span className="font-bold">{filteredAvailable.length + scannedParcels.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Scanned</span>
                      <span className="font-bold text-primary">{scannedParcels.length}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${(scannedParcels.length / (filteredAvailable.length + scannedParcels.length)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      variant="default"
                      disabled={scannedParcels.length === 0}
                      onClick={handleCloseManifest}
                    >
                      Close Manifest
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setStep('MANIFEST')}
                    >
                      Cancel & Discard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 4: Reconciliation (Exceptions) */}
        {step === 'RECONCILE' && (
          <Card className="card-modern border-destructive/20">
            <CardHeader className="bg-destructive/5">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <CardTitle>Manifest Reconciliation Mismatch</CardTitle>
              </div>
              <CardDescription>
                {filteredAvailable.length} parcels expected for this destination were not scanned.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="mb-3 text-sm font-medium">Missing Parcels List:</p>
                <div className="space-y-2">
                  {filteredAvailable.map(p => (
                    <div key={p.id} className="flex items-center justify-between rounded border border-destructive/20 bg-destructive/5 p-2 text-xs">
                      <span className="font-mono">{p.awb}</span>
                      <span className="text-muted-foreground">{p.tamperTagId}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  variant="destructive" 
                  onClick={() => setStep('SCANNING')}
                >
                  Continue Scanning
                </Button>
                <Button 
                  variant="outline" 
                  className="border-destructive/30 text-destructive"
                  onClick={completeDispatch}
                >
                  Override & Dispatch Anyway (Incident Logged)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DispatchManagement;