// Simplified Reports page
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Package, Users } from 'lucide-react';

export default function Reports() {
  const kpis = [
    { label: 'Total Shipments', value: '1,250', icon: Package, change: '+12%' },
    { label: 'Delivered Today', value: '45', icon: TrendingUp, change: '+8%' },
    { label: 'Active Users', value: '156', icon: Users, change: '+5%' },
    { label: 'Revenue Growth', value: '15.2%', icon: BarChart3, change: '+3%' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Analytics and performance insights</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{kpi.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>On-time Delivery</span>
                <span className="font-medium">94.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average Delivery Time</span>
                <span className="font-medium">2.3 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Customer Satisfaction</span>
                <span className="font-medium">4.6/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Express Delivery</span>
                <span className="font-medium">$75,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Standard Delivery</span>
                <span className="font-medium">$35,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span>COD Services</span>
                <span className="font-medium">$15,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}