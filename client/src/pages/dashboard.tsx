import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { OperationsAiChat } from "@/components/admin/operations-ai-chat";
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
  const [activePopup, setActivePopup] = useState<'menu' | 'orders' | 'automation' | 'blockchain' | null>(null);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '', category: '' });
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
    <div className="min-h-screen pb-32" style={{ backgroundColor: '#fcfcfc' }}>
      {/* Header */}
      <div className="shadow-sm border-b" style={{ backgroundColor: '#fcfcfc' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center pt-4 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-heading">Dashboard</h1>
              <p className="text-sm text-gray-600">Command Center</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
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
                <CardTitle className="font-heading">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full h-20 flex flex-col gap-2"
                    onClick={() => setActivePopup('menu')}
                  >
                    <Menu className="h-6 w-6" />
                    <span className="text-sm">Manage Menu</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-20 flex flex-col gap-2"
                    onClick={() => setActivePopup('orders')}
                  >
                    <Clock className="h-6 w-6" />
                    <span className="text-sm">View Orders</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-20 flex flex-col gap-2"
                    onClick={() => setActivePopup('automation')}
                  >
                    <Zap className="h-6 w-6" />
                    <span className="text-sm">Automation</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-20 flex flex-col gap-2"
                    onClick={() => setActivePopup('blockchain')}
                  >
                    <Database className="h-6 w-6" />
                    <span className="text-sm">Blockchain</span>
                  </Button>
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
                  <Button onClick={() => setActivePopup('orders')}>Open Order Manager</Button>
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
                  <Button onClick={() => setActivePopup('menu')}>Open Menu Manager</Button>
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
                    <Button variant="outline" onClick={() => toast({ title: "Analytics", description: "Revenue reports coming soon" })}>
                      Revenue Reports
                    </Button>
                    <Button variant="outline" onClick={() => toast({ title: "Analytics", description: "Customer insights coming soon" })}>
                      Customer Insights
                    </Button>
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
                    <Button onClick={() => setActivePopup('blockchain')}>
                      Blockchain Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => toast({ title: "Blockchain", description: "Decentralized services active" })}>
                      Decentralized Services
                    </Button>
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
                    <Button variant="outline" onClick={() => toast({ title: "Settings", description: "General settings coming soon" })}>
                      <Settings className="h-4 w-4 mr-2" />
                      General Settings
                    </Button>
                    <Button variant="outline" onClick={() => setActivePopup('automation')}>
                      <Zap className="h-4 w-4 mr-2" />
                      Automation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Action Popups */}
      <Dialog open={activePopup === 'menu'} onOpenChange={() => setActivePopup(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Menu Management</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Menu Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Item name"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                />
                <Textarea 
                  placeholder="Description"
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                />
                <Input 
                  placeholder="Price"
                  type="number"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                />
                <Input 
                  placeholder="Category"
                  value={newMenuItem.category}
                  onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                />
                <Button onClick={() => toast({ title: "Menu Item", description: "Item would be added to menu" })}>
                  Add Item
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Current Menu Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {Array.isArray(menuItems) && menuItems.slice(0, 5).map((item: any, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">${item.price}</p>
                      </div>
                      <Badge>{item.category}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activePopup === 'orders'} onOpenChange={() => setActivePopup(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Order Management</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{realTimeStats.pendingOrders}</p>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{realTimeStats.ordersToday}</p>
                  <p className="text-sm text-gray-600">Completed Today</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{realTimeStats.activeCustomers}</p>
                  <p className="text-sm text-gray-600">Active Customers</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: "#1247", customer: "Sarah M.", items: "2x Classic Burger", amount: "$32.50", status: "Preparing" },
                    { id: "#1246", customer: "Mike R.", items: "1x Pizza Margherita", amount: "$18.75", status: "Ready" },
                    { id: "#1245", customer: "Alex K.", items: "3x BBQ Wings", amount: "$45.20", status: "Completed" }
                  ].map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-500">{order.customer}</p>
                          </div>
                          <div>
                            <p className="text-sm">{order.items}</p>
                            <p className="text-sm font-medium">{order.amount}</p>
                          </div>
                        </div>
                      </div>
                      <Badge variant={order.status === 'Completed' ? 'default' : order.status === 'Ready' ? 'secondary' : 'outline'}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activePopup === 'automation'} onOpenChange={() => setActivePopup(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Automation Workflows</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Order Notifications", status: "Active", description: "SMS alerts for new orders" },
                { name: "Inventory Tracking", status: "Active", description: "Auto-update stock levels" },
                { name: "Customer Feedback", status: "Paused", description: "Follow-up emails post-meal" },
                { name: "Payment Processing", status: "Active", description: "Automated USDC settlements" }
              ].map((workflow, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{workflow.name}</h4>
                      <Badge variant={workflow.status === 'Active' ? 'default' : 'secondary'}>
                        {workflow.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{workflow.description}</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Configure
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activePopup === 'blockchain'} onOpenChange={() => setActivePopup(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Blockchain Operations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Network</span>
                      <Badge className="bg-green-100 text-green-800">Base Mainnet</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas Price</span>
                      <span>0.001 ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confirmations</span>
                      <span>12/12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>USDC Balance</span>
                      <span className="font-medium">$1,247.50</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { type: "Payment", amount: "+$32.50", time: "2 min ago" },
                      { type: "Payment", amount: "+$18.75", time: "5 min ago" },
                      { type: "Payment", amount: "+$45.20", time: "8 min ago" }
                    ].map((tx, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="text-sm font-medium">{tx.type}</p>
                          <p className="text-xs text-gray-500">{tx.time}</p>
                        </div>
                        <span className="text-green-600 font-medium">{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Chat Interface - Same as OrderFi */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 shadow-2xl safe-area-pb">
        <div className="p-4">
          {/* Voice Wave Animation */}
          <div className="mb-2 flex justify-center">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-orange-400 to-red-500 rounded-full transition-all duration-300"
                  style={{
                    height: showAiAssistant ? `${8 + Math.sin(Date.now() / 200 + i) * 4}px` : '4px',
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Operations AI Chat Interface */}
          <div className="mb-3">
            <div className="relative">
              <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ask Operations AI about orders, menu, analytics..."
                className="w-full pl-10 pr-4 py-3 text-sm bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onFocus={() => setShowAiAssistant(true)}
                readOnly
              />
            </div>
          </div>

          {/* Quick Action Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActivePopup('orders')}
              className="whitespace-nowrap bg-orange-50 text-orange-700 hover:bg-orange-100"
            >
              <Clock className="h-3 w-3 mr-1" />
              View Orders
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActivePopup('menu')}
              className="whitespace-nowrap bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <Menu className="h-3 w-3 mr-1" />
              Manage Menu
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActivePopup('automation')}
              className="whitespace-nowrap bg-purple-50 text-purple-700 hover:bg-purple-100"
            >
              <Zap className="h-3 w-3 mr-1" />
              Automation
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActivePopup('blockchain')}
              className="whitespace-nowrap bg-green-50 text-green-700 hover:bg-green-100"
            >
              <Database className="h-3 w-3 mr-1" />
              Blockchain
            </Button>
          </div>
        </div>
      </div>

      {/* AI Operations Assistant Dialog */}
      <OperationsAiChat 
        isOpen={showAiAssistant} 
        onClose={() => setShowAiAssistant(false)} 
      />
    </div>
  );
}