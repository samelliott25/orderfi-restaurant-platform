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
  Timer
} from "lucide-react";

export default function RestaurantDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real-time data
  const { data: menuItems = [] } = useQuery({
    queryKey: ['/api/restaurants/1/menu'],
    refetchInterval: 30000
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['/api/restaurants/1/orders'],
    refetchInterval: 10000
  });

  // Type-safe orders array
  const typedOrders = Array.isArray(orders) ? orders : [];

  const { data: restaurant } = useQuery({
    queryKey: ['/api/restaurants/1']
  });

  // Calculate real-time metrics
  const todayOrders = typedOrders.filter((order: any) => {
    const orderDate = new Date(order.createdAt || Date.now());
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum: number, order: any) => sum + (parseFloat(order.total) || 0), 0);
  const pendingOrders = typedOrders.filter((order: any) => order.status === 'pending' || order.status === 'preparing').length;
  const avgOrderValue = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;
  const completionRate = typedOrders.length > 0 ? (typedOrders.filter((order: any) => order.status === 'completed').length / typedOrders.length) * 100 : 0;

  return (
    <StandardLayout title="Restaurant Dashboard" subtitle="AI-Powered Command Center">
      <div className="space-y-6">
        
        {/* Header Status Bar */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">System Online</span>
              </div>
              <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                <Wifi className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Main KPI Cards with OrderFi Branding */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Today's Revenue */}
          <Card className="border-slate-200 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-700"
                style={{ background: 'linear-gradient(135deg, hsl(340, 82%, 52%, 0.03), hsl(340, 82%, 52%, 0.01))' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Today's Revenue</CardTitle>
              <DollarSign className="h-5 w-5" style={{ color: 'hsl(340, 82%, 52%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'hsl(340, 82%, 45%)' }}>${todayRevenue.toFixed(2)}</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <p className="text-xs text-green-600 font-medium">+24.3% vs yesterday</p>
              </div>
            </CardContent>
          </Card>

          {/* Orders Today */}
          <Card className="border-slate-200 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-700"
                style={{ background: 'linear-gradient(135deg, hsl(25, 95%, 53%, 0.03), hsl(25, 95%, 53%, 0.01))' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Orders Today</CardTitle>
              <ShoppingCart className="h-5 w-5" style={{ color: 'hsl(25, 95%, 53%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'hsl(25, 95%, 45%)' }}>{todayOrders.length}</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <p className="text-xs text-green-600 font-medium">+12 since morning</p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Orders */}
          <Card className="border-slate-200 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Pending Orders</CardTitle>
              <Clock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{pendingOrders}</div>
              <div className="flex items-center gap-1 mt-1">
                {pendingOrders > 5 ? (
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                ) : (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                )}
                <p className={`text-xs font-medium ${pendingOrders > 5 ? 'text-amber-600' : 'text-green-600'}`}>
                  {pendingOrders > 5 ? 'High volume' : 'Normal flow'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Average Order Value */}
          <Card className="border-slate-200 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-700"
                style={{ background: 'linear-gradient(135deg, hsl(215, 28%, 17%, 0.03), hsl(215, 28%, 17%, 0.01))' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Order Value</CardTitle>
              <TrendingUp className="h-5 w-5" style={{ color: 'hsl(215, 28%, 35%)' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: 'hsl(215, 28%, 30%)' }}>${avgOrderValue.toFixed(2)}</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-green-600" />
                <p className="text-xs text-green-600 font-medium">+8.2% this week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:text-white"
                         style={{ 
                           background: 'data-[state=active]:linear-gradient(135deg, hsl(25, 95%, 53%), hsl(340, 82%, 52%))'
                         }}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ChefHat className="w-4 h-4 mr-2" />
              Live Orders
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <PieChart className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Activity className="w-4 h-4 mr-2" />
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

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-600 dark:text-slate-400 py-8">
                  <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Advanced analytics coming soon...</p>
                  <p className="text-sm">Sales trends, customer insights, and business intelligence</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-slate-600 dark:text-slate-400 py-8">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Performance monitoring coming soon...</p>
                  <p className="text-sm">System metrics, response times, and optimization insights</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StandardLayout>
  );
}