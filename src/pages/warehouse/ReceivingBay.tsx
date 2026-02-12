import React, { useState } from 'react';
import { 
  Box, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  MapPin, 
  Package, 
  Camera, 
  Info,
  Check,
  X,
  ChevronRight
} from 'lucide-react';
import { SHIPMENT_STATUS, Shipment, ShipmentStatus } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import QRScanner from '@/components/QRScanner';
import StatusBadge from '@/components/StatusBadge';

const ReceivingBay: React.FC = () => {
  const { user, legacyUser } = useAuth();
  const [isLocationVerified, setIsLocationVerified] = useState(false);
  const [scanningMode, setScanningMode] = useState<'location' | 'parcel' | null>(null);
  const [currentShipment, setCurrentShipment] = useState<Shipment | null>(null);
  const [inspectionData, setInspectionData] = useState({
    piecesMatch: true,
    conditionMatch: true,
    notes: '',
  });

  // Mock data for demo purposes
  const mockShipments: Record<string, Shipment> = {
    'AWB123456': {
      id: 'shp_1',
      awb: 'AWB123456',
      tamperTagId: 'TT-000451',
      status: 'LABEL_APPLIED_VERIFIED',
      pieces: 2,
      type: 'box',
      condition: 'OK',
      cod: { required: true, amount: 1500 },
      destinationTownship: 'Downtown',
      photos: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=400'
      ],
      riderId: 'rdr_001',
      createdAt: '2026-02-11T10:00:00Z',
      labelPrintedCount: 1,
    }
  };

  const handleLocationScan = (code: string) => {
    if (code === 'WH_RECEIVING_01') {
      setIsLocationVerified(true);
      setScanningMode(null);
      toast.success('Location verified: Receiving Bay 01');
    } else {
      toast.error('Invalid location QR for this operation');
    }
  };

  const handleParcelScan = (code: string) => {
    const shipment = mockShipments[code] || Object.values(mockShipments).find(s => s.tamperTagId === code);
    
    if (!shipment) {
      toast.error('Shipment not found in system');
      return;
    }

    if (shipment.status !== 'LABEL_APPLIED_VERIFIED' && shipment.status !== 'ARRIVED_WAREHOUSE_GATE') {
      toast.error(`Invalid Status: Label must be verified before receiving (Current: ${shipment.status})`);
      return;
    }

    setCurrentShipment(shipment);
    setScanningMode(null);
    toast.success(`Shipment ${shipment.awb || shipment.tamperTagId} loaded for inspection`);
  };

  const handleConfirmReceived = () => {
    if (!currentShipment) return;

    toast.success('Shipment successfully received and verified');
    setCurrentShipment(null);
    setInspectionData({ piecesMatch: true, conditionMatch: true, notes: '' });
  };

  if (!isLocationVerified) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card className="card-modern overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Step 1: Verify Location
            </CardTitle>
            <CardDescription>
              Scan the Warehouse Receiving Bay QR to begin intake operations.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-10">
            {scanningMode === 'location' ? (
              <div className="w-full space-y-4">
                <QRScanner onScan={handleLocationScan} expectedType="LOCATION" />
                <Button variant="ghost" className="w-full" onClick={() => setScanningMode(null)}>
                  Cancel Scan
                </Button>
              </div>
            ) : (
              <Button 
                size="lg" 
                className="h-32 w-32 rounded-full btn-modern flex flex-col gap-2"
                onClick={() => setScanningMode('location')}
              >
                <QrCode className="w-10 h-10" />
                <span>Scan QR</span>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-5xl">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Warehouse Receiving</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Verified: Receiving Bay 01
            </Badge>
            <span className="text-xs">| Staff: {legacyUser?.name}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="btn-modern"
          onClick={() => setScanningMode('parcel')}
          disabled={!!scanningMode}
        >
          <QrCode className="w-4 h-4 mr-2" />
          Scan Next Parcel
        </Button>
      </header>

      {scanningMode === 'parcel' && (
        <Card className="card-modern border-primary/50 bg-primary/5">
          <CardContent className="p-6">
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-center font-medium">Scan AWB or Tamper Tag</h3>
              <QRScanner onScan={handleParcelScan} expectedType="AWB" />
              <Button variant="ghost" className="w-full" onClick={() => setScanningMode(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentShipment ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inspection Controls */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-modern">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Shipment Verification</CardTitle>
                  <CardDescription>Compare physical parcel with original pickup data</CardDescription>
                </div>
                <StatusBadge status={currentShipment.status} />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">AWB Number</p>
                    <p className="font-mono font-medium">{currentShipment.awb || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Tamper Tag</p>
                    <p className="font-mono font-medium">{currentShipment.tamperTagId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Pieces</p>
                    <p className="font-medium">{currentShipment.pieces} Units</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Type</p>
                    <Badge variant="secondary" className="capitalize">{currentShipment.type}</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Pickup Evidence (Photos)
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {currentShipment.photos.map((url, idx) => (
                      <div key={idx} className="aspect-square rounded-md overflow-hidden border bg-muted">
                        <img src={url} alt={`Pickup ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    * Ensure Tamper Tag is intact and matching the photo above.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Inspection Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <p className="font-medium">Pieces Count Verified</p>
                    <p className="text-sm text-muted-foreground">Physical count matches system record ({currentShipment.pieces})</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={inspectionData.piecesMatch ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInspectionData(prev => ({ ...prev, piecesMatch: true }))}
                    >
                      <Check className="w-4 h-4 mr-1" /> Yes
                    </Button>
                    <Button 
                      variant={!inspectionData.piecesMatch ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setInspectionData(prev => ({ ...prev, piecesMatch: false }))}
                    >
                      <X className="w-4 h-4 mr-1" /> No
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <p className="font-medium">Condition Assessment</p>
                    <p className="text-sm text-muted-foreground">No new damage found compared to pickup</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={inspectionData.conditionMatch ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInspectionData(prev => ({ ...prev, conditionMatch: true }))}
                    >
                      <Check className="w-4 h-4 mr-1" /> OK
                    </Button>
                    <Button 
                      variant={!inspectionData.conditionMatch ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setInspectionData(prev => ({ ...prev, conditionMatch: false }))}
                    >
                      <AlertCircle className="w-4 h-4 mr-1" /> Damage
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Internal Notes / Exceptions</Label>
                  <Input 
                    id="notes" 
                    placeholder="Optional: add receiving details..." 
                    value={inspectionData.notes}
                    onChange={(e) => setInspectionData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setCurrentShipment(null)}>Cancel</Button>
                <Button 
                  className="btn-modern bg-primary" 
                  onClick={handleConfirmReceived}
                >
                  Confirm Received
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Context Sidebar */}
          <div className="space-y-6">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="text-sm">Recipient Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Destination</p>
                  <p className="font-medium">{currentShipment.destinationTownship}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">COD Status</p>
                  <Badge variant={currentShipment.cod.required ? "destructive" : "secondary"}>
                    {currentShipment.cod.required ? `Collect: $${currentShipment.cod.amount}` : 'No COD'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern border-orange-200 bg-orange-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
                  <Info className="w-4 h-4" />
                  Security Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-orange-800 space-y-2">
                <p>• Label must be <strong>Activated</strong> before receiving.</p>
                <p>• Tamper Tag must be physically present and untorn.</p>
                <p>• Any damage found must be photographed before confirming.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border-2 border-dashed rounded-xl">
          <Package className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <h2 className="text-xl font-medium text-muted-foreground">Ready for next parcel</h2>
          <p className="text-sm text-muted-foreground mt-2">Scan an AWB QR or Tamper Tag to begin inspection</p>
          <Button 
            className="mt-6 btn-modern" 
            onClick={() => setScanningMode('parcel')}
          >
            Start Scanning
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReceivingBay;