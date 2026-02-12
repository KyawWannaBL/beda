import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Package, 
  QrCode, 
  AlertCircle,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTamperTags } from '@/hooks/useTamperTags';
import { 
  ROUTE_PATHS, 
  MOCK_TOWNSHIPS, 
  SHIPMENT_STATUS 
} from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import QRScanner from '@/components/QRScanner';
import PhotoCapture from '@/components/PhotoCapture';

const STEPS = [
  { id: 1, title: 'Attach & Scan', description: 'Attach Tamper Tag and scan QR' },
  { id: 2, title: 'Photos', description: 'Take 3 mandatory photos' },
  { id: 3, title: 'Details', description: 'Record parcel information' },
  { id: 4, title: 'Confirm', description: 'Finalize pickup' },
];

export default function PickupFlow() {
  const navigate = useNavigate();
  const { user, legacyUser } = useAuth();
  const { validateTagForPickup, useTag } = useTamperTags();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [ttId, setTtId] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [details, setDetails] = useState({
    pieces: 1,
    type: 'box' as 'box' | 'bag' | 'document' | 'other',
    condition: 'OK' as 'OK' | 'Damaged',
    codEnabled: false,
    codAmount: 0,
    township: '',
  });

  const handleTagScan = (code: string) => {
    const validation = validateTagForPickup(code, legacyUser);
    if (validation.valid) {
      setTtId(code);
      toast.success(`Tag ${code} valid and assigned.`);
      setCurrentStep(2);
    } else {
      toast.error(validation.error || 'Invalid Tag');
    }
  };

  const handlePhotoCapture = (photo: string) => {
    if (photos.length < 3) {
      setPhotos(prev => [...prev, photo]);
      toast.success(`Photo ${photos.length + 1}/3 captured`);
    }
  };

  const handleFinalConfirm = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      useTag(ttId);
      toast.success('Pickup confirmed successfully!');
      navigate(ROUTE_PATHS.DASHBOARD);
    } catch (error) {
      toast.error('Failed to confirm pickup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-2">
      {STEPS.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep >= step.id ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'}`}>
              {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : step.id}
            </div>
            <span className={`text-[10px] mt-2 font-medium uppercase tracking-wider ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`}>
              {step.title}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`flex-1 h-[2px] mb-6 transition-colors ${currentStep > step.id ? 'bg-primary' : 'bg-muted'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-md mx-auto py-6 px-4 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Pickup</h1>
        <p className="text-muted-foreground">Follow the SOP to record a parcel pickup</p>
      </header>

      {renderStepIndicator()}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 1 && (
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  Step 1: Scan Tag
                </CardTitle>
                <CardDescription>
                  Attach a physical Tamper Tag to the parcel, then scan the QR code.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="qr-scanner-frame aspect-square">
                  <QRScanner 
                    onScan={handleTagScan} 
                    expectedType="TT"
                  />
                </div>
                {ttId && (
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <span className="text-sm font-medium">Scanned Tag:</span>
                    <code className="text-primary font-bold">{ttId}</code>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Step 2: Take Photos ({photos.length}/3)
                </CardTitle>
                <CardDescription>
                  Mandatory: Top view, Side view, and Close-up of Tamper Tag.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PhotoCapture
                  onCapture={handlePhotoCapture}
                  watermarkData={{
                    ttId: ttId,
                    userId: legacyUser?.id || 'unknown',
                    timestamp: new Date().toISOString(),
                    gps: "16.8409° N, 96.1735° E"
                  }}
                  required={photos.length < 3}
                />
                
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((idx) => (
                    <div 
                      key={idx} 
                      className="aspect-square rounded-lg bg-muted border-2 border-dashed flex items-center justify-center overflow-hidden relative"
                    >
                      {photos[idx] ? (
                        <img src={photos[idx]} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-muted-foreground/50" />
                      )}
                      {photos[idx] && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(1)}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button 
                    className="flex-1" 
                    disabled={photos.length < 3} 
                    onClick={() => setCurrentStep(3)}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Step 3: Parcel Details
                </CardTitle>
                <CardDescription>
                  Enter minimal required details for registration queue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pieces</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      value={details.pieces} 
                      onChange={(e) => setDetails({...details, pieces: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select 
                      value={details.type} 
                      onValueChange={(v: any) => setDetails({...details, type: v})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="bag">Bag</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Condition</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant={details.condition === 'OK' ? 'default' : 'outline'} 
                      className="flex-1"
                      onClick={() => setDetails({...details, condition: 'OK'})}
                    >
                      OK
                    </Button>
                    <Button 
                      variant={details.condition === 'Damaged' ? 'destructive' : 'outline'} 
                      className="flex-1"
                      onClick={() => setDetails({...details, condition: 'Damaged'})}
                    >
                      Damaged
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cash on Delivery (COD)</Label>
                    <p className="text-xs text-muted-foreground">Is payment required on delivery?</p>
                  </div>
                  <Switch 
                    checked={details.codEnabled} 
                    onCheckedChange={(checked) => setDetails({...details, codEnabled: checked})} 
                  />
                </div>

                {details.codEnabled && (
                  <div className="space-y-2">
                    <Label>COD Amount</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        className="pl-12"
                        value={details.codAmount || ''}
                        onChange={(e) => setDetails({...details, codAmount: parseFloat(e.target.value) || 0})}
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Destination Township
                  </Label>
                  <Select 
                    value={details.township} 
                    onValueChange={(v) => setDetails({...details, township: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Township" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_TOWNSHIPS.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button 
                    className="flex-1" 
                    disabled={!details.township}
                    onClick={() => setCurrentStep(4)}
                  >
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <Card className="card-modern border-primary/30">
                <CardHeader>
                  <CardTitle>Pickup Summary</CardTitle>
                  <CardDescription>Confirm all details are correct according to SOP</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="text-muted-foreground">Tamper Tag</span>
                    <span className="font-mono font-bold text-right">{ttId}</span>
                    
                    <span className="text-muted-foreground">Pieces</span>
                    <span className="font-medium text-right">{details.pieces}x {details.type}</span>
                    
                    <span className="text-muted-foreground">Condition</span>
                    <span className={`font-medium text-right ${details.condition === 'Damaged' ? 'text-destructive' : 'text-success'}`}>
                      {details.condition}
                    </span>
                    
                    <span className="text-muted-foreground">COD</span>
                    <span className="font-medium text-right">
                      {details.codEnabled ? `$${details.codAmount.toFixed(2)}` : 'No'}
                    </span>

                    <span className="text-muted-foreground">Destination</span>
                    <span className="font-medium text-right">{details.township}</span>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {photos.map((p, i) => (
                      <img 
                        key={i} 
                        src={p} 
                        className="h-20 w-20 rounded-md object-cover border"
                        alt="evidence"
                      />
                    ))}
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-lg flex gap-3 border border-yellow-200 dark:border-yellow-900">
                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">
                      By confirming, you certify that the Tamper Tag is securely attached and photos clearly show the tag and parcel condition.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(3)}>
                  Edit Details
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleFinalConfirm}
                  disabled={loading}
                >
                  {loading ? 'Confirming...' : 'Confirm Pickup'}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border flex justify-around items-center z-40">
        <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2 text-xs" onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}>
          <Package className="w-5 h-5" />
          Home
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2 text-xs text-primary">
          <QrCode className="w-5 h-5" />
          Pickup
        </Button>
        <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2 text-xs" onClick={() => navigate(ROUTE_PATHS.RIDER.TAGS)}>
          <AlertCircle className="w-5 h-5" />
          Batch
        </Button>
      </footer>
    </div>
  );
}
