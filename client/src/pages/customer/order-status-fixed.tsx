import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ChefHat, Car, Star, ArrowLeft, Home } from 'lucide-react';

interface OrderStatusProps {
  params: {
    orderId: string;
  };
}

export default function OrderStatus({ params }: OrderStatusProps) {
  const [, navigate] = useLocation();
  const [orderStatus, setOrderStatus] = useState('confirmed');
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [customerInfo, setCustomerInfo] = useState({
    name: 'Guest',
    table: 'Guest'
  });

  useEffect(() => {
    // Load customer info from localStorage
    const sessionId = localStorage.getItem('sessionId');
    const tableName = localStorage.getItem('tableNumber');
    const isGuest = localStorage.getItem('isGuest');
    
    if (!sessionId) {
      navigate('/scan');
      return;
    }

    setCustomerInfo({
      name: isGuest ? 'Guest' : 'Customer',
      table: tableName || 'Guest'
    });

    // Simulate order status progression
    const statusProgression = [
      { status: 'confirmed', time: 0 },
      { status: 'preparing', time: 3000 },
      { status: 'cooking', time: 8000 },
      { status: 'ready', time: 20000 }
    ];

    statusProgression.forEach(({ status, time }) => {
      setTimeout(() => {
        setOrderStatus(status);
        if (status === 'preparing') setEstimatedTime(22);
        if (status === 'cooking') setEstimatedTime(15);
        if (status === 'ready') setEstimatedTime(0);
      }, time);
    });
  }, [navigate]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          title: 'Order Confirmed!',
          description: 'Your order has been received and is being prepared',
          color: 'bg-green-100 text-green-800'
        };
      case 'preparing':
        return {
          icon: <Clock className="w-8 h-8 text-yellow-500" />,
          title: 'Preparing Your Order',
          description: 'Our kitchen team is getting your ingredients ready',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'cooking':
        return {
          icon: <ChefHat className="w-8 h-8 text-orange-500" />,
          title: 'Cooking in Progress',
          description: 'Your delicious meal is being cooked to perfection',
          color: 'bg-orange-100 text-orange-800'
        };
      case 'ready':
        return {
          icon: <Star className="w-8 h-8 text-green-500" />,
          title: 'Order Ready!',
          description: 'Your order is ready for pickup or will be served shortly',
          color: 'bg-green-100 text-green-800'
        };
      default:
        return {
          icon: <Clock className="w-8 h-8 text-gray-500" />,
          title: 'Processing',
          description: 'Processing your order',
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const statusInfo = getStatusInfo(orderStatus);

  const handleNewOrder = () => {
    // Clear session and start fresh
    localStorage.removeItem('cart');
    localStorage.removeItem('tipAmount');
    localStorage.removeItem('tipPercent');
    navigate('/menu');
  };

  const handleRateExperience = () => {
    // In a real app, this would open a rating modal
    alert('Thank you for your feedback! Rating feature coming soon.');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="font-semibold text-lg orderfi-brand">Order Status</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/scan')}
              data-testid="new-order-button"
            >
              <Home className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Order Header */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Order #{params.orderId}</CardTitle>
                <p className="text-muted-foreground">
                  {customerInfo.table} • Placed at {new Date().toLocaleTimeString()}
                </p>
              </div>
              <Badge className={statusInfo.color} data-testid="order-status-badge">
                {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Status Progress */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {statusInfo.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2" data-testid="status-title">
                  {statusInfo.title}
                </h2>
                <p className="text-muted-foreground" data-testid="status-description">
                  {statusInfo.description}
                </p>
              </div>
              
              {estimatedTime > 0 && (
                <div className="mt-4">
                  <p className="text-lg font-semibold" data-testid="estimated-time">
                    Estimated time: {estimatedTime} minutes
                  </p>
                </div>
              )}

              {orderStatus === 'ready' && (
                <div className="mt-6 space-y-3">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      🎉 Your order is ready! Please collect it from the counter or wait for it to be served to your table.
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRateExperience}
                      variant="outline"
                      className="flex-1"
                      data-testid="rate-experience-button"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Rate Experience
                    </Button>
                    <Button
                      onClick={handleNewOrder}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                      data-testid="order-again-button"
                    >
                      Order Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Timeline */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { step: 'confirmed', label: 'Order Confirmed', time: '0 min' },
                { step: 'preparing', label: 'Preparing', time: '2-3 min' },
                { step: 'cooking', label: 'Cooking', time: '15-20 min' },
                { step: 'ready', label: 'Ready', time: '25-30 min' }
              ].map((item, index) => {
                const isCompleted = ['confirmed', 'preparing', 'cooking', 'ready'].indexOf(orderStatus) >= index;
                const isCurrent = ['confirmed', 'preparing', 'cooking', 'ready'][index] === orderStatus;
                
                return (
                  <div key={item.step} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                      isCompleted 
                        ? 'bg-green-500' 
                        : isCurrent 
                          ? 'bg-orange-500 animate-pulse' 
                          : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <p className={`font-medium ${isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Need help with your order?</p>
              <p className="mt-1">
                Please ask your server or call the restaurant directly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}