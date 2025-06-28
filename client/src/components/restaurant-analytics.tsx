import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Clock, 
  Star, 
  Download,
  Calendar
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topItems: Array<{
    name: string;
    orders: number;
    revenue: number;
  }>;
  ordersByHour: Array<{
    hour: number;
    orders: number;
  }>;
  paymentMethods: Record<string, number>;
  recentOrders: Array<{
    id: number;
    customerName: string;
    total: string;
    status: string;
    createdAt: string;
  }>;
}

interface RestaurantAnalyticsProps {
  restaurantId: number;
}

export function RestaurantAnalytics({ restaurantId }: RestaurantAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [isExporting, setIsExporting] = useState(false);

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics", restaurantId, timeRange],
    queryFn: async (): Promise<AnalyticsData> => {
      const response = await fetch(`/api/restaurants/${restaurantId}/analytics?range=${timeRange}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    }
  });

  // Fetch payment analytics
  const { data: paymentAnalytics } = useQuery({
    queryKey: ["/api/payments/analytics"],
    queryFn: async () => {
      const response = await fetch("/api/payments/analytics");
      if (!response.ok) throw new Error("Failed to fetch payment analytics");
      return response.json();
    }
  });

  // Fetch rewards analytics
  const { data: rewardsAnalytics } = useQuery({
    queryKey: ["/api/rewards/analytics"],
    queryFn: async () => {
      const response = await fetch("/api/rewards/analytics");
      if (!response.ok) throw new Error("Failed to fetch rewards analytics");
      return response.json();
    }
  });

  const exportReport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/export-report?range=${timeRange}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `restaurant-report-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBusyHours = () => {
    if (!analytics?.ordersByHour) return [];
    return analytics.ordersByHour
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 3)
      .map(h => `${h.hour}:00`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Restaurant Analytics</h2>
          <p className="text-gray-600">Performance metrics and insights</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportReport} disabled={isExporting} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analytics?.totalOrders || 0}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${analytics?.averageOrderValue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {paymentAnalytics?.successRate?.toFixed(1) || '0.0'}%
                </p>
              </div>
              <Star className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Top Selling Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.topItems?.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.orders} orders</p>
                    </div>
                  </div>
                  <span className="font-bold text-green-600">
                    ${item.revenue.toFixed(2)}
                  </span>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentAnalytics?.paymentMethodBreakdown && 
               Object.entries(paymentAnalytics.paymentMethodBreakdown).map(([method, count]) => {
                const total = Object.values(paymentAnalytics.paymentMethodBreakdown).reduce((a: number, b: number) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={method} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{method}</span>
                      <span>{count} orders ({percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
              
              {(!paymentAnalytics?.paymentMethodBreakdown || 
                Object.keys(paymentAnalytics.paymentMethodBreakdown).length === 0) && (
                <p className="text-gray-500 text-center py-4">No payment data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Busy Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Peak Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getBusyHours().map((hour, index) => (
                <div key={hour} className="flex items-center gap-3">
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    {index === 0 ? "Busiest" : `Top ${index + 1}`}
                  </Badge>
                  <span className="font-medium">{hour}</span>
                </div>
              ))}
              
              {getBusyHours().length === 0 && (
                <p className="text-gray-500 text-center py-4">No hourly data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.recentOrders?.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${order.total}</p>
                    <Badge className={getStatusColor(order.status)} variant="secondary">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Analytics */}
      {rewardsAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Program Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {rewardsAnalytics.totalPointsIssued || 0}
                </p>
                <p className="text-sm text-gray-600">Total Points Issued</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {rewardsAnalytics.activeCustomers || 0}
                </p>
                <p className="text-sm text-gray-600">Active Members</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {rewardsAnalytics.averageRewardPerOrder?.toFixed(1) || '0.0'}
                </p>
                <p className="text-sm text-gray-600">Avg Points/Order</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}