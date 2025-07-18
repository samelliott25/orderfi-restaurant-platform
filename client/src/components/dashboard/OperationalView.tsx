import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ChefHat,
  Wifi,
  WifiOff,
  Zap,
  Bell,
  X,
  RefreshCw,
  Users,
  Package,
  DollarSign,
  Timer
} from 'lucide-react';

interface LiveOrder {
  id: string;
  customerName: string;
  items: string[];
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  tableNumber: string;
  timeElapsed: number;
  priority: 'high' | 'medium' | 'normal';
  total: number;
}

interface Alert {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick: () => void;
}

export function OperationalView() {
  const [wsConnected, setWsConnected] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch live orders (no automatic refresh)
  const { data: liveOrders, isLoading: ordersLoading } = useQuery<LiveOrder[]>({
    queryKey: ['/api/dashboard/live-orders'],
    // Removed refetchInterval to prevent dashboard refreshes
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setWsConnected(true);
        ws.send(JSON.stringify({
          type: 'subscribe',
          payload: { channel: 'operational-alerts' }
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'alert') {
            setAlerts(prev => [data.payload, ...prev.slice(0, 4)]);
          }
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };
      
      ws.onclose = () => {
        setWsConnected(false);
      };
      
      return () => {
        ws.close();
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }, []);

  // Order status update mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return apiRequest(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: { status }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/live-orders'] });
      toast({
        title: "Order Updated",
        description: "Order status updated successfully",
      });
    }
  });

  // Default data for development
  const defaultOrders: LiveOrder[] = [
    {
      id: '1234',
      customerName: 'John Doe',
      items: ['Buffalo Wings', 'Caesar Salad'],
      status: 'preparing',
      tableNumber: 'A3',
      timeElapsed: 12,
      priority: 'normal',
      total: 28.50
    },
    {
      id: '1235',
      customerName: 'Jane Smith',
      items: ['Beef Burger', 'Fries', 'Coke'],
      status: 'pending',
      tableNumber: 'B2',
      timeElapsed: 35,
      priority: 'high',
      total: 24.75
    },
    {
      id: '1236',
      customerName: 'Mike Johnson',
      items: ['Fish Tacos', 'Guacamole'],
      status: 'ready',
      tableNumber: 'C1',
      timeElapsed: 8,
      priority: 'medium',
      total: 18.00
    }
  ];

  const defaultAlerts: Alert[] = [
    {
      id: '1',
      type: 'urgent',
      title: 'Low Stock Alert',
      message: 'Buffalo wings running low (5 portions left)',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '2',
      type: 'warning',
      title: 'Order Delayed',
      message: 'Table A3 order exceeded 30 minutes',
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    },
    {
      id: '3',
      type: 'info',
      title: 'Peak Hours',
      message: 'Lunch rush starting - expect high order volume',
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    }
  ];

  const currentOrders = liveOrders || defaultOrders;
  const currentAlerts = alerts.length > 0 ? alerts : defaultAlerts;

  const quickActions: QuickAction[] = [
    {
      id: 'inventory',
      label: 'Stock Check',
      icon: Package,
      color: 'bg-blue-500',
      onClick: () => window.location.href = '/inventory'
    },
    {
      id: 'kds',
      label: 'Kitchen Display',
      icon: ChefHat,
      color: 'bg-orange-500',
      onClick: () => window.location.href = '/kds'
    },
    {
      id: 'payments',
      label: 'Process Payment',
      icon: DollarSign,
      color: 'bg-green-500',
      onClick: () => window.location.href = '/payments'
    },
    {
      id: 'staff',
      label: 'Staff Schedule',
      icon: Users,
      color: 'bg-purple-500',
      onClick: () => window.location.href = '/staff'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'preparing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      default: return 'border-l-4 border-gray-300';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <Bell className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold playwrite-font text-gray-900 dark:text-white">
            Operations Center
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Live orders, alerts, and quick actions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {wsConnected ? (
            <div className="flex items-center space-x-1 text-green-600">
              <Wifi className="w-4 h-4" />
              <span className="text-sm font-medium">Live Updates</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600">
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Critical Alerts */}
      {currentAlerts.length > 0 && (
        <Card className="border-l-4 border-orange-500 bg-orange-50/50 dark:bg-orange-900/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Critical Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Live Orders */}
        <Card className="liquid-glass-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <ChefHat className="h-5 w-5 text-orange-500" />
                <span>Live Orders</span>
              </CardTitle>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                {currentOrders.length} active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {currentOrders.map(order => (
                  <div key={order.id} className={`p-3 rounded-lg border ${getPriorityColor(order.priority)} bg-gray-50 dark:bg-gray-900`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{order.customerName}</span>
                        <Badge variant="outline" className="text-xs">
                          {order.tableNumber}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Timer className="h-3 w-3 mr-1" />
                          {order.timeElapsed}m
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {order.items.join(', ')}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">${order.total.toFixed(2)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderMutation.mutate({
                          orderId: order.id,
                          status: order.status === 'pending' ? 'preparing' : 'ready'
                        })}
                        disabled={updateOrderMutation.isPending}
                        className="h-8 min-h-[32px] text-xs"
                      >
                        {updateOrderMutation.isPending ? (
                          <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <Zap className="h-3 w-3 mr-1" />
                        )}
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="liquid-glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {quickActions.map(action => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="liquid-glass-nav-item h-20 min-h-[80px] flex-col space-y-2 p-4 hover:scale-105 transition-all duration-300"
                    onClick={action.onClick}
                  >
                    <div className={`p-2 rounded-full ${action.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}