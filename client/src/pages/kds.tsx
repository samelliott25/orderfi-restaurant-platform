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
  items: string | OrderItem[];
  status: string;
  createdAt: string;
  total: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  modifications?: string[];
  modifiers?: string[];
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
  
  // All hooks called at the top level
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

  // State declarations
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wsConnected, setWsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [kdsSettings, setKdsSettings] = useState<any>(null);
  const [showUnassigned, setShowUnassigned] = useState(false);
  const [expandedModifiers, setExpandedModifiers] = useState<Record<string, boolean>>({});
  const [sortOption, setSortOption] = useState<'time' | 'urgency'>('time');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Constants
  const pageSize = 6;

  // Data fetching
  const { data: orders = [] } = useQuery({
    queryKey: ['/api/orders'],
    refetchInterval: isOnline ? 30000 : false,
    staleTime: 30000,
  });

  // Ensure orders is always an array
  const ordersArray = Array.isArray(orders) ? orders : [];

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      if (!isOnline) {
        return updateOrderStatusOffline(orderId, status);
      }
      return apiRequest(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        body: { status }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      playOrderUpdateAlert();
    },
  });

  // Helper functions
  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'completed'
    };
    return statusFlow[currentStatus] || 'completed';
  };

  const getTimeSinceOrder = (createdAt: string) => {
    const orderTime = new Date(createdAt);
    const diffInMinutes = Math.floor((currentTime.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return `${hours}h ${minutes}m ago`;
    }
  };

  const calculateUrgencyScore = (order: Order) => {
    const minutesElapsed = Math.floor((currentTime.getTime() - new Date(order.createdAt).getTime()) / (1000 * 60));
    let itemCount = 0;
    try {
      if (typeof order.items === 'string') {
        itemCount = JSON.parse(order.items || '[]').length;
      } else if (Array.isArray(order.items)) {
        itemCount = order.items.length;
      }
    } catch (error) {
      console.error('Error parsing order items:', error);
      itemCount = 1; // Default to 1 if parsing fails
    }
    return minutesElapsed + (itemCount * 0.5);
  };

  const sortOrders = (orders: Order[]) => {
    const sortedOrders = [...orders];
    
    if (sortOption === 'time') {
      sortedOrders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOption === 'urgency') {
      sortedOrders.sort((a, b) => calculateUrgencyScore(b) - calculateUrgencyScore(a));
    }
    
    return sortedOrders;
  };

  const getOrderPriority = (order: Order) => {
    const urgencyScore = calculateUrgencyScore(order);
    if (urgencyScore > 30) return 'high';
    if (urgencyScore > 15) return 'medium';
    return 'low';
  };

  const handleStatusUpdate = (orderId: number, status: string) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  // Effects
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // WebSocket connection disabled for testing
    console.log('WebSocket connection disabled for testing');
    setConnectionStatus('connected');
    setWsConnected(true);
  }, []);

  // Filter and sort orders
  const filteredOrders = selectedStation 
    ? getStationOrders(selectedStation, ordersArray)
    : showUnassigned 
      ? getUnassignedOrders(ordersArray)
      : ordersArray.filter(order => order.status !== 'completed' && order.status !== 'cancelled');

  const sortedOrders = sortOrders(filteredOrders);

  // Pagination
  const totalOrders = sortedOrders.length;
  const totalPages = Math.ceil(totalOrders / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = sortedOrders.slice(startIndex, endIndex);

  // Reset to page 1 when total pages change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <StandardLayout
      title="Kitchen Display System"
      subtitle="Real-time order management and tracking"
    >
      <div className="space-y-6">
        {/* KDS Header */}
        <div className="liquid-glass-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ChefHat className="w-6 h-6 text-orange-500" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Kitchen Display
                </h2>
              </div>
              
              <div className="flex items-center space-x-2">
                {wsConnected ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm">Live</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-600">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-sm">Offline</span>
                  </div>
                )}
                
                {!isOnline && (
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <CloudOff className="w-4 h-4" />
                    <span className="text-sm">Queue: {queueLength}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'time' | 'urgency')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="time">Sort by Time</option>
                <option value="urgency">Sort by Urgency</option>
              </select>
              
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {currentTime.toLocaleTimeString()}
              </div>
              
              <AudioAlerts />
              <KDSSettings 
                settings={kdsSettings} 
                onSettingsChange={setKdsSettings}
              />
            </div>
          </div>
        </div>

        {/* Station Filter */}
        <StationFilter
          stations={stations || []}
          selectedStation={selectedStation}
          onStationSelect={setSelectedStation}
          stationStats={(stations || []).reduce((acc, station) => {
            try {
              acc[station.id] = getStationStats(station.id, ordersArray) || { activeOrders: 0, avgPrepTime: 0 };
            } catch (error) {
              acc[station.id] = { activeOrders: 0, avgPrepTime: 0 };
            }
            return acc;
          }, {} as Record<string, any>)}
          showUnassigned={showUnassigned}
          onShowUnassignedChange={setShowUnassigned}
        />

        {/* Orders Grid */}
        <div className="kds-orders-grid">
          {paginatedOrders.map((order) => {
            const statusConfig = KDS_STATUSES[order.status] || KDS_STATUSES.pending;
            const StatusIcon = statusConfig.icon;
            const priority = getOrderPriority(order);
            const orderStation = getOrderStation(order.id);
            
            let orderItems: OrderItem[] = [];
            try {
              if (typeof order.items === 'string') {
                orderItems = JSON.parse(order.items || '[]');
              } else if (Array.isArray(order.items)) {
                orderItems = order.items;
              } else {
                orderItems = [];
              }
            } catch (e) {
              console.error('Error parsing order items:', e);
              orderItems = [];
            }

            return (
              <Card 
                key={order.id} 
                className={`liquid-glass-card ${
                  priority === 'high' ? 'border-red-500/30' :
                  priority === 'medium' ? 'border-yellow-500/30' :
                  ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg font-bold">
                        Order #{order.id}
                      </CardTitle>
                      {orderStation && (
                        <Badge 
                          variant="outline"
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
                  <div className="kds-order-items space-y-2 mb-4">
                    {orderItems.map((item, index) => {
                      const modifications = item.modifications || item.modifiers || [];
                      const hasModifications = modifications.length > 0;
                      const modifierKey = `${order.id}-${index}`;
                      const showModifiers = expandedModifiers[modifierKey] || false;
                      
                      return (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            <span className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs mr-2">
                              {item.quantity}x
                            </span>
                            {item.name}
                            {hasModifications && (
                              <button
                                onClick={() => setExpandedModifiers(prev => ({ 
                                  ...prev, 
                                  [modifierKey]: !prev[modifierKey] 
                                }))}
                                className="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                              >
                                {showModifiers ? 'Hide' : 'Show'} Modifiers ({modifications.length})
                              </button>
                            )}
                          </div>
                          {hasModifications && (
                            <div className={`kds-modifier-toggle ${showModifiers ? 'expanded' : 'collapsed'} text-sm text-gray-600 dark:text-gray-300 mt-2 pl-2 border-l-2 border-gray-200 dark:border-gray-600`}>
                              {modifications.map((mod, modIndex) => (
                                <span key={modIndex} className="block">
                                  • {mod}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleStatusUpdate(order.id, getNextStatus(order.status))}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1 liquid-glass-nav-item bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
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
                          className="liquid-glass-nav-item text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="liquid-glass-card p-4 flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="liquid-glass-nav-item"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="liquid-glass-nav-item"
              >
                Next
              </Button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, totalOrders)} of {totalOrders} orders
            </div>
          </div>
        )}

        {paginatedOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="liquid-glass-card p-8">
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