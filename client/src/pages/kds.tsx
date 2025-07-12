import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Clock, ChefHat, AlertCircle, CheckCircle2, X, Utensils } from 'lucide-react';

interface Order {
  id: number;
  tableNumber: string;
  customerName: string;
  items: string;
  status: string;
  createdAt: string;
  total: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  modifications?: string[];
}

const KDS_STATUSES = {
  pending: { label: 'New', color: 'bg-red-500', icon: AlertCircle },
  preparing: { label: 'Preparing', color: 'bg-yellow-500', icon: ChefHat },
  ready: { label: 'Ready', color: 'bg-green-500', icon: CheckCircle2 },
  completed: { label: 'Completed', color: 'bg-gray-500', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-red-700', icon: X }
};

export default function KDS() {
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Fetch active orders with real-time polling
  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['/api/kds/orders'],
    refetchInterval: 3000, // Poll every 3 seconds for real-time updates
    staleTime: 0, // Always consider data stale for real-time updates
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest(`/api/kds/orders/${id}/status`, {
        method: 'PATCH',
        body: { status }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kds/orders'] });
    }
  });

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const parseOrderItems = (itemsJson: string): OrderItem[] => {
    try {
      return JSON.parse(itemsJson);
    } catch {
      return [];
    }
  };

  const getTimeSinceOrder = (createdAt: string): string => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m ago`;
  };

  const getNextStatus = (currentStatus: string): string => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'completed'
    };
    return statusFlow[currentStatus] || 'completed';
  };

  const getStatusConfig = (status: string) => {
    return KDS_STATUSES[status] || KDS_STATUSES.pending;
  };

  const getOrderPriority = (createdAt: string): 'high' | 'medium' | 'normal' => {
    const now = new Date();
    const orderTime = new Date(createdAt);
    const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffMinutes > 30) return 'high';
    if (diffMinutes > 15) return 'medium';
    return 'normal';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Error loading orders</div>
      </div>
    );
  }

  // Group orders by status for better organization
  const groupedOrders = orders.reduce((acc, order) => {
    const status = order.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const statusOrder = ['pending', 'preparing', 'ready'];
  const activeOrders = statusOrder.flatMap(status => groupedOrders[status] || []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-full">
            <ChefHat className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Kitchen Display System
            </h1>
            <p className="text-sm text-gray-600">
              {currentTime.toLocaleTimeString()} • {orders.length} active orders
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live
          </Badge>
          {orders.length > 0 && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              <Utensils className="w-3 h-3 mr-1" />
              {orders.length} orders
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;
          const orderItems = parseOrderItems(order.items);
          const priority = getOrderPriority(order.createdAt);
          
          return (
            <Card 
              key={order.id} 
              className={`relative hover:shadow-lg transition-shadow ${
                priority === 'high' ? 'ring-2 ring-red-200 bg-red-50' :
                priority === 'medium' ? 'ring-1 ring-yellow-200 bg-yellow-50' :
                'bg-white'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Order #{order.id}
                  </CardTitle>
                  <Badge className={`${statusConfig.color} text-white`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">Table: {order.tableNumber}</span>
                  <span>•</span>
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className={priority === 'high' ? 'text-red-600 font-medium' : ''}>
                    {getTimeSinceOrder(order.createdAt)}
                  </span>
                  <span>•</span>
                  <span className="font-medium">${order.total}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2 mb-4">
                  {orderItems.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-gray-900">
                        <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs mr-2">
                          {item.quantity}x
                        </span>
                        {item.name}
                      </div>
                      {item.modifications && item.modifications.length > 0 && (
                        <div className="text-sm text-gray-600 mt-2 pl-2 border-l-2 border-gray-200">
                          {item.modifications.map((mod, modIndex) => (
                            <span key={modIndex} className="block">
                              • {mod}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
                      disabled={updateStatusMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      {order.status === 'pending' && 'Start Preparing'}
                      {order.status === 'preparing' && 'Mark Ready'}
                      {order.status === 'ready' && 'Complete'}
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        disabled={updateStatusMutation.isPending}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No active orders
            </h3>
            <p className="text-gray-500">
              New orders will appear here automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
}