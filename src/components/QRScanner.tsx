import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Camera, CameraOff, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QRScannerProps {
  onScan: (code: string) => void;
  expectedType?: 'TT' | 'AWB' | 'LOCATION' | 'MANIFEST';
  disabled?: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, expectedType, disabled }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setError(null);
    setSuccess(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError('Camera access denied or not available.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleCapture = () => {
    // Simulation of a QR scan since browser-based decoding usually requires external libs like jsQR
    // In a real production app, we would use a library or a native bridge
    // For this simulation, we generate a valid ID based on expected type
    if (disabled) return;

    let simulatedCode = '';
    const rand = Math.floor(100000 + Math.random() * 900000);

    switch (expectedType) {
      case 'TT':
        simulatedCode = `TT-${rand}`;
        break;
      case 'AWB':
        simulatedCode = `AWB-${rand}`;
        break;
      case 'LOCATION':
        simulatedCode = `LOC_WH_GATE_${rand}`;
        break;
      case 'MANIFEST':
        simulatedCode = `MF-${rand}`;
        break;
      default:
        simulatedCode = `SCAN-${rand}`;
    }

    setSuccess(`Successfully scanned: ${simulatedCode}`);
    onScan(simulatedCode);
    
    setTimeout(() => {
      stopCamera();
    }, 1000);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="p-4 flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">
              {expectedType ? `${expectedType} Scanner` : 'QR Scanner'}
            </span>
          </div>
          {expectedType && (
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {expectedType}
            </Badge>
          )}
        </div>

        <div className="relative w-full aspect-square max-w-[300px] mx-auto overflow-hidden rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
          {isScanning ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-primary rounded-lg animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary -translate-x-1 -translate-y-1" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary translate-x-1 -translate-y-1" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary -translate-x-1 translate-y-1" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary translate-x-1 translate-y-1" />
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Button 
                  onClick={handleCapture}
                  className="rounded-full px-6 shadow-lg bg-primary hover:bg-primary/90"
                >
                  Simulate Scan
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground p-8 text-center">
              <CameraOff className="w-12 h-12 opacity-20" />
              <p className="text-xs">Camera is currently inactive</p>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={startCamera} 
                disabled={disabled}
                className="mt-2"
              >
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            </div>
          )}
        </div>

        <div className="w-full space-y-2">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {isScanning && (
          <div className="flex items-center gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1 text-xs" 
              onClick={stopCamera}
            >
              Stop
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1 text-xs" 
              onClick={() => { stopCamera(); startCamera(); }}
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Reset
            </Button>
          </div>
        )}

        {!isScanning && !error && !success && (
          <p className="text-[10px] text-muted-foreground text-center italic">
            Ensure the QR code is clear and within the frame.
          </p>
        )}
      </div>
    </Card>
  );
};

export default QRScanner;