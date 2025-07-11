import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChefHat, 
  Timer, 
  Bell,
  Play,
  Pause,
  RotateCcw,
  User,
  Hash,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KitchenOrder {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  customerName: string;
  items: KitchenOrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served';
  orderTime: string;
  estimatedTime: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  specialInstructions?: string;
}

interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  modifiers: string[];
  notes?: string;
  completed: boolean;
}

export default function KitchenDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch kitchen orders
  const { data: orders = [], isLoading } = useQuery<KitchenOrder[]>({
    queryKey: ['/api/kitchen/orders'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Update order status mutation
  const updateOrderStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      apiRequest(`/api/kitchen/orders/${orderId}/status`, {
        method: 'PATCH',
        body: { status }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kitchen/orders'] });
      toast({
        title: "Order Status Updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update order status.",
        variant: "destructive",
      });
    }
  });

  // Calculate order age in minutes
  const getOrderAge = (orderTime: string) => {
    const orderDate = new Date(orderTime);
    const diffMs = currentTime.getTime() - orderDate.getTime();
    return Math.floor(diffMs / (1000 * 60));
  };

  // Get priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'URGENT' };
      case 'high':
        return { className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', label: 'HIGH' };
      case 'normal':
        return { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'NORMAL' };
      case 'low':
        return { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'LOW' };
      default:
        return { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'NORMAL' };
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'PENDING', icon: Clock };
      case 'preparing':
        return { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'PREPARING', icon: ChefHat };
      case 'ready':
        return { className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'READY', icon: CheckCircle };
      case 'served':
        return { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'SERVED', icon: CheckCircle };
      default:
        return { className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'UNKNOWN', icon: AlertCircle };
    }
  };

  // Sort orders by priority and age
  const sortedOrders = [...orders].sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then by age (oldest first)
    return getOrderAge(b.orderTime) - getOrderAge(a.orderTime);
  });

  // Mock data for demonstration
  const mockOrders: KitchenOrder[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      tableNumber: '5',
      customerName: 'John Doe',
      items: [
        { id: '1', name: 'Burger Deluxe', quantity: 1, modifiers: ['No onions', 'Extra cheese'], completed: false },
        { id: '2', name: 'Fries', quantity: 2, modifiers: ['Large'], completed: false }
      ],
      status: 'pending',
      orderTime: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
      estimatedTime: 15,
      priority: 'normal',
      specialInstructions: 'Customer has allergies to peanuts'
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      tableNumber: '3',
      customerName: 'Jane Smith',
      items: [
        { id: '3', name: 'Pizza Margherita', quantity: 1, modifiers: ['Thin crust'], completed: false },
        { id: '4', name: 'Caesar Salad', quantity: 1, modifiers: ['Dressing on side'], completed: true }
      ],
      status: 'preparing',
      orderTime: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
      estimatedTime: 20,
      priority: 'high'
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      customerName: 'Mike Johnson',
      items: [
        { id: '5', name: 'Grilled Chicken', quantity: 1, modifiers: ['Medium rare'], completed: false }
      ],
      status: 'ready',
      orderTime: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
      estimatedTime: 25,
      priority: 'urgent'
    }
  ];

  const displayOrders = orders.length > 0 ? sortedOrders : mockOrders;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <h1 className="text-3xl font-bold playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Kitchen Display
              </h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Live</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {currentTime.toLocaleTimeString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayOrders.map((order) => {
          const orderAge = getOrderAge(order.orderTime);
          const priorityBadge = getPriorityBadge(order.priority);
          const statusBadge = getStatusBadge(order.status);
          const StatusIcon = statusBadge.icon;

          return (
            <Card 
              key={order.id} 
              className={`relative overflow-hidden backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 ${
                order.priority === 'urgent' ? 'ring-2 ring-red-500 animate-pulse' : ''
              } ${orderAge > order.estimatedTime ? 'ring-2 ring-orange-500' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10"></div>
              
              <CardHeader className="pb-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-lg font-bold">{order.orderNumber}</CardTitle>
                  </div>
                  <Badge className={priorityBadge.className}>
                    {priorityBadge.label}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {order.tableNumber && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>Table {order.tableNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    <span className={orderAge > order.estimatedTime ? 'text-red-600 font-bold' : ''}>
                      {orderAge}m
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 relative">
                {/* Order Items */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className={`p-2 rounded-lg border ${item.completed ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-600'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {item.quantity}x {item.name}
                            </span>
                            {item.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                          </div>
                          {item.modifiers.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.modifiers.join(', ')}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-xs text-orange-600 mt-1 italic">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Special Instructions */}
                {order.specialInstructions && (
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                        {order.specialInstructions}
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Order Actions */}
                <div className="flex items-center justify-between">
                  <Badge className={statusBadge.className}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusBadge.label}
                  </Badge>
                  
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus.mutate({ orderId: order.id, status: 'preparing' })}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus.mutate({ orderId: order.id, status: 'ready' })}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOrderStatus.mutate({ orderId: order.id, status: 'served' })}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Served
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Orders Message */}
      {displayOrders.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Orders in Queue</h3>
          <p className="text-muted-foreground">New orders will appear here automatically</p>
        </div>
      )}
    </div>
  );
}