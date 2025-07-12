import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  ChefHat,
  Users,
  MapPin,
  Bell,
  RefreshCw,
  Eye,
  MoreHorizontal,
  Phone,
  MessageSquare,
  X
} from 'lucide-react';

interface LiveOrder {
  id: string;
  customerName: string;
  items: string[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  timeElapsed: number; // in minutes
  table?: string;
  priority: 'normal' | 'high' | 'urgent';
  total: number;
  estimatedTime: number;
  specialInstructions?: string;
}

interface Alert {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

interface OperationalViewProps {
  liveOrders: LiveOrder[];
  alerts: Alert[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onOrderAction?: (orderId: string, action: string) => void;
  onDismissAlert?: (alertId: string) => void;
  className?: string;
}

export const OperationalView: React.FC<OperationalViewProps> = ({
  liveOrders,
  alerts,
  isLoading = false,
  onRefresh,
  onOrderAction,
  onDismissAlert,
  className = ""
}) => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getStatusIcon = (status: LiveOrder['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'preparing': return <ChefHat className="h-4 w-4 text-blue-500" />;
      case 'ready': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: LiveOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'preparing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'delivered': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: LiveOrder['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-300';
      case 'normal': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-300';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <Bell className="h-4 w-4 text-orange-500" />;
      case 'info': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'urgent': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'warning': return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800';
      case 'info': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatTime = (minutes: number) => {
    return `${minutes}m`;
  };

  const isOrderOverdue = (order: LiveOrder) => {
    return order.timeElapsed > order.estimatedTime;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold playwrite-font bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Live Operations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time order management and alerts
          </p>
        </div>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="h-11 min-w-[44px] px-4"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        )}
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-red-800 dark:text-red-200 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Critical Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {alert.actions?.map((action, idx) => (
                        <Button
                          key={idx}
                          onClick={action.onClick}
                          size="sm"
                          variant="outline"
                          className="h-9 min-w-[44px] text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                      <Button
                        onClick={() => onDismissAlert?.(alert.id)}
                        size="sm"
                        variant="ghost"
                        className="h-9 w-9 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <ChefHat className="h-5 w-5 mr-2" />
            Live Orders ({liveOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {liveOrders.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">All orders completed!</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {liveOrders.map((order) => (
                  <Card
                    key={order.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedOrder === order.id ? 'ring-2 ring-blue-500' : ''
                    } ${isOrderOverdue(order) ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : ''}`}
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(order.status)}
                              <span className="font-medium text-sm">
                                Order #{order.id}
                              </span>
                            </div>
                            <Badge variant="secondary" className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(order.priority)}>
                              {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{order.customerName}</span>
                              {order.table && (
                                <>
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>Table {order.table}</span>
                                </>
                              )}
                            </div>
                            <div className="text-muted-foreground">
                              {order.items.slice(0, 3).join(', ')}
                              {order.items.length > 3 && ` +${order.items.length - 3} more`}
                            </div>
                            <div className="flex items-center space-x-4 text-xs">
                              <span className={isOrderOverdue(order) ? 'text-red-600' : 'text-muted-foreground'}>
                                Time: {formatTime(order.timeElapsed)} / {formatTime(order.estimatedTime)}
                              </span>
                              <span className="text-muted-foreground">
                                Total: {formatCurrency(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Show order actions menu
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Expanded Order Details */}
                      {selectedOrder === order.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="space-y-3">
                            {order.specialInstructions && (
                              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                  Special Instructions:
                                </p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                  {order.specialInstructions}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-2">
                              <Button
                                onClick={() => onOrderAction?.(order.id, 'view')}
                                size="sm"
                                variant="outline"
                                className="h-11 min-w-[44px]"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              <Button
                                onClick={() => onOrderAction?.(order.id, 'call')}
                                size="sm"
                                variant="outline"
                                className="h-11 min-w-[44px]"
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Call Customer
                              </Button>
                              <Button
                                onClick={() => onOrderAction?.(order.id, 'message')}
                                size="sm"
                                variant="outline"
                                className="h-11 min-w-[44px]"
                              >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Send Update
                              </Button>
                              {order.status === 'preparing' && (
                                <Button
                                  onClick={() => onOrderAction?.(order.id, 'ready')}
                                  size="sm"
                                  className="h-11 min-w-[44px] bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Ready
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OperationalView;