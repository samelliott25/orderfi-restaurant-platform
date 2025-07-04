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
  
  // Static 5-minute interval data for hourly view - realistic restaurant sales pattern
  const generate5MinuteData = () => {
    // Pre-defined realistic sales pattern for a typical restaurant day
    const staticPatterns = [
      // 9:00 AM - Morning opening (slow)
      { time: '9:00', revenue: 45, orders: 2 }, { time: '9:05', revenue: 32, orders: 1 },
      { time: '9:10', revenue: 68, orders: 3 }, { time: '9:15', revenue: 91, orders: 4 },
      { time: '9:20', revenue: 123, orders: 5 }, { time: '9:25', revenue: 156, orders: 7 },
      { time: '9:30', revenue: 189, orders: 8 }, { time: '9:35', revenue: 234, orders: 10 },
      { time: '9:40', revenue: 267, orders: 12 }, { time: '9:45', revenue: 298, orders: 13 },
      { time: '9:50', revenue: 334, orders: 15 }, { time: '9:55', revenue: 367, orders: 16 },
      
      // 10:00 AM - Building up
      { time: '10:00', revenue: 425, orders: 19 }, { time: '10:05', revenue: 456, orders: 20 },
      { time: '10:10', revenue: 489, orders: 22 }, { time: '10:15', revenue: 523, orders: 23 },
      { time: '10:20', revenue: 567, orders: 25 }, { time: '10:25', revenue: 598, orders: 27 },
      { time: '10:30', revenue: 634, orders: 28 }, { time: '10:35', revenue: 667, orders: 30 },
      { time: '10:40', revenue: 701, orders: 31 }, { time: '10:45', revenue: 734, orders: 33 },
      { time: '10:50', revenue: 768, orders: 34 }, { time: '10:55', revenue: 801, orders: 36 },
      
      // 11:00 AM - Pre-lunch pickup
      { time: '11:00', revenue: 867, orders: 39 }, { time: '11:05', revenue: 901, orders: 40 },
      { time: '11:10', revenue: 956, orders: 43 }, { time: '11:15', revenue: 1012, orders: 45 },
      { time: '11:20', revenue: 1067, orders: 48 }, { time: '11:25', revenue: 1123, orders: 50 },
      { time: '11:30', revenue: 1178, orders: 53 }, { time: '11:35', revenue: 1234, orders: 55 },
      { time: '11:40', revenue: 1289, orders: 58 }, { time: '11:45', revenue: 1345, orders: 60 },
      { time: '11:50', revenue: 1400, orders: 63 }, { time: '11:55', revenue: 1456, orders: 65 },
      
      // 12:00 PM - Lunch rush peak
      { time: '12:00', revenue: 1567, orders: 70 }, { time: '12:05', revenue: 1634, orders: 73 },
      { time: '12:10', revenue: 1723, orders: 77 }, { time: '12:15', revenue: 1812, orders: 81 },
      { time: '12:20', revenue: 1901, orders: 85 }, { time: '12:25', revenue: 1989, orders: 89 },
      { time: '12:30', revenue: 2078, orders: 93 }, { time: '12:35', revenue: 2167, orders: 97 },
      { time: '12:40', revenue: 2256, orders: 101 }, { time: '12:45', revenue: 2345, orders: 105 },
      { time: '12:50', revenue: 2434, orders: 109 }, { time: '12:55', revenue: 2523, orders: 113 },
      
      // 1:00 PM - Peak lunch continues
      { time: '13:00', revenue: 2612, orders: 117 }, { time: '13:05', revenue: 2701, orders: 121 },
      { time: '13:10', revenue: 2790, orders: 125 }, { time: '13:15', revenue: 2879, orders: 129 },
      { time: '13:20', revenue: 2968, orders: 133 }, { time: '13:25', revenue: 3057, orders: 137 },
      { time: '13:30', revenue: 3146, orders: 141 }, { time: '13:35', revenue: 3235, orders: 145 },
      { time: '13:40', revenue: 3324, orders: 149 }, { time: '13:45', revenue: 3413, orders: 153 },
      { time: '13:50', revenue: 3502, orders: 157 }, { time: '13:55', revenue: 3591, orders: 161 },
      
      // 2:00 PM - Post-lunch slowdown
      { time: '14:00', revenue: 3680, orders: 165 }, { time: '14:05', revenue: 3725, orders: 167 },
      { time: '14:10', revenue: 3770, orders: 169 }, { time: '14:15', revenue: 3815, orders: 171 },
      { time: '14:20', revenue: 3860, orders: 173 }, { time: '14:25', revenue: 3905, orders: 175 },
      { time: '14:30', revenue: 3950, orders: 177 }, { time: '14:35', revenue: 3995, orders: 179 },
      { time: '14:40', revenue: 4040, orders: 181 }, { time: '14:45', revenue: 4085, orders: 183 },
      { time: '14:50', revenue: 4130, orders: 185 }, { time: '14:55', revenue: 4175, orders: 187 },
      
      // 3:00 PM - Afternoon lull
      { time: '15:00', revenue: 4220, orders: 189 }, { time: '15:05', revenue: 4245, orders: 190 },
      { time: '15:10', revenue: 4270, orders: 191 }, { time: '15:15', revenue: 4295, orders: 192 },
      { time: '15:20', revenue: 4320, orders: 193 }, { time: '15:25', revenue: 4345, orders: 194 },
      { time: '15:30', revenue: 4370, orders: 195 }, { time: '15:35', revenue: 4395, orders: 196 },
      { time: '15:40', revenue: 4420, orders: 197 }, { time: '15:45', revenue: 4445, orders: 198 },
      { time: '15:50', revenue: 4470, orders: 199 }, { time: '15:55', revenue: 4495, orders: 200 },
      
      // 4:00 PM - Late afternoon
      { time: '16:00', revenue: 4520, orders: 201 }, { time: '16:05', revenue: 4535, orders: 202 },
      { time: '16:10', revenue: 4550, orders: 203 }, { time: '16:15', revenue: 4565, orders: 204 },
      { time: '16:20', revenue: 4580, orders: 205 }, { time: '16:25', revenue: 4595, orders: 206 },
      { time: '16:30', revenue: 4610, orders: 207 }, { time: '16:35', revenue: 4625, orders: 208 },
      { time: '16:40', revenue: 4640, orders: 209 }, { time: '16:45', revenue: 4655, orders: 210 },
      { time: '16:50', revenue: 4670, orders: 211 }, { time: '16:55', revenue: 4685, orders: 212 },
      
      // 5:00 PM - Early dinner pickup
      { time: '17:00', revenue: 4700, orders: 213 }, { time: '17:05', revenue: 4730, orders: 215 },
      { time: '17:10', revenue: 4760, orders: 217 }, { time: '17:15', revenue: 4790, orders: 219 },
      { time: '17:20', revenue: 4820, orders: 221 }, { time: '17:25', revenue: 4850, orders: 223 },
      { time: '17:30', revenue: 4880, orders: 225 }, { time: '17:35', revenue: 4910, orders: 227 },
      { time: '17:40', revenue: 4940, orders: 229 }, { time: '17:45', revenue: 4970, orders: 231 },
      { time: '17:50', revenue: 5000, orders: 233 }, { time: '17:55', revenue: 5030, orders: 235 },
      
      // 6:00 PM - Dinner rush building
      { time: '18:00', revenue: 5089, orders: 238 }, { time: '18:05', revenue: 5148, orders: 241 },
      { time: '18:10', revenue: 5207, orders: 244 }, { time: '18:15', revenue: 5266, orders: 247 },
      { time: '18:20', revenue: 5325, orders: 250 }, { time: '18:25', revenue: 5384, orders: 253 },
      { time: '18:30', revenue: 5443, orders: 256 }, { time: '18:35', revenue: 5502, orders: 259 },
      { time: '18:40', revenue: 5561, orders: 262 }, { time: '18:45', revenue: 5620, orders: 265 },
      { time: '18:50', revenue: 5679, orders: 268 }, { time: '18:55', revenue: 5738, orders: 271 },
      
      // 7:00 PM - Peak dinner rush
      { time: '19:00', revenue: 5856, orders: 276 }, { time: '19:05', revenue: 5974, orders: 281 },
      { time: '19:10', revenue: 6092, orders: 286 }, { time: '19:15', revenue: 6210, orders: 291 },
      { time: '19:20', revenue: 6328, orders: 296 }, { time: '19:25', revenue: 6446, orders: 301 },
      { time: '19:30', revenue: 6564, orders: 306 }, { time: '19:35', revenue: 6682, orders: 311 },
      { time: '19:40', revenue: 6800, orders: 316 }, { time: '19:45', revenue: 6918, orders: 321 },
      { time: '19:50', revenue: 7036, orders: 326 }, { time: '19:55', revenue: 7154, orders: 331 },
      
      // 8:00 PM - Peak continues
      { time: '20:00', revenue: 7272, orders: 336 }, { time: '20:05', revenue: 7390, orders: 341 },
      { time: '20:10', revenue: 7508, orders: 346 }, { time: '20:15', revenue: 7626, orders: 351 },
      { time: '20:20', revenue: 7744, orders: 356 }, { time: '20:25', revenue: 7862, orders: 361 },
      { time: '20:30', revenue: 7980, orders: 366 }, { time: '20:35', revenue: 8098, orders: 371 },
      { time: '20:40', revenue: 8216, orders: 376 }, { time: '20:45', revenue: 8334, orders: 381 },
      { time: '20:50', revenue: 8452, orders: 386 }, { time: '20:55', revenue: 8570, orders: 391 },
      
      // 9:00 PM - Late dinner wind down
      { time: '21:00', revenue: 8688, orders: 396 }, { time: '21:05', revenue: 8776, orders: 400 },
      { time: '21:10', revenue: 8864, orders: 404 }, { time: '21:15', revenue: 8952, orders: 408 },
      { time: '21:20', revenue: 9040, orders: 412 }, { time: '21:25', revenue: 9128, orders: 416 },
      { time: '21:30', revenue: 9216, orders: 420 }, { time: '21:35', revenue: 9304, orders: 424 },
      { time: '21:40', revenue: 9392, orders: 428 }, { time: '21:45', revenue: 9480, orders: 432 },
      { time: '21:50', revenue: 9568, orders: 436 }, { time: '21:55', revenue: 9656, orders: 440 },
      
      // 10:00 PM - Evening slow down
      { time: '22:00', revenue: 9744, orders: 444 }, { time: '22:05', revenue: 9802, orders: 446 },
      { time: '22:10', revenue: 9860, orders: 448 }, { time: '22:15', revenue: 9918, orders: 450 },
      { time: '22:20', revenue: 9976, orders: 452 }, { time: '22:25', revenue: 10034, orders: 454 },
      { time: '22:30', revenue: 10092, orders: 456 }, { time: '22:35', revenue: 10150, orders: 458 },
      { time: '22:40', revenue: 10208, orders: 460 }, { time: '22:45', revenue: 10266, orders: 462 },
      { time: '22:50', revenue: 10324, orders: 464 }, { time: '22:55', revenue: 10382, orders: 466 },
      
      // 11:00 PM - Late night
      { time: '23:00', revenue: 10440, orders: 468 }, { time: '23:05', revenue: 10470, orders: 469 },
      { time: '23:10', revenue: 10500, orders: 470 }, { time: '23:15', revenue: 10530, orders: 471 },
      { time: '23:20', revenue: 10560, orders: 472 }, { time: '23:25', revenue: 10590, orders: 473 },
      { time: '23:30', revenue: 10620, orders: 474 }, { time: '23:35', revenue: 10650, orders: 475 },
      { time: '23:40', revenue: 10680, orders: 476 }, { time: '23:45', revenue: 10710, orders: 477 },
      { time: '23:50', revenue: 10740, orders: 478 }, { time: '23:55', revenue: 10770, orders: 479 }
    ];
    
    return staticPatterns.map(item => ({
      ...item,
      isLive: parseInt(item.time.split(':')[0]) < currentHour || 
              (parseInt(item.time.split(':')[0]) === currentHour && parseInt(item.time.split(':')[1]) <= currentMinute)
    }));
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