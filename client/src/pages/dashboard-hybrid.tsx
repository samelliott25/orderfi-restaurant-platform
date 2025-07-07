import { useState, useEffect } from "react";
import { StandardLayout } from "@/components/StandardLayout";
import { useTheme } from "@/components/theme-provider";
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
  Filter
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Generate comprehensive sales data for different periods
const generateSalesData = (period: string) => {
  const now = new Date();
  const data = [];
  
  switch (period) {
    case '24H':
      // 24-hour hourly data
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        const baseRevenue = Math.sin((23 - i) * Math.PI / 12) * 800 + 1000;
        const variation = (Math.random() - 0.5) * 300;
        data.push({
          time: hour.toISOString().split('T')[1].substr(0, 5),
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
    <StandardLayout title="" subtitle="">
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground playwrite-font">OrderFi Restaurant #1</h1>
                <p className="text-sm text-muted-foreground">Live Dashboard • {currentTime.toLocaleTimeString()}</p>
              </div>
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
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Today</CardTitle>
                <DollarSign className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(metrics.revenue.current)}</div>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
                <ShoppingCart className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metrics.orders.current}</div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+{metrics.orders.change}%</span>
                  <span className="text-muted-foreground">vs yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
                <Users className="w-4 h-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metrics.customers.current}</div>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+{metrics.customers.change}%</span>
                  <span className="text-muted-foreground">vs yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order</CardTitle>
                <Target className="w-4 h-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(metrics.avgOrder.current)}</div>
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
              <h2 className="text-xl font-semibold text-foreground playwrite-font">Revenue Performance</h2>
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
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="time" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
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
                <CardTitle className="text-foreground playwrite-font flex items-center gap-2">
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
                          <div className="text-sm font-medium text-foreground">{order.id}</div>
                          <div className="text-xs text-muted-foreground">{order.customer} • {order.items}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">{formatCurrency(order.total)}</div>
                        <div className="text-xs text-muted-foreground">{order.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground playwrite-font flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-16 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                    <div className="text-center">
                      <Package className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm">Inventory</div>
                    </div>
                  </Button>
                  <Button className="h-16 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <div className="text-center">
                      <CreditCard className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm">Payments</div>
                    </div>
                  </Button>
                  <Button className="h-16 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                    <div className="text-center">
                      <Users className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm">Staff</div>
                    </div>
                  </Button>
                  <Button className="h-16 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                    <div className="text-center">
                      <BarChart3 className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm">Reports</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}