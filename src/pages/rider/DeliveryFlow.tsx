import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  CheckCircle2, 
  XCircle, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Smartphone, 
  Camera, 
  PenTool, 
  ChevronLeft, 
  AlertTriangle,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SHIPMENT_STATUS, 
  Shipment, 
  PODRecord, 
  NDR_REASONS, 
  ROUTE_PATHS 
} from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import QRScanner from '@/components/QRScanner';
import PhotoCapture from '@/components/PhotoCapture';
import SignaturePad from '@/components/SignaturePad';

const DeliveryFlow: React.FC = () => {
  const navigate = useNavigate();
  const { user, legacyUser } = useAuth();
  const [step, setStep] = useState<'scan' | 'details' | 'pod' | 'ndr'>('scan');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [podData, setPodData] = useState<Partial<PODRecord>>({
    relationship: 'Self',
  });
  const [ndrData, setNdrData] = useState({
    reason: '',
    notes: '',
    photo: '',
  });

  // Mock fetching shipment after scan
  const handleScan = (code: string) => {
    // In production, fetch from API
    const mockShipment: Shipment = {
      id: 'SHP-' + code,
      awb: code,
      tamperTagId: 'TT-100234',
      status: SHIPMENT_STATUS.OUT_FOR_DELIVERY as any,
      pieces: 1,
      type: 'box',
      condition: 'OK',
      cod: {
        required: true,
        amount: 150.50,
      },
      receiver: {
        name: 'John Doe',
        phone: '+1 234 567 890',
        address: '123 Logistics Lane, Warehouse District',
        township: 'Downtown',
      },
      photos: [],
      riderId: legacyUser?.id || '',
      createdAt: new Date().toISOString(),
      labelPrintedCount: 1,
    };

    setShipment(mockShipment);
    setStep('details');
    toast.success('Shipment Identified');
  };

  const handleSendOTP = () => {
    setOtpSent(true);
    toast.success('OTP sent to recipient phone');
  };

  const handleVerifyOTP = () => {
    if (otpValue === '1234') {
      setOtpVerified(true);
      toast.success('OTP Verified');
    } else {
      toast.error('Invalid OTP. Use 1234 for demo.');
    }
  };

  const handleDeliver = () => {
    if (!podData.recipientName || !podData.signature) {
      toast.error('Recipient name and signature are required');
      return;
    }
    if (shipment?.cod.required && !otpVerified) {
      toast.error('OTP verification required for COD shipments');
      return;
    }

    toast.success('Delivery Completed Successfully');
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  const handleNDR = () => {
    if (!ndrData.reason) {
      toast.error('Please select a reason for failed delivery');
      return;
    }
    toast.warning('NDR recorded. Shipment will be returned to hub.');
    navigate(ROUTE_PATHS.DASHBOARD);
  };

  if (step === 'scan') {
    return (
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Last-Mile Delivery</h1>
          <p className="text-muted-foreground">Scan AWB QR code at the doorstep</p>
        </div>
        <QRScanner onScan={handleScan} expectedType="AWB" />
        <Button 
          variant="ghost" 
          className="w-full" 
          onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <AnimatePresence mode="wait">
        {step === 'details' && shipment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setStep('scan')}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Rescan
              </Button>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {shipment.awb}
              </Badge>
            </div>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Recipient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Name</p>
                    <p className="font-medium">{shipment.receiver?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Phone</p>
                    <p className="font-medium">{shipment.receiver?.phone}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Address</p>
                  <p className="font-medium flex items-start gap-1">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    {shipment.receiver?.address}
                  </p>
                </div>
                {shipment.cod.required && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900/50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-bold">
                        <ShieldCheck className="h-5 w-5" />
                        COD REQUIRED
                      </div>
                      <span className="text-xl font-bold text-orange-700 dark:text-orange-400">
                        ${shipment.cod.amount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-3">
                <Button 
                  className="flex-1 btn-modern bg-destructive hover:bg-destructive/90" 
                  onClick={() => setStep('ndr')}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Failed
                </Button>
                <Button 
                  className="flex-1 btn-modern"
                  onClick={() => setStep('pod')}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Deliver
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 'pod' && shipment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Capture Proof of Delivery</h2>
              <Button variant="ghost" size="sm" onClick={() => setStep('details')}>
                Back
              </Button>
            </div>

            {shipment.cod.required && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Recipient Verification</p>
                      <p className="text-xs text-muted-foreground">OTP required for COD release</p>
                    </div>
                    {!otpVerified && (
                      <Button size="sm" onClick={handleSendOTP} disabled={otpSent}>
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </Button>
                    )}
                  </div>

                  {otpSent && !otpVerified && (
                    <div className="flex gap-2 animate-in slide-in-from-top-2">
                      <Input 
                        placeholder="Enter 4-digit OTP"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        maxLength={4}
                        className="font-mono text-center tracking-widest"
                      />
                      <Button onClick={handleVerifyOTP}>Verify</Button>
                    </div>
                  )}

                  {otpVerified && (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle2 className="h-5 w-5" /> OTP Verified
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="card-modern">
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Recipient Name</Label>
                    <Input 
                      placeholder="Who is receiving this?"
                      value={podData.recipientName || ''}
                      onChange={(e) => setPodData({ ...podData, recipientName: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Relationship</Label>
                    <Select 
                      value={podData.relationship}
                      onValueChange={(val: any) => setPodData({ ...podData, relationship: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Self">Self</SelectItem>
                        <SelectItem value="Family">Family Member</SelectItem>
                        <SelectItem value="Neighbor">Neighbor</SelectItem>
                        <SelectItem value="Guard">Security/Guard</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <PenTool className="h-4 w-4" /> Recipient Signature
                  </Label>
                  <SignaturePad 
                    onSignature={(sig) => setPodData({ ...podData, signature: sig })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Camera className="h-4 w-4" /> Delivery Photo (Optional)
                  </Label>
                  <PhotoCapture 
                    onCapture={(photo) => setPodData({ ...podData, photo })}
                    watermarkData={{
                      ttId: shipment.tamperTagId,
                      userId: legacyUser?.id || 'unknown',
                      timestamp: new Date().toISOString(),
                      gps: '16.8409, 96.1735' // Mock GPS
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full btn-modern py-6 text-lg"
                  onClick={handleDeliver}
                  disabled={shipment.cod.required && !otpVerified}
                >
                  Complete Delivery
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === 'ndr' && shipment && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-destructive">Delivery Failed (NDR)</h2>
              <Button variant="ghost" size="sm" onClick={() => setStep('details')}>
                Cancel
              </Button>
            </div>

            <Card className="border-destructive/20">
              <CardContent className="pt-6 space-y-6">
                <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/10 flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                  <p className="text-sm text-destructive-foreground">
                    Marking this shipment as failed will trigger a return process or rescheduling.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Reason for Failure</Label>
                    <Select 
                      value={ndrData.reason}
                      onValueChange={(val) => setNdrData({ ...ndrData, reason: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select failure reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {NDR_REASONS.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Notes / Observations</Label>
                    <Textarea 
                      placeholder="Additional details..."
                      value={ndrData.notes}
                      onChange={(e) => setNdrData({ ...ndrData, notes: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Camera className="h-4 w-4" /> Evidence Photo (Required)
                    </Label>
                    <PhotoCapture 
                      onCapture={(photo) => setNdrData({ ...ndrData, photo })}
                      required
                      watermarkData={{
                        ttId: shipment.tamperTagId,
                        userId: legacyUser?.id || 'unknown',
                        timestamp: new Date().toISOString(),
                        gps: '16.8409, 96.1735'
                      }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full py-6 text-lg"
                  onClick={handleNDR}
                  disabled={!ndrData.reason || !ndrData.photo}
                >
                  Submit NDR Report
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeliveryFlow;