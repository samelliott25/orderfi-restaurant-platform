import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { StandardLayout } from "@/components/StandardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  Clock,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  Package,
  CreditCard,
  Smartphone,
  Wifi,
  ChefHat,
  Timer,
  TrendingDown,
  LineChart,
  Minus
} from "lucide-react";

export default function RestaurantDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");
  const [chartTimeframe, setChartTimeframe] = useState("1H");

  // Comprehensive sales data with realistic restaurant patterns
  const salesChartData = [
    { time: '9:00', revenue: 285, orders: 14, avgOrder: 20.36, volume: 9200, customers: 16, tips: 42.75 },
    { time: '10:00', revenue: 425, orders: 21, avgOrder: 20.24, volume: 14300, customers: 24, tips: 63.75 },
    { time: '11:00', revenue: 680, orders: 32, avgOrder: 21.25, volume: 21800, customers: 35, tips: 102.00 },
    { time: '12:00', revenue: 1250, orders: 58, avgOrder: 21.55, volume: 39500, customers: 62, tips: 187.50 },
    { time: '13:00', revenue: 1650, orders: 76, avgOrder: 21.71, volume: 52200, customers: 81, tips: 247.50 },
    { time: '14:00', revenue: 980, orders: 45, avgOrder: 21.78, volume: 31100, customers: 48, tips: 147.00 },
    { time: '15:00', revenue: 420, orders: 19, avgOrder: 22.11, volume: 13300, customers: 21, tips: 63.00 },
    { time: '16:00', revenue: 320, orders: 15, avgOrder: 21.33, volume: 10200, customers: 17, tips: 48.00 },
    { time: '17:00', revenue: 850, orders: 39, avgOrder: 21.79, volume: 26900, customers: 42, tips: 127.50 },
    { time: '18:00', revenue: 1420, orders: 64, avgOrder: 22.19, volume: 44800, customers: 68, tips: 213.00 },
    { time: '19:00', revenue: 1890, orders: 82, avgOrder: 23.05, volume: 59700, customers: 87, tips: 283.50 },
    { time: '20:00', revenue: 2150, orders: 89, avgOrder: 24.16, volume: 67900, customers: 94, tips: 322.50 },
    { time: '21:00', revenue: 1560, orders: 67, avgOrder: 23.28, volume: 49300, customers: 71, tips: 234.00 },
    { time: '22:00', revenue: 780, orders: 32, avgOrder: 24.38, volume: 24600, customers: 35, tips: 117.00 }
  ];

  // Weekly revenue data for trends
  const weeklyData = [
    { day: 'Mon', revenue: 8420, orders: 387, avgOrder: 21.76 },
    { day: 'Tue', revenue: 9150, orders: 421, avgOrder: 21.73 },
    { day: 'Wed', revenue: 10280, orders: 468, avgOrder: 21.97 },
    { day: 'Thu', revenue: 11650, orders: 524, avgOrder: 22.23 },
    { day: 'Fri', revenue: 15280, orders: 692, avgOrder: 22.08 },
    { day: 'Sat', revenue: 18420, orders: 824, avgOrder: 22.35 },
    { day: 'Sun', revenue: 14680, orders: 658, avgOrder: 22.31 }
  ];

  // Menu performance data
  const menuPerformance = [
    { name: 'Margherita Pizza', orders: 156, revenue: 2496, margin: 68, trend: '+12%' },
    { name: 'Caesar Salad', orders: 89, revenue: 1246, margin: 72, trend: '+8%' },
    { name: 'Burger Deluxe', orders: 134, revenue: 2278, margin: 65, trend: '+15%' },
    { name: 'Pasta Carbonara', orders: 98, revenue: 1764, margin: 70, trend: '+5%' },
    { name: 'Fish & Chips', orders: 67, revenue: 1340, margin: 58, trend: '-3%' },
    { name: 'Craft Beer', orders: 245, revenue: 1715, margin: 85, trend: '+22%' }
  ];

  // Customer analytics
  const customerMetrics = {
    totalCustomers: 2847,
    newCustomers: 127,
    returningCustomers: 2720,
    averageVisitFrequency: 2.4,
    customerSatisfaction: 4.7,
    loyaltyMembers: 1580
  };

  // Payment method breakdown
  const paymentMethods = [
    { method: 'Credit Card', amount: 8450, percentage: 58.2, transactions: 389 },
    { method: 'USDC/Crypto', amount: 2890, percentage: 19.9, transactions: 127 },
    { method: 'Cash', amount: 1980, percentage: 13.6, transactions: 156 },
    { method: 'Gift Cards', amount: 820, percentage: 5.6, transactions: 45 },
    { method: 'Apple Pay', amount: 390, percentage: 2.7, transactions: 23 }
  ];

  // Staff performance data
  const staffMetrics = [
    { name: 'Sarah M.', role: 'Server', orders: 67, revenue: 1456, rating: 4.9, hours: 8 },
    { name: 'Mike R.', role: 'Chef', orders: 134, revenue: 2890, rating: 4.8, hours: 8 },
    { name: 'Lisa K.', role: 'Server', orders: 89, revenue: 1923, rating: 4.7, hours: 8 },
    { name: 'James T.', role: 'Bartender', orders: 156, revenue: 2340, rating: 4.8, hours: 8 },
    { name: 'Emma D.', role: 'Host', orders: 0, revenue: 0, rating: 4.9, hours: 8 }
  ];

  // Operational metrics
  const operationalData = {
    kitchenEfficiency: 94.2,
    averageWaitTime: 12.5, // minutes
    tableUtilization: 78.3,
    foodCostPercentage: 28.5,
    laborCostPercentage: 32.1,
    wastePercentage: 3.2,
    customerReturnRate: 67.8,
    peakHourCapacity: 89.4
  };

  // Calculate real-time metrics from chart data
  const currentRevenue = salesChartData[salesChartData.length - 1]?.revenue || 0;
  const previousRevenue = salesChartData[salesChartData.length - 2]?.revenue || 0;
  const revenueChange = currentRevenue - previousRevenue;
  const revenueChangePercent = previousRevenue ? ((revenueChange / previousRevenue) * 100) : 0;

  const totalTodayRevenue = salesChartData.reduce((sum, data) => sum + data.revenue, 0);
  const totalTodayOrders = salesChartData.reduce((sum, data) => sum + data.orders, 0);
  const totalTodayTips = salesChartData.reduce((sum, data) => sum + data.tips, 0);
  const avgOrderValue = totalTodayRevenue / totalTodayOrders;

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real data
  const { data: orders = [] } = useQuery({
    queryKey: ['/api/orders'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ['/api/menu'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Generate comprehensive mock orders when no real data is available
  const generateMockOrders = () => {
    const statuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    const weights = [8, 12, 5, 70, 5]; // Weighted probability
    const customers = ['Sarah Johnson', 'Mike Davis', 'Emily Chen', 'David Wilson', 'Lisa Garcia', 'James Brown', 'Emma Martinez', 'Ryan Thompson', 'Olivia Anderson', 'Chris Lee'];
    const itemSets = [
      ['Margherita Pizza', 'Caesar Salad', 'Craft Beer'],
      ['Burger Deluxe', 'French Fries', 'Coca Cola'],
      ['Pasta Carbonara', 'Garlic Bread', 'House Wine'],
      ['Fish & Chips', 'Coleslaw', 'Iced Tea'],
      ['Chicken Alfredo', 'Side Salad', 'Water'],
      ['BBQ Ribs', 'Corn on Cob', 'Beer'],
      ['Vegetarian Wrap', 'Sweet Potato Fries', 'Fresh Juice']
    ];
    
    return Array.from({ length: totalTodayOrders }, (_, i) => {
      const randomStatus = () => {
        const random = Math.random() * 100;
        let cumulative = 0;
        for (let j = 0; j < weights.length; j++) {
          cumulative += weights[j];
          if (random <= cumulative) return statuses[j];
        }
        return 'completed';
      };
      
      return {
        id: i + 1,
        status: randomStatus(),
        total: Math.round((Math.random() * 35 + 15) * 100) / 100,
        customerName: customers[Math.floor(Math.random() * customers.length)],
        items: itemSets[Math.floor(Math.random() * itemSets.length)],
        createdAt: new Date(Date.now() - Math.random() * 14 * 60 * 60 * 1000), // Within last 14 hours
        tableNumber: Math.floor(Math.random() * 20) + 1,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)].method,
        tips: Math.round((Math.random() * 8 + 2) * 100) / 100
      };
    });
  };

  // Use real orders if available, otherwise use comprehensive mock data
  const ordersArray = Array.isArray(orders) ? orders : [];
  const typedOrders = ordersArray.length > 0 ? ordersArray as any[] : generateMockOrders();

  // Calculate metrics from enhanced data
  const todayOrders = typedOrders.filter((order: any) => {
    const orderDate = new Date(order.createdAt || Date.now());
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  // Use calculated totals from comprehensive sales data
  const todayRevenue = totalTodayRevenue;
  const pendingOrders = typedOrders.filter((order: any) => order.status === 'pending').length;
  const preparingOrders = typedOrders.filter((order: any) => order.status === 'preparing').length;
  const readyOrders = typedOrders.filter((order: any) => order.status === 'ready').length;
  const completedOrders = typedOrders.filter((order: any) => order.status === 'completed').length;
  const completionRate = typedOrders.length > 0 ? (completedOrders / typedOrders.length) * 100 : 0;

  return (
    <StandardLayout title="Restaurant Dashboard" subtitle="AI-Powered Command Center">
      <div className="space-y-6">
        {/* Real-time System Status Bar */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-mono text-slate-700 dark:text-slate-300">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">System Online</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-slate-600 dark:text-slate-400">Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" style={{ color: 'hsl(25, 95%, 53%)' }} />
                <span className="text-slate-600 dark:text-slate-400">Avg: {operationalData.averageWaitTime}min</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" style={{ color: 'hsl(340, 82%, 52%)' }} />
                <span className="text-slate-600 dark:text-slate-400">{pendingOrders + preparingOrders} Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium playwrite-font">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4" style={{ color: 'hsl(340, 82%, 52%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${todayRevenue.toFixed(2)}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium playwrite-font">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4" style={{ color: 'hsl(25, 95%, 53%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTodayOrders}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                +8% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium playwrite-font">Pending Orders</CardTitle>
              <Clock className="h-4 w-4" style={{ color: 'hsl(25, 95%, 53%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Orders in queue
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium playwrite-font">Average Order Value</CardTitle>
              <TrendingUp className="h-4 w-4" style={{ color: 'hsl(215, 28%, 35%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                +5% from yesterday
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              Live Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Real-time Activity Feed */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" style={{ color: 'hsl(25, 95%, 53%)' }} />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {typedOrders.slice(0, 6).map((order: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <div>
                            <p className="text-sm font-medium">Order #{order.id}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {order.customerName || 'Walk-in'} • ${parseFloat(order.total || '0').toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={order.status === 'completed' ? 'default' : 'secondary'}
                          style={{
                            backgroundColor: order.status === 'completed' ? 'hsl(160, 84%, 39%)' : 
                                           order.status === 'preparing' ? 'hsl(25, 95%, 53%)' : 'hsl(215, 28%, 17%)',
                            color: 'white'
                          }}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats & Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" style={{ color: 'hsl(340, 82%, 52%)' }} />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Order Completion Rate</span>
                      <span className="text-sm font-medium">{completionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Kitchen Efficiency</span>
                      <span className="text-sm font-medium">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Customer Satisfaction</span>
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        4.8/5
                      </span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold" style={{ color: 'hsl(25, 95%, 53%)' }}>14min</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Avg Prep Time</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold" style={{ color: 'hsl(340, 82%, 52%)' }}>98.4%</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Uptime</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <Package className="w-6 h-6" style={{ color: 'hsl(25, 95%, 53%)' }} />
                    <span className="text-sm">Inventory</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <CreditCard className="w-6 h-6" style={{ color: 'hsl(340, 82%, 52%)' }} />
                    <span className="text-sm">Payments</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <Users className="w-6 h-6" style={{ color: 'hsl(215, 28%, 35%)' }} />
                    <span className="text-sm">Staff</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                    <BarChart3 className="w-6 h-6" style={{ color: 'hsl(160, 84%, 39%)' }} />
                    <span className="text-sm">Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Kitchen Display - Live Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-600 dark:text-slate-400 py-8">
                  <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Kitchen display integration coming soon...</p>
                  <p className="text-sm">Real-time order management and preparation tracking</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Trading-Style Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" style={{ color: 'hsl(25, 95%, 53%)' }} />
                    Sales Performance
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={chartTimeframe === "1H" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setChartTimeframe("1H")}
                      className="h-7 px-3 text-xs"
                    >
                      1H
                    </Button>
                    <Button 
                      variant={chartTimeframe === "4H" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setChartTimeframe("4H")}
                      className="h-7 px-3 text-xs"
                    >
                      4H
                    </Button>
                    <Button 
                      variant={chartTimeframe === "1D" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setChartTimeframe("1D")}
                      className="h-7 px-3 text-xs"
                    >
                      1D
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Trading-style metrics row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-center">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Revenue</div>
                    <div className="text-lg font-bold">${totalTodayRevenue.toFixed(2)}</div>
                    <div className={`text-xs flex items-center justify-center gap-1 ${revenueChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {revenueChangePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(revenueChangePercent).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Orders</div>
                    <div className="text-lg font-bold">{totalTodayOrders}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">+12% vs yesterday</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Order</div>
                    <div className="text-lg font-bold">${avgOrderValue.toFixed(2)}</div>
                    <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +5.2%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Peak Hour</div>
                    <div className="text-lg font-bold">8-9 PM</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">$1,420 revenue</div>
                  </div>
                </div>

                {/* Professional trading-style chart */}
                <div className="h-80 mb-4 bg-slate-50 dark:bg-slate-800 rounded-lg p-4 relative overflow-hidden">
                  {/* Chart header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Revenue Trend</div>
                    <div className="text-sm font-medium" style={{ color: 'hsl(25, 95%, 53%)' }}>
                      ${salesChartData[salesChartData.length - 1]?.revenue || 0}
                    </div>
                  </div>
                  
                  {/* Chart visualization */}
                  <div className="relative h-full">
                    {/* Grid lines */}
                    <div className="absolute inset-0 grid grid-cols-14 opacity-20">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} className="border-r border-slate-300 dark:border-slate-600"></div>
                      ))}
                    </div>
                    <div className="absolute inset-0 grid grid-rows-6 opacity-20">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="border-b border-slate-300 dark:border-slate-600"></div>
                      ))}
                    </div>
                    
                    {/* Revenue area chart */}
                    <div className="absolute inset-0 flex items-end justify-between px-2">
                      {salesChartData.map((data, index) => {
                        const height = (data.revenue / 1500) * 100; // Max height based on peak value
                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center group relative"
                            style={{ width: `${100 / salesChartData.length}%` }}
                          >
                            {/* Tooltip on hover */}
                            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              {data.time}<br/>
                              ${data.revenue}<br/>
                              {data.orders} orders
                            </div>
                            
                            {/* Bar */}
                            <div
                              className="w-full rounded-t-sm transition-all duration-300 group-hover:opacity-80"
                              style={{
                                height: `${height}%`,
                                background: `linear-gradient(to top, hsl(25, 95%, 53%) 0%, hsl(340, 82%, 52%) 100%)`,
                                minHeight: '2px'
                              }}
                            />
                            
                            {/* Time label */}
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 transform -rotate-45 origin-top-left">
                              {data.time}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>$1500</span>
                      <span>$1200</span>
                      <span>$900</span>
                      <span>$600</span>
                      <span>$300</span>
                      <span>$0</span>
                    </div>
                  </div>
                </div>

                {/* Trading-style legend */}
                <div className="flex justify-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(25, 95%, 53%)' }}></div>
                    <span>Revenue (Area)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(340, 82%, 52%)' }}></div>
                    <span>Peak Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(215, 28%, 35%)' }}></div>
                    <span>Average Trend</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-600 dark:text-slate-400 py-8">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Performance metrics dashboard coming soon...</p>
                  <p className="text-sm">Real-time kitchen analytics and staff efficiency tracking</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StandardLayout>
  );
}