import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { OperationsAiChat } from "@/components/admin/operations-ai-chat";
import { Link } from "wouter";
import { 
  DollarSign, 
  Clock, 
  Users, 
  ShoppingCart, 
  Settings,
  Plus,
  Minus,
  CreditCard,
  Wallet,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Bot,
  MessageCircle,
  Menu,
  Database,
  Activity,
  TrendingUp,
  Calendar,
  Bell,
  FileText,
  BarChart3,
  Globe,
  Shield,
  Coins
} from "lucide-react";

export default function RestaurantDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({
    ordersToday: 47,
    revenue: 1247.50,
    avgOrderValue: 26.54,
    customerSatisfaction: 4.8,
    pendingOrders: 3,
    activeCustomers: 12
  });

  // Get menu items
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ['/api/restaurants/1/menu'],
  });

  // Get recent orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/restaurants/1/orders'],
  });

  // Get restaurant info
  const { data: restaurant } = useQuery({
    queryKey: ['/api/restaurants/1'],
  });

  // Calculate quick stats
  const totalMenuItems = Array.isArray(menuItems) ? menuItems.length : 0;
  const categoriesCount = Array.isArray(menuItems) 
    ? new Set(menuItems.map((item: any) => item.category)).size 
    : 0;
  const avgPrice = Array.isArray(menuItems) && menuItems.length > 0 
    ? (menuItems.reduce((sum: number, item: any) => sum + parseFloat(item.price), 0) / menuItems.length).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Dashboard</h1>
              <p className="text-sm text-gray-600">{(restaurant as any)?.name || "Mimi's Restaurant"} • Back Office Command Center</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
              <Button
                onClick={() => setShowAiAssistant(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                      <p className="text-2xl font-bold text-green-600">${realTimeStats.revenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">+12% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Orders Today</p>
                      <p className="text-2xl font-bold text-blue-600">{realTimeStats.ordersToday}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{realTimeStats.pendingOrders} pending</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                      <p className="text-2xl font-bold text-purple-600">${realTimeStats.avgOrderValue}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">+5% this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                      <p className="text-2xl font-bold text-yellow-600">{realTimeStats.customerSatisfaction}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Based on 47 reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/admin/menu">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <Menu className="h-6 w-6" />
                      <span className="text-sm">Manage Menu</span>
                    </Button>
                  </Link>
                  <Link href="/admin/orders">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <Clock className="h-6 w-6" />
                      <span className="text-sm">View Orders</span>
                    </Button>
                  </Link>
                  <Link href="/automation">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <Zap className="h-6 w-6" />
                      <span className="text-sm">Automation</span>
                    </Button>
                  </Link>
                  <Link href="/admin/blockchain">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                      <Database className="h-6 w-6" />
                      <span className="text-sm">Blockchain</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: "#1247", customer: "Sarah M.", amount: "$32.50", status: "Preparing", time: "2 mins ago" },
                    { id: "#1246", customer: "Mike R.", amount: "$18.75", status: "Ready", time: "5 mins ago" },
                    { id: "#1245", customer: "Alex K.", amount: "$45.20", status: "Completed", time: "8 mins ago" },
                  ].map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{order.id} - {order.customer}</p>
                        <p className="text-xs text-gray-500">{order.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{order.amount}</p>
                        <Badge 
                          variant={order.status === 'Completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">POS System</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Processing</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blockchain Integration</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Assistant</span>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Automation Workflows</span>
                    <Badge className="bg-blue-100 text-blue-800">4 Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Advanced order management interface</p>
                  <Link href="/admin/orders">
                    <Button>Open Order Manager</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Menu className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{totalMenuItems}</p>
                  <p className="text-sm text-gray-600">Total Items</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{categoriesCount}</p>
                  <p className="text-sm text-gray-600">Categories</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">${avgPrice}</p>
                  <p className="text-sm text-gray-600">Avg Price</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Menu Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Menu className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Manage your restaurant menu items</p>
                  <Link href="/admin/menu">
                    <Button>Open Menu Manager</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Detailed analytics and reporting</p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/admin/payments">
                      <Button variant="outline">Revenue Reports</Button>
                    </Link>
                    <Link href="/admin/rewards">
                      <Button variant="outline">Customer Insights</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blockchain Tab */}
          <TabsContent value="blockchain" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Manage Web3 features and blockchain operations</p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/admin/blockchain">
                      <Button>Blockchain Dashboard</Button>
                    </Link>
                    <Link href="/decentralized">
                      <Button variant="outline">Decentralized Services</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Configure restaurant operations</p>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      General Settings
                    </Button>
                    <Link href="/automation">
                      <Button variant="outline">
                        <Zap className="h-4 w-4 mr-2" />
                        Automation
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Operations Assistant */}
      {showAiAssistant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full h-[600px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">AI Operations Assistant</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAiAssistant(false)}
              >
                ×
              </Button>
            </div>
            <div className="flex-1 p-4">
              <OperationsAiChat />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}