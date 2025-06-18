import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  TrendingUp, 
  Users, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity
} from "lucide-react";

interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completionRate: number;
  ordersPerHour: number;
}

interface LiveOrder {
  id: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total: number;
  items: number;
  timeElapsed: number;
  customerName?: string;
}

export function LiveSalesDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([]);
  const [todayStats, setTodayStats] = useState<OrderStats>({
    totalOrders: 47,
    completedOrders: 42,
    cancelledOrders: 3,
    pendingOrders: 2,
    totalRevenue: 1847.50,
    averageOrderValue: 39.31,
    completionRate: 89.4,
    ordersPerHour: 12.3
  });

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate live order updates
      setLiveOrders(prev => prev.map(order => ({
        ...order,
        timeElapsed: order.timeElapsed + 1
      })));
      
      // Simulate new orders occasionally
      if (Math.random() < 0.1) {
        const newOrder: LiveOrder = {
          id: Date.now(),
          status: 'pending',
          total: Math.floor(Math.random() * 80) + 20,
          items: Math.floor(Math.random() * 5) + 1,
          timeElapsed: 0,
          customerName: `Customer ${Math.floor(Math.random() * 1000)}`
        };
        setLiveOrders(prev => [newOrder, ...prev.slice(0, 9)]);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initialize with sample live orders
  useEffect(() => {
    setLiveOrders([
      { id: 1, status: 'preparing', total: 45.50, items: 3, timeElapsed: 12, customerName: 'John D.' },
      { id: 2, status: 'ready', total: 23.75, items: 2, timeElapsed: 8, customerName: 'Sarah M.' },
      { id: 3, status: 'pending', total: 67.20, items: 4, timeElapsed: 2, customerName: 'Mike R.' },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeColor = (timeElapsed: number) => {
    if (timeElapsed < 10) return 'text-green-600';
    if (timeElapsed < 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Sales Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring • Last updated: {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayStats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {todayStats.ordersPerHour.toFixed(1)} orders/hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.completionRate}%</div>
            <Progress value={todayStats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayStats.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Live Order Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {liveOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No active orders</p>
              ) : (
                liveOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                      <div>
                        <div className="font-medium">Order #{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customerName} • {order.items} items
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${order.total.toFixed(2)}</div>
                      <div className={`text-sm ${getTimeColor(order.timeElapsed)}`}>
                        {Math.floor(order.timeElapsed / 60)}:{(order.timeElapsed % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="text-sm font-medium">{todayStats.completedOrders}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm">In Progress</span>
              </div>
              <div className="text-sm font-medium">{todayStats.pendingOrders}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm">Cancelled</span>
              </div>
              <div className="text-sm font-medium">{todayStats.cancelledOrders}</div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground mb-2">Completion Rate</div>
              <div className="flex items-center space-x-2">
                <Progress value={todayStats.completionRate} className="flex-1" />
                <span className="text-sm font-medium">{todayStats.completionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Performance Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {liveOrders.some(order => order.timeElapsed > 15) && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm text-red-700">
                  Orders taking longer than 15 minutes detected
                </span>
              </div>
            )}
            
            {todayStats.completionRate < 85 && (
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-sm text-yellow-700">
                  Completion rate below target (85%)
                </span>
              </div>
            )}
            
            {!liveOrders.some(order => order.timeElapsed > 15) && todayStats.completionRate >= 85 && (
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-green-700">
                  All systems operating normally
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}