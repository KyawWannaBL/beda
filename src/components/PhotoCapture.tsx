import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Check, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PhotoCaptureProps {
  onCapture: (photo: string) => void;
  watermarkData: {
    ttId: string;
    userId: string;
    timestamp: string;
    gps: string;
  };
  required?: boolean;
}

export default function PhotoCapture({ onCapture, watermarkData, required = false }: PhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
        setError(null);
      }
    } catch (err) {
      setError('Could not access camera. Please ensure permissions are granted.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  }, []);

  const applyWatermark = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const padding = 20;
    const fontSize = Math.max(14, width / 40);
    ctx.font = `${fontSize}px JetBrains Mono, monospace`;
    
    const lines = [
      `TT ID: ${watermarkData.ttId}`,
      `User: ${watermarkData.userId}`,
      `Time: ${watermarkData.timestamp}`,
      `GPS: ${watermarkData.gps}`,
    ];

    const boxWidth = 300;
    const boxHeight = lines.length * (fontSize + 8) + padding;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(width - boxWidth - padding, height - boxHeight - padding, boxWidth, boxHeight);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    
    lines.forEach((line, index) => {
      ctx.fillText(
        line,
        width - boxWidth - padding + 10,
        height - boxHeight - padding + padding + index * (fontSize + 8)
      );
    });
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        applyWatermark(context, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div className="w-full space-y-4">
      {!isCameraOpen && !capturedImage ? (
        <Button
          variant="outline"
          className="w-full h-32 border-dashed flex flex-col gap-2"
          onClick={startCamera}
        >
          <Camera className="w-8 h-8 text-muted-foreground" />
          <span>Take Photo {required && <span className="text-destructive">*</span>}</span>
        </Button>
      ) : null}

      {error && (
        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {isCameraOpen && (
        <Card className="relative overflow-hidden aspect-video bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button size="icon" className="rounded-full w-12 h-12" onClick={capturePhoto}>
              <Camera className="w-6 h-6" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full w-12 h-12" onClick={stopCamera}>
              <X className="w-6 h-6" />
            </Button>
          </div>
        </Card>
      )}

      {capturedImage && (
        <div className="space-y-4">
          <Card className="relative overflow-hidden aspect-video bg-muted">
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2">
              <div className="bg-primary/90 text-primary-foreground px-2 py-1 rounded text-[10px] font-mono">
                WATERMARKED
              </div>
            </div>
          </Card>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleRetake}>
              <RefreshCw className="w-4 h-4" />
              Retake
            </Button>
            <Button className="flex-1 gap-2" onClick={handleConfirm}>
              <Check className="w-4 h-4" />
              Use Photo
            </Button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
