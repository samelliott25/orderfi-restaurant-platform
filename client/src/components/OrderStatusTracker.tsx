import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, Utensils, ShoppingBag, Truck } from 'lucide-react';

interface Order {
  id: number;
  customerName: string;
  items: string;
  total: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface OrderStatusTrackerProps {
  orderId: number;
  onClose?: () => void;
}

export function OrderStatusTracker({ orderId, onClose }: OrderStatusTrackerProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderStatus();
    const interval = setInterval(fetchOrderStatus, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order status');
      }
      const orderData = await response.json();
      setOrder(orderData);
      setError(null);
    } catch (err) {
      setError('Unable to load order status');
      console.error('Order status fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (status: string): number => {
    switch (status) {
      case 'pending': return 10;
      case 'confirmed': return 25;
      case 'preparing': return 60;
      case 'ready': return 85;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'preparing': return <Utensils className="h-5 w-5 text-orange-500" />;
      case 'ready': return <ShoppingBag className="h-5 w-5 text-green-500" />;
      case 'delivered': return <Truck className="h-5 w-5 text-green-600" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstimatedTime = (status: string): string => {
    switch (status) {
      case 'pending': return '2-3 minutes';
      case 'confirmed': return '15-20 minutes';
      case 'preparing': return '10-15 minutes';
      case 'ready': return 'Ready for pickup!';
      case 'delivered': return 'Completed';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading order status...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !order) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <Button onClick={() => fetchOrderStatus()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const orderItems = JSON.parse(order.items || '[]');

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          {getStatusIcon(order.status)}
          <span>Order #{order.id}</span>
        </CardTitle>
        <Badge className={getStatusColor(order.status)}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{getStatusProgress(order.status)}%</span>
          </div>
          <Progress value={getStatusProgress(order.status)} className="w-full" />
        </div>

        {/* Estimated Time */}
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <p className="text-sm text-gray-600">Estimated Time</p>
          <p className="font-semibold text-orange-700">{getEstimatedTime(order.status)}</p>
        </div>

        {/* Order Details */}
        <div className="space-y-2">
          <h4 className="font-semibold">Order Details</h4>
          <div className="text-sm space-y-1">
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Total:</strong> ${order.total}</p>
            <p><strong>Ordered:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-2">
          <h4 className="font-semibold">Items</h4>
          <div className="space-y-1">
            {orderItems.map((item: any, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-2">
          <h4 className="font-semibold">Status Timeline</h4>
          <div className="space-y-2 text-xs">
            {['pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((status, index) => {
              const isCompleted = getStatusProgress(order.status) > getStatusProgress(status);
              const isCurrent = order.status === status;
              
              return (
                <div key={status} className={`flex items-center space-x-2 ${
                  isCompleted ? 'text-green-600' : isCurrent ? 'text-orange-600' : 'text-gray-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isCompleted ? 'bg-green-500' : isCurrent ? 'bg-orange-500' : 'bg-gray-300'
                  }`} />
                  <span className="capitalize">{status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        {onClose && (
          <Button onClick={onClose} variant="outline" className="w-full">
            Close Tracking
          </Button>
        )}
      </CardContent>
    </Card>
  );
}