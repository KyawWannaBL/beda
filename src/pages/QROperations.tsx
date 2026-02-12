// Simplified QR Operations page
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Scan, Package, CheckCircle } from 'lucide-react';

export default function QROperations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Operations</h1>
        <p className="text-muted-foreground">Scan and manage QR codes for shipments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Generate QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate QR codes for new shipments
            </p>
            <Button className="w-full">
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Scan QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Scan existing QR codes to update shipment status
            </p>
            <Button className="w-full" variant="outline">
              <Scan className="mr-2 h-4 w-4" />
              Start Scanning
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Recent QR Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-medium">EDS001 - Delivered</p>
                  <p className="text-sm text-muted-foreground">Scanned 5 minutes ago</p>
                </div>
              </div>
              <Badge variant="default">Completed</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Package className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="font-medium">EDS002 - In Transit</p>
                  <p className="text-sm text-muted-foreground">Scanned 15 minutes ago</p>
                </div>
              </div>
              <Badge variant="secondary">In Progress</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}