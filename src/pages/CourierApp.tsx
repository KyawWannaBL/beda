import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, MapPin, Clock, QrCode, Camera } from 'lucide-react';

export default function CourierApp() {
  const mockDeliveries = [
    {
      awb: 'DEL123456789',
      customerName: 'John Smith',
      address: '123 Main Street, Apartment 4B, Downtown',
      phone: '+1-555-0123',
      codAmount: 250,
      priority: 'high',
      timeSlot: '10:00 AM - 12:00 PM'
    },
    {
      awb: 'DEL987654321',
      customerName: 'Sarah Johnson',
      address: '456 Oak Avenue, Suite 200, Business District',
      phone: '+1-555-0456',
      codAmount: 0,
      priority: 'normal',
      timeSlot: '2:00 PM - 4:00 PM'
    },
    {
      awb: 'DEL456789123',
      customerName: 'Mike Wilson',
      address: '789 Pine Road, House #15, Suburbs',
      phone: '+1-555-0789',
      codAmount: 150,
      priority: 'normal',
      timeSlot: '4:00 PM - 6:00 PM'
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Truck className="h-6 w-6" />
          Courier Delivery App
        </h1>
        <p className="text-muted-foreground">Today's delivery assignments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Total Deliveries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Truck className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">1</p>
            <p className="text-sm text-muted-foreground">Exceptions</p>
          </CardContent>
        </Card>
      </div>

      {/* Delivery List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pending Deliveries</h2>
        {mockDeliveries.map((delivery, index) => (
          <Card key={delivery.awb}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{delivery.customerName}</CardTitle>
                  <p className="text-sm text-muted-foreground font-mono">{delivery.awb}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={delivery.priority === 'high' ? 'destructive' : 'secondary'}>
                    {delivery.priority}
                  </Badge>
                  {delivery.codAmount > 0 && (
                    <Badge variant="outline">COD ₹{delivery.codAmount}</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <p className="text-sm">{delivery.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{delivery.timeSlot}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan QR
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture POD
                </Button>
                <Button size="sm" variant="outline">
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  Navigate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-16">
            <div className="text-center">
              <QrCode className="h-6 w-6 mx-auto mb-1" />
              <p className="text-sm">Bulk Scan</p>
            </div>
          </Button>
          <Button variant="outline" className="h-16">
            <div className="text-center">
              <Package className="h-6 w-6 mx-auto mb-1" />
              <p className="text-sm">Report Exception</p>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}