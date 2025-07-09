import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  ChefHat, 
  Truck, 
  CheckCircle, 
  Star,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

interface Order {
  id: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  estimatedTime: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  orderNumber: string;
  createdAt: string;
}

interface StatusTrackerProps {
  orderId: string;
}

export function StatusTracker({ orderId }: StatusTrackerProps) {
  const [, navigate] = useLocation();
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: [`/api/orders/${orderId}`],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Order not found');
      }
      return response.json();
    },
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'preparing': return 50;
      case 'ready': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  const statusSteps = [
    { key: 'pending', label: 'Order Received', icon: Clock },
    { key: 'preparing', label: 'Being Prepared', icon: ChefHat },
    { key: 'ready', label: 'Ready for Pickup', icon: Truck },
    { key: 'completed', label: 'Completed', icon: CheckCircle },
  ];

  const handleRatingSubmit = async () => {
    try {
      await fetch(`/api/orders/${orderId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating }),
      });
      setShowFeedback(false);
      // Show success message
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order status...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Order not found</p>
          <Button onClick={() => navigate('/menu')}>
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/menu')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Menu</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Order Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Order #{order.orderNumber}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Placed at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Status Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Order Progress</h3>
                <span className="text-sm text-muted-foreground">
                  {getStatusProgress(order.status)}% Complete
                </span>
              </div>
              
              <Progress value={getStatusProgress(order.status)} className="h-2" />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {statusSteps.map((step) => {
                  const IconComponent = step.icon;
                  const isActive = order.status === step.key;
                  const isCompleted = getStatusProgress(order.status) > getStatusProgress(step.key);
                  
                  return (
                    <div
                      key={step.key}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                        isActive 
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
                          : isCompleted 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        isActive 
                          ? 'bg-orange-500 text-white' 
                          : isCompleted 
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-orange-700 dark:text-orange-300' : 
                          isCompleted ? 'text-green-700 dark:text-green-300' : ''
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estimated Time */}
        {order.status !== 'completed' && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <h3 className="font-semibold mb-1">Estimated Time</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {order.estimatedTime} min
                </p>
                <p className="text-sm text-muted-foreground">
                  We'll notify you when your order is ready
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium">{item.quantity}x</span>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        {order.status === 'completed' && !showFeedback && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold mb-2">Order Completed!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Thank you for your order. How was your experience?
                </p>
                <Button
                  onClick={() => setShowFeedback(true)}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                >
                  Leave Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rating Modal */}
        {showFeedback && (
          <Card>
            <CardHeader>
              <CardTitle>Rate Your Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    </Button>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFeedback(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRatingSubmit}
                    disabled={rating === 0}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}