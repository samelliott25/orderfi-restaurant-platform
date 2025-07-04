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
  LineChart as LineChartIcon,
  Minus
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RestaurantDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");
  const [chartTimeframe, setChartTimeframe] = useState("1H");

  // Current time and hour tracking
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  
  // Static 5-minute interval data for hourly view - shows sales per 5-minute period
  const generate5MinuteData = () => {
    // Hourly sales patterns broken down by 5-minute intervals
    const hourlyPatterns = {
      9: { base: 23, variation: [0.4, 0.2, 0.7, 0.9, 1.2, 1.5, 1.8, 2.1, 2.3, 2.6, 2.8, 3.0] }, // Morning opening
      10: { base: 35, variation: [0.8, 0.9, 1.1, 1.3, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0] }, // Building up
      11: { base: 55, variation: [1.2, 1.4, 1.8, 2.1, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.2, 4.5] }, // Pre-lunch
      12: { base: 105, variation: [2.5, 3.2, 4.1, 4.8, 5.5, 6.2, 6.9, 7.6, 8.3, 9.0, 9.7, 10.4] }, // Lunch rush
      13: { base: 125, variation: [3.8, 4.5, 5.2, 5.9, 6.6, 7.3, 8.0, 8.7, 9.4, 10.1, 10.8, 11.5] }, // Peak lunch
      14: { base: 45, variation: [1.8, 1.5, 1.2, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2] }, // Post-lunch drop
      15: { base: 18, variation: [0.3, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2] }, // Afternoon lull
      16: { base: 15, variation: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1] }, // Late afternoon
      17: { base: 38, variation: [0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5, 2.7] }, // Early dinner
      18: { base: 65, variation: [1.5, 1.8, 2.1, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.2, 4.5, 4.8] }, // Dinner building
      19: { base: 155, variation: [4.2, 5.1, 6.0, 6.9, 7.8, 8.7, 9.6, 10.5, 11.4, 12.3, 13.2, 14.1] }, // Peak dinner
      20: { base: 175, variation: [5.8, 6.5, 7.2, 7.9, 8.6, 9.3, 10.0, 10.7, 11.4, 12.1, 12.8, 13.5] }, // Peak continues
      21: { base: 85, variation: [3.2, 2.9, 2.6, 2.3, 2.0, 1.7, 1.4, 1.1, 0.8, 0.5, 0.3, 0.2] }, // Wind down
      22: { base: 32, variation: [0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1] }, // Evening slow
      23: { base: 12, variation: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1] }, // Late night
      0: { base: 0, variation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, // Closed
      1: { base: 0, variation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, // Closed
      2: { base: 0, variation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, // Closed
      3: { base: 0, variation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, // Closed
      4: { base: 0, variation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, // Closed
      5: { base: 0, variation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, // Closed
      6: { base: 0, variation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, // Closed
      7: { base: 0, variation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, // Closed
      8: { base: 0, variation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }, // Closed
    };
    
    const intervals = [];
    
    // Generate 24 hours of data
    for (let hour = 0; hour < 24; hour++) {
      const pattern = hourlyPatterns[hour];
      for (let minute = 0; minute < 60; minute += 5) {
        const intervalIndex = Math.floor(minute / 5);
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        const revenue = Math.round(pattern.base * pattern.variation[intervalIndex]);
        const orders = Math.round(revenue / 22); // Average order value ~$22
        
        intervals.push({
          time: timeString,
          revenue: revenue,
          orders: orders,
          isLive: hour < currentHour || (hour === currentHour && minute <= currentMinute)
        });
      }
    }
    
    // Only return operating hours (9 AM to 11:59 PM) for the chart
    return intervals.filter(item => {
      const hour = parseInt(item.time.split(':')[0]);
      return hour >= 9 && hour <= 23;
    });
  };

  // Hourly aggregated data for daily view
  const hourlyData = [
    { time: '9:00', revenue: 285, orders: 14, avgRevenue: 260 },
    { time: '10:00', revenue: 425, orders: 21, avgRevenue: 390 },
    { time: '11:00', revenue: 680, orders: 32, avgRevenue: 620 },
    { time: '12:00', revenue: 1250, orders: 58, avgRevenue: 1150 },
    { time: '13:00', revenue: 1650, orders: 76, avgRevenue: 1520 },
    { time: '14:00', revenue: 980, orders: 45, avgRevenue: 890 },
    { time: '15:00', revenue: 420, orders: 19, avgRevenue: 380 },
    { time: '16:00', revenue: 320, orders: 15, avgRevenue: 290 },
    { time: '17:00', revenue: 850, orders: 39, avgRevenue: 780 },
    { time: '18:00', revenue: 1420, orders: 64, avgRevenue: 1320 },
    { time: '19:00', revenue: 1890, orders: 82, avgRevenue: 1780 },
    { time: '20:00', revenue: 2150, orders: 89, avgRevenue: 2050 },
    { time: '21:00', revenue: 1560, orders: 67, avgRevenue: 1480 },
    { time: '22:00', revenue: 780, orders: 32, avgRevenue: 720 },
    { time: '23:00', revenue: 420, orders: 17, avgRevenue: 450 }
  ];

  // Weekly data for weekly view
  const weeklyData = [
    { day: 'Mon', revenue: 8420, orders: 387, avgRevenue: 7890 },
    { day: 'Tue', revenue: 9150, orders: 421, avgRevenue: 8650 },
    { day: 'Wed', revenue: 10280, orders: 468, avgRevenue: 9420 },
    { day: 'Thu', revenue: 11650, orders: 524, avgRevenue: 10890 },
    { day: 'Fri', revenue: 15280, orders: 692, avgRevenue: 14200 },
    { day: 'Sat', revenue: 18420, orders: 824, avgRevenue: 17100 },
    { day: 'Sun', revenue: 14680, orders: 658, avgRevenue: 13980 }
  ];

  // Monthly data for monthly view
  const monthlyData = [
    { week: 'Week 1', revenue: 87900, orders: 3876, avgRevenue: 82400 },
    { week: 'Week 2', revenue: 92400, orders: 4123, avgRevenue: 89200 },
    { week: 'Week 3', revenue: 89600, orders: 3998, avgRevenue: 87100 },
    { week: 'Week 4', revenue: 94200, orders: 4234, avgRevenue: 91800 }
  ];

  // Get data based on selected timeframe
  const getChartData = () => {
    switch (chartTimeframe) {
      case '1H': return generate5MinuteData(); // 5-minute intervals for hourly view
      case '1D': return weeklyData;
      case '1W': return monthlyData;
      default: return generate5MinuteData();
    }
  };

  const chartData = getChartData();
  const maxRevenue = Math.max(...chartData.map(d => d.revenue || 0));
  const isColumnChart = chartTimeframe === '1H';



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
  const currentRevenue = chartData[chartData.length - 1]?.revenue || 0;
  const previousRevenue = chartData[chartData.length - 2]?.revenue || 0;
  const revenueChange = currentRevenue - previousRevenue;
  const revenueChangePercent = previousRevenue ? ((revenueChange / previousRevenue) * 100) : 0;

  const totalTodayRevenue = hourlyData.reduce((sum: number, data: any) => sum + data.revenue, 0);
  const totalTodayOrders = hourlyData.reduce((sum: number, data: any) => sum + data.orders, 0);
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

        {/* Primary Sales Performance Chart */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChartIcon className="w-6 h-6" style={{ color: 'hsl(25, 95%, 53%)' }} />
                <span className="text-2xl playwrite-font">Sales Performance</span>
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">Live</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button 
                    variant={chartTimeframe === "1H" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartTimeframe("1H")}
                    className="h-7 px-3 text-xs font-medium"
                  >
                    1H
                  </Button>
                  <Button 
                    variant={chartTimeframe === "1D" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartTimeframe("1D")}
                    className="h-7 px-3 text-xs font-medium"
                  >
                    1D
                  </Button>
                  <Button 
                    variant={chartTimeframe === "1W" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setChartTimeframe("1W")}
                    className="h-7 px-3 text-xs font-medium"
                  >
                    1W
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-3 h-3 rounded bg-slate-600"></div>
                    <span className="playwrite-font">Historical Avg</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-3 h-3 rounded bg-orange-500"></div>
                    <span className="playwrite-font">{isColumnChart ? 'Live (5min intervals)' : 'Live Performance'}</span>
                  </div>
                  <div className="text-xl font-bold playwrite-font" style={{ color: 'hsl(25, 95%, 53%)' }}>
                    ${chartData[Math.min(currentHour - 9, chartData.length - 1)]?.revenue || chartData[chartData.length - 1]?.revenue || 0}
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                {isColumnChart ? (
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      interval="preserveEnd"
                      tickFormatter={(value, index) => {
                        // Show only hourly labels
                        if (index % 12 === 0) {
                          return value.split(':')[0] + ':00';
                        }
                        return '';
                      }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-700">
                              <div className="font-bold playwrite-font text-sm text-orange-300">{label}</div>
                              <div style={{ color: '#f97316' }} className="font-medium">
                                Revenue: ${payload[0].value} ({payload[0].payload.orders} orders)
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="#f97316" 
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#64748b" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey={(chartTimeframe === '1D' ? 'day' : chartTimeframe === '1W' ? 'week' : 'time')}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-700">
                              <div className="font-bold playwrite-font text-sm text-orange-300">{label}</div>
                              <div style={{ color: '#f97316' }} className="font-medium">
                                Live: ${payload.find(p => p.dataKey === 'revenue')?.value} ({payload[0].payload.orders} orders)
                              </div>
                              <div style={{ color: '#94a3b8' }} className="font-medium">
                                Avg: ${payload.find(p => p.dataKey === 'avgRevenue')?.value || 0}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="avgRevenue"
                      stroke="#64748b"
                      strokeWidth={2}
                      fill="url(#colorAverage)"
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f97316"
                      strokeWidth={3}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              Live Orders
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
                      ${hourlyData[hourlyData.length - 1]?.revenue || 0}
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
                      {hourlyData.map((data: any, index: number) => {
                        const height = (data.revenue / 1500) * 100; // Max height based on peak value
                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center group relative"
                            style={{ width: `${100 / hourlyData.length}%` }}
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