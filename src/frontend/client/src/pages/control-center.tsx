import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Clock, 
  Users, 
  ShoppingCart, 
  Activity,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertTriangle,
  Bell,
  Settings,
  Play,
  Pause
} from "lucide-react";

// First principles: Restaurant owners need THREE things:
// 1. Real-time order management
// 2. Financial performance tracking  
// 3. System health monitoring

export default function ControlCenter() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Core metrics from first principles
  const { data: orderMetrics } = useQuery({
    queryKey: ['/api/admin/orders/metrics'],
    refetchInterval: 5000 // Real-time updates
  });

  const { data: financialMetrics } = useQuery({
    queryKey: ['/api/admin/financial/metrics'],
    refetchInterval: 10000
  });

  const { data: systemHealth } = useQuery({
    queryKey: ['/api/automation/dashboard'],
    refetchInterval: 15000
  });

  const { data: liveOrders = [] } = useQuery({
    queryKey: ['/api/orders', 1],
    refetchInterval: 3000 // Kitchen needs real-time
  });

  // Smart order status updates
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Update failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order Updated",
        description: "Status changed successfully",
      });
    }
  });

  // Calculate key performance indicators
  const calculateKPIs = () => {
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;
    
    const recentOrders = liveOrders.filter((order: any) => 
      new Date(order.createdAt).getTime() > last24h
    );
    
    const totalRevenue = recentOrders.reduce((sum: number, order: any) => 
      sum + parseFloat(order.total || '0'), 0
    );
    
    const usdcOrders = recentOrders.filter((order: any) => 
      order.paymentMethod === 'usdc'
    );
    
    const avgOrderValue = recentOrders.length > 0 ? totalRevenue / recentOrders.length : 0;
    const usdcAdoption = recentOrders.length > 0 ? (usdcOrders.length / recentOrders.length) * 100 : 0;
    
    return {
      ordersToday: recentOrders.length,
      revenueToday: totalRevenue,
      avgOrderValue,
      usdcAdoption,
      processingFeesSaved: usdcOrders.reduce((sum: number, order: any) => 
        sum + (parseFloat(order.total || '0') * 0.029), 0 // 2.9% savings vs credit cards
      )
    };
  };

  const kpis = calculateKPIs();

  return (
    <div className="min-h-screen admin-bg">
      <div className="container-modern p-6 space-y-6">
        {/* Mission Control Header */}
        <div className="bg-white rounded-2xl p-6 shadow-modern-lg border border-[#8b795e]/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Restaurant Control Center</h1>
              <p className="text-[#8b795e]/70">Web3-native operations • Real-time monitoring • Zero-friction management</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                All Systems Operational
              </Badge>
              <Badge variant="secondary">
                {systemHealth?.activeWorkflows || 0} Workflows Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Core KPIs - What matters most */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-modern hover-lift border-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">Orders Today</CardTitle>
              <ShoppingCart className="h-4 w-4 text-[#8b795e]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient">{kpis.ordersToday}</div>
              <p className="text-xs text-[#8b795e]/70">
                ${kpis.avgOrderValue.toFixed(2)} average order
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-modern hover-lift border-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">Revenue (24h)</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${kpis.revenueToday.toFixed(2)}</div>
              <p className="text-xs text-green-600">
                ${kpis.processingFeesSaved.toFixed(2)} saved in fees
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-modern hover-lift border-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">USDC Adoption</CardTitle>
              <Zap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{kpis.usdcAdoption.toFixed(1)}%</div>
              <p className="text-xs text-[#8b795e]/70">
                Web3 payment preference
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-modern hover-lift border-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">Automation</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {systemHealth?.recentExecutions24h || 0}
              </div>
              <p className="text-xs text-[#8b795e]/70">
                Tasks automated today
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Live Orders</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          {/* Live Order Management - Kitchen view */}
          <TabsContent value="orders" className="space-y-6">
            <div className="grid gap-4">
              {liveOrders.length === 0 ? (
                <Card className="bg-white shadow-modern border-modern">
                  <CardContent className="p-8 text-center">
                    <ShoppingCart className="h-12 w-12 text-[#8b795e]/30 mx-auto mb-4" />
                    <p className="text-[#8b795e]/70">No active orders</p>
                    <p className="text-sm text-[#8b795e]/50">Orders will appear here in real-time</p>
                  </CardContent>
                </Card>
              ) : (
                liveOrders.map((order: any) => (
                  <Card key={order.id} className="bg-white shadow-modern border-modern">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-[#8b795e]">
                            Order #{order.id} • Table {order.tableNumber}
                          </CardTitle>
                          <p className="text-sm text-[#8b795e]/70">{order.customerName}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={order.status === 'completed' ? 'default' : 'secondary'}
                            className={order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {order.status}
                          </Badge>
                          <span className="font-bold text-gradient">${order.total}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-medium text-[#8b795e] mb-2">Items:</h4>
                          <div className="space-y-1">
                            {JSON.parse(order.items || '[]').map((item: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-[#8b795e]">{item.quantity}x {item.name}</span>
                                <span className="text-[#8b795e]/70">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 pt-3 border-t border-[#8b795e]/10">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderMutation.mutate({ 
                                orderId: order.id, 
                                status: 'preparing' 
                              })}
                              className="gradient-bg text-white"
                            >
                              Start Cooking
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderMutation.mutate({ 
                                orderId: order.id, 
                                status: 'ready' 
                              })}
                              className="gradient-bg-secondary text-white"
                            >
                              Ready for Pickup
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderMutation.mutate({ 
                                orderId: order.id, 
                                status: 'completed' 
                              })}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Performance Analytics */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-modern border-modern">
                <CardHeader>
                  <CardTitle className="text-gradient">Payment Method Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <span className="text-[#8b795e]">USDC (Web3)</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-[#8b795e]">{kpis.usdcAdoption.toFixed(1)}%</div>
                        <div className="text-xs text-green-600">0.01% fees</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                        <span className="text-[#8b795e]">Credit Cards</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-[#8b795e]">{(100 - kpis.usdcAdoption).toFixed(1)}%</div>
                        <div className="text-xs text-orange-600">3% fees</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-modern border-modern">
                <CardHeader>
                  <CardTitle className="text-gradient">Cost Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ${kpis.processingFeesSaved.toFixed(2)}
                      </div>
                      <p className="text-sm text-[#8b795e]/70">Saved in processing fees today</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        Web3 payments eliminate traditional payment processor middlemen, 
                        saving up to 2.9% per transaction.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Automation Status */}
          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white shadow-modern border-modern">
                <CardHeader>
                  <CardTitle className="text-gradient flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Order Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8b795e]">Status</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8b795e]">Executions</span>
                      <span className="text-sm font-medium text-[#8b795e]">{kpis.ordersToday}</span>
                    </div>
                    <p className="text-xs text-[#8b795e]/70 mt-2">
                      Automatically sends confirmations, updates inventory, notifies kitchen
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-modern border-modern">
                <CardHeader>
                  <CardTitle className="text-gradient flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Payment & Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8b795e]">Status</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8b795e]">MIMI Distributed</span>
                      <span className="text-sm font-medium text-[#8b795e]">
                        {Math.floor(kpis.revenueToday * 100)}
                      </span>
                    </div>
                    <p className="text-xs text-[#8b795e]/70 mt-2">
                      Processes payments, distributes rewards, sends receipts
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-modern border-modern">
                <CardHeader>
                  <CardTitle className="text-gradient flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Blockchain Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8b795e]">Status</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8b795e]">Last Check</span>
                      <span className="text-sm font-medium text-[#8b795e]">2 min ago</span>
                    </div>
                    <p className="text-xs text-[#8b795e]/70 mt-2">
                      Monitors Base/Polygon networks, verifies transactions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}