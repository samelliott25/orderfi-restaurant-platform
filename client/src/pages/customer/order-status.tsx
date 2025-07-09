import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, ChefHat, Bell, Home, Star } from 'lucide-react';

interface Order {
  id: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  total_cents: number;
  created_at: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price_cents: number;
    modifiers: Array<{
      name: string;
      price_delta: number;
    }>;
  }>;
  customer_info: {
    name: string;
    email: string;
    phone?: string;
  };
}

const STATUS_CONFIG = {
  pending: {
    label: 'Order Received',
    color: 'bg-blue-500',
    icon: CheckCircle,
    description: 'Your order has been received and is being reviewed.'
  },
  preparing: {
    label: 'Being Prepared',
    color: 'bg-orange-500',
    icon: ChefHat,
    description: 'Our kitchen is preparing your delicious meal.'
  },
  ready: {
    label: 'Ready for Pickup',
    color: 'bg-green-500',
    icon: Bell,
    description: 'Your order is ready! Please come to the counter.'
  },
  completed: {
    label: 'Completed',
    color: 'bg-gray-500',
    icon: CheckCircle,
    description: 'Thank you for your order! We hope you enjoyed your meal.'
  }
};

export default function OrderStatus() {
  const { orderId } = useParams();
  const [, navigate] = useLocation();
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ['/api/orders', orderId],
    refetchInterval: 5000, // Poll every 5 seconds
    enabled: !!orderId
  });

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (order?.status === 'completed') {
      // Show feedback form after order is completed
      setTimeout(() => setShowFeedback(true), 1000);
    }
  }, [order?.status]);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusSteps = () => {
    const steps = ['pending', 'preparing', 'ready', 'completed'];
    const currentIndex = steps.indexOf(order?.status || 'pending');
    
    return steps.map((step, index) => ({
      ...STATUS_CONFIG[step as keyof typeof STATUS_CONFIG],
      isActive: index <= currentIndex,
      isCompleted: index < currentIndex,
      isCurrent: index === currentIndex
    }));
  };

  const handleRatingSubmit = async () => {
    try {
      await fetch(`/api/orders/${orderId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      });
      setShowFeedback(false);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center py-8">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-semibold mb-2">Order not found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find your order. Please check your order number.
            </p>
            <Button 
              onClick={() => navigate('/menu')}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              Back to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl rock-salt-font">Order Status</h1>
            <Button
              variant="outline"
              onClick={() => navigate('/menu')}
            >
              <Home className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order #{order.id}</span>
                <Badge variant="outline" className="text-sm">
                  {formatTime(order.created_at)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Status Timeline */}
                <div className="space-y-4">
                  {getStatusSteps().map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${step.isActive ? step.color : 'bg-gray-200'}
                          ${step.isCurrent ? 'ring-4 ring-orange-200' : ''}
                        `}>
                          <Icon className={`w-4 h-4 ${step.isActive ? 'text-white' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${step.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Current Status Highlight */}
                <div className={`
                  p-4 rounded-lg border-2 
                  ${order.status === 'ready' ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}
                `}>
                  <div className="flex items-center space-x-2">
                    <div className={`
                      w-3 h-3 rounded-full animate-pulse
                      ${order.status === 'ready' ? 'bg-green-500' : 'bg-orange-500'}
                    `} />
                    <span className="font-medium">
                      {STATUS_CONFIG[order.status].label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {STATUS_CONFIG[order.status].description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × {formatPrice(item.price_cents)}
                      </p>
                      {item.modifiers.length > 0 && (
                        <div className="mt-1 space-x-1">
                          {item.modifiers.map((modifier, modIndex) => (
                            <Badge key={modIndex} variant="secondary" className="text-xs">
                              {modifier.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="font-medium">
                      {formatPrice((item.price_cents + item.modifiers.reduce((sum, mod) => sum + mod.price_delta, 0)) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total_cents)}</span>
              </div>

              {/* Customer Info */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Customer Information</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Name:</strong> {order.customer_info.name}</p>
                  <p><strong>Email:</strong> {order.customer_info.email}</p>
                  {order.customer_info.phone && (
                    <p><strong>Phone:</strong> {order.customer_info.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-center">How was your meal?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-10 h-10 ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFeedback(false)}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button
                  onClick={handleRatingSubmit}
                  disabled={rating === 0}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}