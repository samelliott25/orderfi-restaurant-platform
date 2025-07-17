import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Clock, ChefHat, AlertCircle, CheckCircle2, X, Utensils, Wifi, WifiOff, Timer, CloudOff, Cloud } from 'lucide-react';
import StandardLayout from '@/components/StandardLayout';
import { AudioAlerts, useAudioAlerts } from '@/components/AudioAlerts';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import KDSSettings from '@/components/KDSSettings';
import { useStationRouting } from '@/hooks/useStationRouting';
import StationFilter from '@/components/StationFilter';

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
  const [wsConnected, setWsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playNewOrderAlert, playOrderUpdateAlert } = useAudioAlerts();
  const { 
    isOnline, 
    offlineQueue, 
    queueLength,
    updateOrderStatusOffline,
    cacheOrdersForOffline,
    getCachedOrders,
    syncOfflineData
  } = useOfflineMode();
  
  const [kdsSettings, setKdsSettings] = useState<any>(null);
  const [showUnassigned, setShowUnassigned] = useState(false);
  
  const {
    stations,
    selectedStation,
    setSelectedStation,
    autoAssignOrderToStation,
    assignOrderToStation,
    getOrderStation,
    getStationOrders,
    getUnassignedOrders,
    getStationStats
  } = useStationRouting();
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // WebSocket connection management
  useEffect(() => {
    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      setConnectionStatus('connecting');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('KDS WebSocket connected');
        setConnectionStatus('connected');
        setWsConnected(true);
        
        // Subscribe to KDS orders channel
        ws.send(JSON.stringify({
          type: 'subscribe',
          payload: { channel: 'kds-orders' }
        }));
        
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('KDS WebSocket disconnected');
        setConnectionStatus('disconnected');
        setWsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect KDS WebSocket...');
            connectWebSocket();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('KDS WebSocket error:', error);
        setConnectionStatus('disconnected');
        setWsConnected(false);
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'order-status-updated':
        // Play order update alert
        playOrderUpdateAlert();
        // Invalidate and refetch orders when status updates
        queryClient.invalidateQueries({ queryKey: ['/api/kds/orders'] });
        break;
      case 'new-order':
        // Play new order alert
        playNewOrderAlert();
        // New order received
        queryClient.invalidateQueries({ queryKey: ['/api/kds/orders'] });
        break;
      case 'active-orders':
        // Real-time orders data
        queryClient.setQueryData(['/api/kds/orders'], message.payload);
        break;
      case 'subscribed':
        console.log(`Subscribed to channel: ${message.channel}`);
        break;
      case 'error':
        console.error('WebSocket error:', message.message);
        break;
    }
  };
  
  // Fetch active orders with WebSocket fallback to polling and offline support
  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['/api/kds/orders'],
    refetchInterval: wsConnected ? false : 5000, // Only poll when WebSocket is disconnected
    staleTime: wsConnected ? 30000 : 0, // Longer stale time when WebSocket is connected
    enabled: isOnline, // Only fetch when online
    placeholderData: () => {
      // Return cached orders when offline
      if (!isOnline) {
        return getCachedOrders() || [];
      }
      return undefined;
    },
  });

  // Cache orders for offline use whenever they're updated
  useEffect(() => {
    if (orders && orders.length > 0 && isOnline) {
      cacheOrdersForOffline(orders);
    }
  }, [orders, isOnline, cacheOrdersForOffline]);

  // Update order status mutation with offline support
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
    // Try offline update first
    const handledOffline = updateOrderStatusOffline(orderId, newStatus);
    
    if (!handledOffline) {
      // If online, proceed with normal mutation
      updateStatusMutation.mutate({ id: orderId, status: newStatus });
    }
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

  // Auto-assign new orders to stations
  useEffect(() => {
    if (orders && orders.length > 0) {
      orders.forEach(order => {
        if (!getOrderStation(order.id)) {
          const stationId = autoAssignOrderToStation(order);
          if (stationId) {
            assignOrderToStation(order.id, stationId);
          }
        }
      });
    }
  }, [orders, getOrderStation, autoAssignOrderToStation, assignOrderToStation]);

  // Filter orders based on selected station
  const getFilteredOrders = () => {
    if (showUnassigned) {
      return getUnassignedOrders(orders);
    }
    
    if (selectedStation) {
      return getStationOrders(selectedStation, orders);
    }
    
    return orders;
  };

  // Group orders by status for better organization
  const filteredOrders = getFilteredOrders();
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const status = order.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const statusOrder = ['pending', 'preparing', 'ready'];
  const activeOrders = statusOrder.flatMap(status => groupedOrders[status] || []);

  // Generate station stats
  const stationStats = stations.reduce((acc, station) => {
    acc[station.id] = getStationStats(station.id, orders);
    return acc;
  }, {} as Record<string, any>);

  return (
    <StandardLayout title="Kitchen Display System" subtitle="Real-time Order Management">
      <div className="space-y-6">
        {/* Status Bar */}
        <div className="relative overflow-hidden rounded-xl p-6 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                <Utensils className="w-4 h-4 mr-1" />
                {orders.length} active orders
              </p>
              <div className="flex items-center space-x-2">
                {connectionStatus === 'connected' && isOnline ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm font-medium">Real-time</span>
                  </div>
                ) : connectionStatus === 'connecting' ? (
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <Timer className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Connecting...</span>
                  </div>
                ) : !isOnline ? (
                  <div className="flex items-center space-x-1 text-orange-600">
                    <CloudOff className="w-4 h-4" />
                    <span className="text-sm font-medium">Offline Mode</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-600">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-sm font-medium">Disconnected</span>
                  </div>
                )}
                {queueLength > 0 && (
                  <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                    {queueLength} queued
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <AudioAlerts 
                enabled={kdsSettings?.soundEnabled ?? true} 
                volume={kdsSettings?.soundVolume ?? 0.7} 
              />
              <KDSSettings onSettingsChange={setKdsSettings} />
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/kds/orders'] })}
                disabled={updateStatusMutation.isPending}
                className="bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 border-white/20 dark:border-gray-600/20"
              >
                <Clock className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {orders.length > 0 && (
                <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  <Utensils className="w-3 h-3 mr-1" />
                  {orders.length} orders
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Station Filter */}
        <StationFilter
          stations={stations}
          selectedStation={selectedStation}
          onStationSelect={setSelectedStation}
          stationStats={stationStats}
          showUnassigned={showUnassigned}
          onShowUnassignedChange={setShowUnassigned}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            const orderItems = parseOrderItems(order.items);
            const priority = getOrderPriority(order.createdAt);
            const orderStation = getOrderStation(order.id);
            
            return (
              <Card 
                key={order.id} 
                className={`relative hover:shadow-lg transition-shadow ${
                  priority === 'high' ? 'ring-2 ring-red-200 dark:ring-red-800 bg-red-50 dark:bg-red-950/20' :
                  priority === 'medium' ? 'ring-1 ring-yellow-200 dark:ring-yellow-800 bg-yellow-50 dark:bg-yellow-950/20' :
                  'bg-white dark:bg-gray-800'
                }`}
                style={orderStation ? { borderLeft: `4px solid ${orderStation.color}` } : {}}
              >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-semibold">
                      Order #{order.id}
                    </CardTitle>
                    {orderStation && (
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${orderStation.color}15`,
                          borderColor: orderStation.color,
                          color: orderStation.color
                        }}
                      >
                        {orderStation.name}
                      </Badge>
                    )}
                  </div>
                  <Badge className={`${statusConfig.color} text-white`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Table: {order.tableNumber}</span>
                  <span>•</span>
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
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
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs mr-2">
                          {item.quantity}x
                        </span>
                        {item.name}
                      </div>
                      {item.modifications && item.modifications.length > 0 && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 pl-2 border-l-2 border-gray-200 dark:border-gray-600">
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
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
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
                        className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <ChefHat className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                No active orders
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                New orders will appear here automatically
              </p>
            </div>
          </div>
        )}
      </div>
    </StandardLayout>
  );
}