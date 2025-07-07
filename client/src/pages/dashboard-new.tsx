import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { StandardLayout } from "@/components/StandardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  Minus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useChatContext } from '@/contexts/ChatContext';
import type { LayoutSuggestion } from '@/hooks/useLayoutOptimization';

export default function RestaurantDashboard() {
  const { isSidebarMode, isOpen } = useChatContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");
  const [chartTimeframe, setChartTimeframe] = useState("1H");
  const [layoutConfig, setLayoutConfig] = useState({
    gridCols: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
    chartHeight: 'h-96',
    compactMode: false
  });
  
  // Date selection state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Default to today (Friday)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isRangeCalendarOpen, setIsRangeCalendarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"single" | "range">("single");

  // Current time and hour tracking
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  
  // Generate realistic sales data for each day of the week
  const generateDailySalesData = (dayOfWeek: number) => {
    // Different sales patterns for each day (0 = Sunday, 6 = Saturday)
    const dailyMultipliers = {
      0: 0.6,  // Sunday - slower day
      1: 0.7,  // Monday - building up  
      2: 0.8,  // Tuesday - steady
      3: 0.85, // Wednesday - good business
      4: 0.9,  // Thursday - busy
      5: 1.0,  // Friday - peak (baseline)
      6: 1.2   // Saturday - busiest
    };
    
    const multiplier = dailyMultipliers[dayOfWeek as keyof typeof dailyMultipliers] || 1.0;
    
    // Base Friday sales pattern with day-specific adjustments
    const baseFridayData = [
      // 9 AM - Morning opening (gradual increase with small variations)
      { time: '09:00', revenue: 12, orders: 1 }, { time: '09:05', revenue: 8, orders: 0 },
      { time: '09:10', revenue: 18, orders: 1 }, { time: '09:15', revenue: 23, orders: 1 },
      { time: '09:20', revenue: 31, orders: 1 }, { time: '09:25', revenue: 42, orders: 2 },
      { time: '09:30', revenue: 38, orders: 2 }, { time: '09:35', revenue: 55, orders: 2 },
      { time: '09:40', revenue: 47, orders: 2 }, { time: '09:45', revenue: 68, orders: 3 },
      { time: '09:50', revenue: 73, orders: 3 }, { time: '09:55', revenue: 89, orders: 4 },
      
      // 10 AM - Building momentum with natural fluctuations
      { time: '10:00', revenue: 95, orders: 4 }, { time: '10:05', revenue: 82, orders: 4 },
      { time: '10:10', revenue: 118, orders: 5 }, { time: '10:15', revenue: 106, orders: 5 },
      { time: '10:20', revenue: 134, orders: 6 }, { time: '10:25', revenue: 127, orders: 6 },
      { time: '10:30', revenue: 152, orders: 7 }, { time: '10:35', revenue: 145, orders: 7 },
      { time: '10:40', revenue: 168, orders: 8 }, { time: '10:45', revenue: 173, orders: 8 },
      { time: '10:50', revenue: 189, orders: 9 }, { time: '10:55', revenue: 194, orders: 9 },
      
      // 11 AM - Pre-lunch pickup with realistic spikes
      { time: '11:00', revenue: 218, orders: 10 }, { time: '11:05', revenue: 203, orders: 9 },
      { time: '11:10', revenue: 245, orders: 11 }, { time: '11:15', revenue: 267, orders: 12 },
      { time: '11:20', revenue: 284, orders: 13 }, { time: '11:25', revenue: 291, orders: 13 },
      { time: '11:30', revenue: 312, orders: 14 }, { time: '11:35', revenue: 298, orders: 14 },
      { time: '11:40', revenue: 325, orders: 15 }, { time: '11:45', revenue: 341, orders: 15 },
      { time: '11:50', revenue: 368, orders: 17 }, { time: '11:55', revenue: 384, orders: 17 },
      
      // 12 PM - Lunch rush with natural peaks and valleys
      { time: '12:00', revenue: 412, orders: 19 }, { time: '12:05', revenue: 456, orders: 21 },
      { time: '12:10', revenue: 523, orders: 24 }, { time: '12:15', revenue: 489, orders: 22 },
      { time: '12:20', revenue: 567, orders: 26 }, { time: '12:25', revenue: 634, orders: 29 },
      { time: '12:30', revenue: 691, orders: 31 }, { time: '12:35', revenue: 723, orders: 33 },
      { time: '12:40', revenue: 756, orders: 34 }, { time: '12:45', revenue: 812, orders: 37 },
      { time: '12:50', revenue: 784, orders: 36 }, { time: '12:55', revenue: 845, orders: 38 },
      
      // 1 PM - Peak lunch continues with organic variation
      { time: '13:00', revenue: 892, orders: 41 }, { time: '13:05', revenue: 934, orders: 42 },
      { time: '13:10', revenue: 987, orders: 45 }, { time: '13:15', revenue: 923, orders: 42 },
      { time: '13:20', revenue: 1056, orders: 48 }, { time: '13:25', revenue: 1123, orders: 51 },
      { time: '13:30', revenue: 1189, orders: 54 }, { time: '13:35', revenue: 1134, orders: 52 },
      { time: '13:40', revenue: 1267, orders: 58 }, { time: '13:45', revenue: 1198, orders: 54 },
      { time: '13:50', revenue: 1089, orders: 49 }, { time: '13:55', revenue: 1034, orders: 47 },
      
      // 2 PM - Post-lunch decline with natural drop-off
      { time: '14:00', revenue: 867, orders: 39 }, { time: '14:05', revenue: 723, orders: 33 },
      { time: '14:10', revenue: 612, orders: 28 }, { time: '14:15', revenue: 534, orders: 24 },
      { time: '14:20', revenue: 456, orders: 21 }, { time: '14:25', revenue: 398, orders: 18 },
      { time: '14:30', revenue: 342, orders: 16 }, { time: '14:35', revenue: 298, orders: 14 },
      { time: '14:40', revenue: 234, orders: 11 }, { time: '14:45', revenue: 189, orders: 9 },
      { time: '14:50', revenue: 156, orders: 7 }, { time: '14:55', revenue: 123, orders: 6 },
      
      // 3 PM - Afternoon lull with minimal activity
      { time: '15:00', revenue: 89, orders: 4 }, { time: '15:05', revenue: 67, orders: 3 },
      { time: '15:10', revenue: 45, orders: 2 }, { time: '15:15', revenue: 52, orders: 2 },
      { time: '15:20', revenue: 34, orders: 2 }, { time: '15:25', revenue: 23, orders: 1 },
      { time: '15:30', revenue: 41, orders: 2 }, { time: '15:35', revenue: 28, orders: 1 },
      { time: '15:40', revenue: 35, orders: 2 }, { time: '15:45', revenue: 42, orders: 2 },
      { time: '15:50', revenue: 29, orders: 1 }, { time: '15:55', revenue: 38, orders: 2 },
      
      // 4 PM - Late afternoon minimal
      { time: '16:00', revenue: 31, orders: 1 }, { time: '16:05', revenue: 25, orders: 1 },
      { time: '16:10', revenue: 19, orders: 1 }, { time: '16:15', revenue: 27, orders: 1 },
      { time: '16:20', revenue: 33, orders: 2 }, { time: '16:25', revenue: 21, orders: 1 },
      { time: '16:30', revenue: 28, orders: 1 }, { time: '16:35', revenue: 35, orders: 2 },
      { time: '16:40', revenue: 41, orders: 2 }, { time: '16:45', revenue: 38, orders: 2 },
      { time: '16:50', revenue: 44, orders: 2 }, { time: '16:55', revenue: 52, orders: 2 },
      
      // 5 PM - Early dinner gradual pickup
      { time: '17:00', revenue: 67, orders: 3 }, { time: '17:05', revenue: 84, orders: 4 },
      { time: '17:10', revenue: 73, orders: 3 }, { time: '17:15', revenue: 91, orders: 4 },
      { time: '17:20', revenue: 108, orders: 5 }, { time: '17:25', revenue: 127, orders: 6 },
      { time: '17:30', revenue: 145, orders: 7 }, { time: '17:35', revenue: 134, orders: 6 },
      { time: '17:40', revenue: 168, orders: 8 }, { time: '17:45', revenue: 189, orders: 9 },
      { time: '17:50', revenue: 212, orders: 10 }, { time: '17:55', revenue: 234, orders: 11 },
      
      // 6 PM - Dinner rush building with natural growth
      { time: '18:00', revenue: 267, orders: 12 }, { time: '18:05', revenue: 291, orders: 13 },
      { time: '18:10', revenue: 325, orders: 15 }, { time: '18:15', revenue: 342, orders: 16 },
      { time: '18:20', revenue: 378, orders: 17 }, { time: '18:25', revenue: 412, orders: 19 },
      { time: '18:30', revenue: 445, orders: 20 }, { time: '18:35', revenue: 489, orders: 22 },
      { time: '18:40', revenue: 523, orders: 24 }, { time: '18:45', revenue: 567, orders: 26 },
      { time: '18:50', revenue: 598, orders: 27 }, { time: '18:55', revenue: 634, orders: 29 },
      
      // 7 PM - Peak dinner rush with natural spikes
      { time: '19:00', revenue: 712, orders: 32 }, { time: '19:05', revenue: 789, orders: 36 },
      { time: '19:10', revenue: 856, orders: 39 }, { time: '19:15', revenue: 823, orders: 37 },
      { time: '19:20', revenue: 934, orders: 42 }, { time: '19:25', revenue: 1012, orders: 46 },
      { time: '19:30', revenue: 1089, orders: 49 }, { time: '19:35', revenue: 1156, orders: 53 },
      { time: '19:40', revenue: 1234, orders: 56 }, { time: '19:45', revenue: 1167, orders: 53 },
      { time: '19:50', revenue: 1298, orders: 59 }, { time: '19:55', revenue: 1345, orders: 61 },
      
      // 8 PM - Peak continues with variation
      { time: '20:00', revenue: 1412, orders: 64 }, { time: '20:05', revenue: 1378, orders: 63 },
      { time: '20:10', revenue: 1456, orders: 66 }, { time: '20:15', revenue: 1523, orders: 69 },
      { time: '20:20', revenue: 1489, orders: 68 }, { time: '20:25', revenue: 1567, orders: 71 },
      { time: '20:30', revenue: 1634, orders: 74 }, { time: '20:35', revenue: 1598, orders: 73 },
      { time: '20:40', revenue: 1712, orders: 78 }, { time: '20:45', revenue: 1656, orders: 75 },
      { time: '20:50', revenue: 1589, orders: 72 }, { time: '20:55', revenue: 1534, orders: 70 },
      
      // 9 PM - Natural wind down begins
      { time: '21:00', revenue: 1456, orders: 66 }, { time: '21:05', revenue: 1378, orders: 63 },
      { time: '21:10', revenue: 1289, orders: 59 }, { time: '21:15', revenue: 1198, orders: 54 },
      { time: '21:20', revenue: 1089, orders: 49 }, { time: '21:25', revenue: 967, orders: 44 },
      { time: '21:30', revenue: 856, orders: 39 }, { time: '21:35', revenue: 734, orders: 33 },
      { time: '21:40', revenue: 623, orders: 28 }, { time: '21:45', revenue: 534, orders: 24 },
      { time: '21:50', revenue: 445, orders: 20 }, { time: '21:55', revenue: 367, orders: 17 },
      
      // 10 PM - Evening slowdown
      { time: '22:00', revenue: 298, orders: 14 }, { time: '22:05', revenue: 234, orders: 11 },
      { time: '22:10', revenue: 189, orders: 9 }, { time: '22:15', revenue: 156, orders: 7 },
      { time: '22:20', revenue: 123, orders: 6 }, { time: '22:25', revenue: 98, orders: 4 },
      { time: '22:30', revenue: 73, orders: 3 }, { time: '22:35', revenue: 52, orders: 2 },
      { time: '22:40', revenue: 38, orders: 2 }, { time: '22:45', revenue: 29, orders: 1 },
      { time: '22:50', revenue: 21, orders: 1 }, { time: '22:55', revenue: 15, orders: 1 },
      
      // 11 PM - Late night taper
      { time: '23:00', revenue: 12, orders: 1 }, { time: '23:05', revenue: 8, orders: 0 },
      { time: '23:10', revenue: 5, orders: 0 }, { time: '23:15', revenue: 3, orders: 0 },
      { time: '23:20', revenue: 7, orders: 0 }, { time: '23:25', revenue: 2, orders: 0 },
      { time: '23:30', revenue: 4, orders: 0 }, { time: '23:35', revenue: 1, orders: 0 },
      { time: '23:40', revenue: 2, orders: 0 }, { time: '23:45', revenue: 0, orders: 0 },
      { time: '23:50', revenue: 1, orders: 0 }, { time: '23:55', revenue: 0, orders: 0 }
    ];
    
    // Apply day-of-week multiplier and add some natural variation
    return baseFridayData.map(item => ({
      ...item,
      revenue: Math.round(item.revenue * multiplier),
      orders: Math.round(item.orders * multiplier),
      isLive: parseInt(item.time.split(':')[0]) < currentHour || 
              (parseInt(item.time.split(':')[0]) === currentHour && parseInt(item.time.split(':')[1]) <= currentMinute)
    }));
  };

  // Static 5-minute interval data for hourly view - organic sales patterns
  const generate5MinuteData = () => {
    return generateDailySalesData(selectedDate.getDay());
  };

  // Generate daily totals for range charts
  const generateDailyTotals = (startDate: Date, endDate: Date) => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map(day => {
      const dayData = generateDailySalesData(day.getDay());
      const totalRevenue = dayData.reduce((sum, item) => sum + item.revenue, 0);
      const totalOrders = dayData.reduce((sum, item) => sum + item.orders, 0);
      
      return {
        date: format(day, 'MMM dd'),
        fullDate: day,
        revenue: totalRevenue,
        orders: totalOrders,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      };
    });
  };

  // Navigation functions
  const goToPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  // Current week navigation
  const getCurrentWeekDays = () => {
    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);
    return eachDayOfInterval({ start, end });
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

  // Handle layout optimization suggestions
  const handleLayoutSuggestion = (suggestion: LayoutSuggestion) => {
    const { implementation } = suggestion;
    
    setLayoutConfig(prev => ({
      ...prev,
      gridCols: implementation.gridCols || prev.gridCols,
      chartHeight: implementation.chartHeight || prev.chartHeight,
      compactMode: implementation.compactMode ?? prev.compactMode
    }));
  };

  // Dynamic grid class based on AI suggestions and chat state
  const getGridClass = () => {
    if (isSidebarMode && isOpen) {
      return 'grid-cols-1 md:grid-cols-2';
    }
    return layoutConfig.gridCols;
  };

  // Dynamic chart height based on AI suggestions and chat state
  const getChartHeight = () => {
    if (isSidebarMode && isOpen) {
      return 'h-80';
    }
    return layoutConfig.chartHeight;
  };

  return (
    <StandardLayout title="Restaurant Dashboard" subtitle="AI-Powered Command Center">
      <div 
        className={`space-y-6 transition-all duration-300 ${(isSidebarMode && isOpen) ? 'dashboard-chat-sidebar' : ''}`}
      >
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
        <div className={`grid gap-6 ${getGridClass()}`}>
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-normal rock-salt-font">Today's Revenue</CardTitle>
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
              <CardTitle className="text-sm font-normal rock-salt-font">Orders</CardTitle>
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
              <CardTitle className="text-sm font-normal rock-salt-font">Pending Orders</CardTitle>
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
              <CardTitle className="text-sm font-normal rock-salt-font">Average Order Value</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div className="flex items-center gap-2">
                <LineChartIcon className="w-6 h-6" style={{ color: 'hsl(25, 95%, 53%)' }} />
                <span className="text-xl xl:text-2xl rock-salt-font">Sales Performance</span>
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">Live</Badge>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 xl:gap-4">
                {/* Date Navigation */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousDay}
                    className="h-7 px-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-3 text-xs font-medium min-w-[100px] justify-start"
                      >
                        <CalendarIcon className="w-3 h-3 mr-2" />
                        {format(selectedDate, 'MMM dd')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) {
                            setSelectedDate(date);
                            setIsCalendarOpen(false);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextDay}
                    className="h-7 px-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "single" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("single")}
                    className="h-7 px-3 text-xs font-medium"
                  >
                    Daily
                  </Button>
                  <Button
                    variant={viewMode === "range" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("range")}
                    className="h-7 px-3 text-xs font-medium"
                  >
                    Range
                  </Button>
                </div>

                {/* Conditional Controls */}
                <>
                  {/* Chart Timeframe (only show for single day view) */}
                  {viewMode === "single" && (
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
                  )}

                  {/* Date Range Selection (only show for range view) */}
                  {viewMode === "range" && (
                    <div className="flex items-center gap-2">
                      <Popover open={isRangeCalendarOpen} onOpenChange={setIsRangeCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-3 text-xs font-medium min-w-[120px] justify-start"
                          >
                            <CalendarIcon className="w-3 h-3 mr-2" />
                            {dateRange?.from && dateRange?.to 
                              ? `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                              : 'Select range'
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={(range) => {
                              setDateRange(range);
                              if (range?.from && range?.to) {
                                setIsRangeCalendarOpen(false);
                              }
                            }}
                            numberOfMonths={2}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-3 h-3 rounded bg-slate-600"></div>
                      <span className="rock-salt-font">Historical Avg</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-3 h-3 rounded bg-orange-500"></div>
                      <span className="rock-salt-font">{isColumnChart ? 'Live (5min intervals)' : 'Live Performance'}</span>
                    </div>
                    <div className="text-xl font-normal rock-salt-font" style={{ color: 'hsl(25, 95%, 53%)' }}>
                      ${chartData[Math.min(currentHour - 9, chartData.length - 1)]?.revenue || chartData[chartData.length - 1]?.revenue || 0}
                    </div>
                  </div>
                </>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`mb-6 ${getChartHeight()}`}>
              <ResponsiveContainer width="100%" height="100%">
                {viewMode === "range" && dateRange?.from && dateRange?.to ? (
                  // Range view - Trading style line chart
                  <LineChart data={generateDailyTotals(dateRange.from!, dateRange.to!)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date"
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
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-700">
                              <div className="font-normal rock-salt-font text-sm text-orange-300">{label}</div>
                              <div style={{ color: '#f97316' }} className="font-medium">
                                Revenue: ${data.revenue.toLocaleString()}
                              </div>
                              <div style={{ color: '#94a3b8' }} className="font-medium">
                                Orders: {data.orders} • Avg: ${data.avgOrderValue.toFixed(2)}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#f97316', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                ) : isColumnChart ? (
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
                              <div className="font-normal rock-salt-font text-sm text-orange-300">{label}</div>
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
                              <div className="font-normal rock-salt-font text-sm text-orange-300">{label}</div>
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
            <TabsTrigger value="overview" className="flex items-center gap-1 xl:gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-1 xl:gap-2">
              <ChefHat className="w-4 h-4" />
              <span className="hidden sm:inline">Live Orders</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-1 xl:gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Performance</span>
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
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
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