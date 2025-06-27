import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  ChefHat, 
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  tableNumber: string;
  items: string;
  total: string;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  averageOrderValue: number;
}

export function RestaurantDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Fetch orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/orders/restaurant/1'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update order status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders/restaurant/1'] });
    }
  });

  // Calculate dashboard statistics
  const calculateStats = (): DashboardStats => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter((order: Order) => 
      new Date(order.createdAt).toDateString() === today
    );

    return {
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum: number, order: Order) => 
        sum + parseFloat(order.total), 0
      ),
      pendingOrders: orders.filter((order: Order) => 
        ['pending', 'confirmed', 'preparing'].includes(order.status)
      ).length,
      averageOrderValue: todayOrders.length > 0 
        ? todayOrders.reduce((sum: number, order: Order) => 
            sum + parseFloat(order.total), 0
          ) / todayOrders.length 
        : 0
    };
  };

  const stats = calculateStats();

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'preparing': return <ChefHat className="h-4 w-4" />;
      case 'ready': return <Bell className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow = {
      'pending': 'confirmed',
      'confirmed': 'preparing',
      'preparing': 'ready',
      'ready': 'delivered'
    };
    return statusFlow[currentStatus as keyof typeof statusFlow] || null;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
        <Badge variant="outline" className="text-green-600 border-green-300">
          Live Updates
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Today's Orders</p>
                <p className="text-2xl font-bold">{stats.todayOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold">${stats.todayRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold">${stats.averageOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Management */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter((order: Order) => 
                    !['delivered', 'cancelled'].includes(order.status)
                  )
                  .map((order: Order) => {
                    const orderItems = JSON.parse(order.items || '[]');
                    const nextStatus = getNextStatus(order.status);
                    
                    return (
                      <div 
                        key={order.id} 
                        className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold">Order #{order.id}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              <span className="flex items-center space-x-1">
                                {getStatusIcon(order.status)}
                                <span className="capitalize">{order.status}</span>
                              </span>
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${order.total}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Customer</p>
                            <p className="font-medium">{order.customerName}</p>
                            {order.tableNumber && (
                              <p className="text-sm text-gray-500">Table {order.tableNumber}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Items</p>
                            <div className="text-sm space-y-1">
                              {orderItems.slice(0, 2).map((item: any, index: number) => (
                                <p key={index}>{item.quantity}x {item.name}</p>
                              ))}
                              {orderItems.length > 2 && (
                                <p className="text-gray-500">+{orderItems.length - 2} more items</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {nextStatus && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(order.id, nextStatus)}
                              disabled={updateStatusMutation.isPending}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                            </Button>
                          )}
                          {order.status !== 'cancelled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              disabled={updateStatusMutation.isPending}
                              className="text-red-600 hover:text-red-700"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders
                  .filter((order: Order) => 
                    ['delivered', 'cancelled'].includes(order.status)
                  )
                  .slice(0, 10)
                  .map((order: Order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <Badge className={getStatusColor(order.status)}>
                            <span className="capitalize">{order.status}</span>
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${order.total}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 20).map((order: Order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          <span className="capitalize">{order.status}</span>
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.total}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}