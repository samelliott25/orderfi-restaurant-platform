import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { useChatContext } from '@/contexts/ChatContext';
import { CustomerAiChat } from '@/components/CustomerAiChat';
import { useQuery } from "@tanstack/react-query";
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
  Activity,
  Zap,
  Star,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Package,
  CreditCard,
  ChefHat,
  Timer,
  TrendingDown,
  Info,
  BarChart3,
  PieChart,
  Wallet,
  Globe,
  Target,
  Award,
  Calendar,
  Filter,
  BookOpen,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// OrderFi Journal Component
const OrderFiJournal = () => {
  const [currentPeriod, setCurrentPeriod] = useState('today');
  
  const { data: journalData, isLoading, refetch } = useQuery({
    queryKey: ['/api/journal/summary', currentPeriod],
    queryFn: async () => {
      const response = await fetch('/api/journal/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: currentPeriod })
      });
      return response.json();
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground rock-salt-font font-normal flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            OrderFi Journal
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">AI-generated daily insights</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Period Selector */}
        <div className="flex gap-2">
          <Button
            variant={currentPeriod === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentPeriod('today')}
            className="text-xs"
          >
            Today
          </Button>
          <Button
            variant={currentPeriod === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentPeriod('week')}
            className="text-xs"
          >
            This Week
          </Button>
        </div>

        {/* AI Summary */}
        <div className="relative">
          {isLoading ? (
            <div className="flex items-center gap-2 p-4 bg-secondary rounded-lg">
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
              <div className="text-sm text-muted-foreground">Generating AI insights...</div>
            </div>
          ) : (
            <div className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground leading-relaxed">
                    {journalData?.summary || journalData?.fallback || "Analyzing today's performance..."}
                  </p>
                  {journalData?.timestamp && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Updated {new Date(journalData.timestamp).toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {journalData?.data && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">Revenue</div>
              <div className="text-lg font-normal text-foreground">
                ${journalData.data.revenue?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">Orders</div>
              <div className="text-lg font-normal text-foreground">
                {journalData.data.orders || 0}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Generate comprehensive sales data for different periods
const generateSalesData = (period: string) => {
  const now = new Date();
  const data = [];
  
  switch (period) {
    case '24H':
      // Operating hours: 9:00 AM to 12:00 AM (15 hours)
      const operatingHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0];
      
      for (let i = 0; i < operatingHours.length; i++) {
        const hour = operatingHours[i];
        const hourData = new Date();
        hourData.setHours(hour, 0, 0, 0);
        
        // Higher revenue during peak hours (11-14 and 18-21)
        let baseRevenue = 600;
        if ((hour >= 11 && hour <= 14) || (hour >= 18 && hour <= 21)) {
          baseRevenue = 1200; // Peak hours
        } else if (hour >= 22 || hour <= 2) {
          baseRevenue = 300; // Late night
        }
        
        const variation = (Math.random() - 0.5) * 200;
        const displayHour = hour === 0 ? '00:00' : 
                          hour < 10 ? `0${hour}:00` : `${hour}:00`;
        
        data.push({
          time: displayHour,
          revenue: Math.max(0, Math.round(baseRevenue + variation)),
          orders: Math.round((baseRevenue + variation) / 25),
          customers: Math.round((baseRevenue + variation) / 35)
        });
      }
      break;
    case '7D':
      // 7-day daily data
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const baseRevenue = 15000 + Math.sin(i * Math.PI / 3) * 3000;
        const variation = (Math.random() - 0.5) * 2000;
        data.push({
          time: day.toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: Math.round(baseRevenue + variation),
          orders: Math.round((baseRevenue + variation) / 25),
          customers: Math.round((baseRevenue + variation) / 35)
        });
      }
      break;
    case '30D':
      // 30-day data
      for (let i = 29; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const baseRevenue = 15000 + Math.sin(i * Math.PI / 15) * 4000;
        const trendFactor = 1 + (29 - i) * 0.01; // Growth trend
        data.push({
          time: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: Math.round(baseRevenue * trendFactor),
          orders: Math.round((baseRevenue * trendFactor) / 25),
          customers: Math.round((baseRevenue * trendFactor) / 35)
        });
      }
      break;
    case '90D':
      // 90-day data (weekly averages)
      for (let i = 12; i >= 0; i--) {
        const week = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        const baseRevenue = 105000 + Math.sin(i * Math.PI / 6) * 15000;
        const trendFactor = 1 + (12 - i) * 0.02;
        data.push({
          time: week.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: Math.round(baseRevenue * trendFactor),
          orders: Math.round((baseRevenue * trendFactor) / 25),
          customers: Math.round((baseRevenue * trendFactor) / 35)
        });
      }
      break;
    default:
      return [];
  }
  
  return data;
};

// Generate live order data
const generateLiveOrders = () => {
  const orderStatuses = ['pending', 'preparing', 'ready', 'completed'];
  const customerNames = ['Sarah M.', 'Mike J.', 'Emma K.', 'John D.', 'Lisa R.', 'Alex T.', 'Maria S.', 'David L.'];
  const menuItems = ['Burger Deluxe', 'Caesar Salad', 'Grilled Chicken', 'Pasta Marinara', 'Fish Tacos', 'Steak Fries', 'Veggie Wrap', 'Club Sandwich'];
  
  return Array.from({ length: 12 }, (_, i) => ({
    id: `ORD-${1000 + i}`,
    customer: customerNames[i % customerNames.length],
    items: menuItems[i % menuItems.length],
    total: Math.round(15 + Math.random() * 45),
    status: orderStatuses[i % orderStatuses.length],
    time: `${Math.floor(Math.random() * 60)}m ago`,
    priority: Math.random() > 0.7 ? 'high' : 'normal'
  }));
};

// Generate performance metrics
const generateMetrics = () => ({
  revenue: {
    current: 18750,
    change: 8.2,
    trend: 'up'
  },
  orders: {
    current: 234,
    change: 12.5,
    trend: 'up'
  },
  customers: {
    current: 189,
    change: 5.8,
    trend: 'up'
  },
  avgOrder: {
    current: 32.45,
    change: -2.1,
    trend: 'down'
  }
});

export default function HybridDashboard() {
  const { theme } = useTheme();
  const { isOpen, setIsOpen, isSidebarMode } = useChatContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('24H');
  const [metrics, setMetrics] = useState(generateMetrics());
  const [salesData, setSalesData] = useState(generateSalesData('24H'));
  const [liveOrders, setLiveOrders] = useState(generateLiveOrders());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update data based on timeframe
  useEffect(() => {
    setSalesData(generateSalesData(timeframe));
  }, [timeframe]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const timeframes = ['24H', '7D', '30D', '90D'];

  return (
    <div className={`min-h-screen bg-background text-foreground transition-all duration-300 ${
      isOpen && isSidebarMode ? 'pr-80' : 'pr-0'
    }`}>
      {/* Header - At Top of Page */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-normal text-foreground rock-salt-font text-[24px]">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Live Dashboard • {currentTime.toLocaleTimeString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              LIVE
            </Badge>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto px-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'orders', label: 'Live Orders', icon: ShoppingCart },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
            { id: 'customers', label: 'Customers', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-normal whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Revenue Today</CardTitle>
              <DollarSign className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-normal text-foreground">{formatCurrency(metrics.revenue.current)}</div>
              <div className="flex items-center gap-1 text-sm">
                {metrics.revenue.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={metrics.revenue.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {metrics.revenue.change > 0 ? '+' : ''}{metrics.revenue.change}%
                </span>
                <span className="text-muted-foreground">vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Orders</CardTitle>
              <ShoppingCart className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-normal text-foreground">{metrics.orders.current}</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-500">+{metrics.orders.change}%</span>
                <span className="text-muted-foreground">vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Customers</CardTitle>
              <Users className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-normal text-foreground">{metrics.customers.current}</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-green-500">+{metrics.customers.change}%</span>
                <span className="text-muted-foreground">vs yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">Avg Order</CardTitle>
              <Target className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-normal text-foreground">{formatCurrency(metrics.avgOrder.current)}</div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingDown className="w-3 h-3 text-red-500" />
                <span className="text-red-500">{metrics.avgOrder.change}%</span>
                <span className="text-muted-foreground">vs yesterday</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-normal text-foreground rock-salt-font">Revenue Performance</h2>
            <div className="flex gap-2">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className={`${
                    timeframe === tf
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-transparent text-muted-foreground border-border hover:bg-secondary'
                  }`}
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#6b7280" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#374151"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#374151"
                      fontSize={12}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--popover-foreground))'
                      }}
                      formatter={(value, name) => [
                        typeof value === 'number' ? formatCurrency(value) : value,
                        name === 'revenue' ? 'Revenue' : 'Orders'
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f97316"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Orders */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground rock-salt-font font-normal flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                Live Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-auto">
                {liveOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                      <div>
                        <div className="text-sm font-normal text-foreground">{order.id}</div>
                        <div className="text-xs text-muted-foreground">{order.customer} • {order.items}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-normal text-foreground">{formatCurrency(order.total)}</div>
                      <div className="text-xs text-muted-foreground">{order.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* OrderFi Journal */}
          <OrderFiJournal />
        </div>
      </div>
      {/* AI Chat Dialog */}
      <CustomerAiChat isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </div>
  );
}