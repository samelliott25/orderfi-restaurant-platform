import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { User, Clock, ShoppingCart, Star, RotateCcw, Phone, Mail } from "lucide-react";
import { RewardsDashboard } from "./rewards-dashboard";

interface Order {
  id: number;
  items: string;
  total: string;
  status: string;
  createdAt: string;
  paymentMethod?: string;
}

interface UserProfile {
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  totalOrders: number;
  totalSpent: number;
  favoriteItems: string[];
  lastOrderDate?: string;
}

interface UserProfileProps {
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  onReorder?: (items: any[]) => void;
}

export function UserProfile({ 
  customerId, 
  customerName, 
  customerPhone, 
  customerEmail,
  onReorder 
}: UserProfileProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch user's order history
  const { data: orderHistory = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders/customer", customerId],
    queryFn: async (): Promise<Order[]> => {
      const response = await fetch(`/api/orders/customer/${customerId}`);
      if (!response.ok) throw new Error("Failed to fetch order history");
      return response.json();
    },
    enabled: !!customerId
  });

  // Calculate user profile data
  const userProfile: UserProfile = {
    customerId,
    customerName: customerName || "Guest User",
    customerEmail,
    customerPhone,
    totalOrders: orderHistory.length,
    totalSpent: orderHistory.reduce((sum, order) => sum + parseFloat(order.total || "0"), 0),
    favoriteItems: getFavoriteItems(orderHistory),
    lastOrderDate: orderHistory[0]?.createdAt
  };

  // Fast reorder mutation
  const reorderMutation = useMutation({
    mutationFn: async (order: Order) => {
      const orderItems = JSON.parse(order.items || "[]");
      
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: 1, // Default restaurant
          customerName: userProfile.customerName,
          customerEmail: userProfile.customerEmail,
          customerPhone: userProfile.customerPhone,
          items: order.items,
          subtotal: (parseFloat(order.total) * 0.9).toFixed(2), // Approximate subtotal
          tax: (parseFloat(order.total) * 0.1).toFixed(2), // Approximate tax
          total: order.total,
          status: "pending"
        })
      });

      if (!response.ok) throw new Error("Failed to create reorder");
      return response.json();
    },
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders/customer", customerId] });
      setIsReorderDialogOpen(false);
      
      if (onReorder) {
        const orderItems = JSON.parse(selectedOrder?.items || "[]");
        onReorder(orderItems);
      }
    }
  });

  function getFavoriteItems(orders: Order[]): string[] {
    const itemCounts = new Map<string, number>();
    
    orders.forEach(order => {
      try {
        const items = JSON.parse(order.items || "[]");
        items.forEach((item: any) => {
          const name = item.name || "Unknown Item";
          itemCounts.set(name, (itemCounts.get(name) || 0) + 1);
        });
      } catch (error) {
        console.error("Error parsing order items:", error);
      }
    });

    return Array.from(itemCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleQuickReorder = (order: Order) => {
    setSelectedOrder(order);
    setIsReorderDialogOpen(true);
  };

  const confirmReorder = () => {
    if (selectedOrder) {
      reorderMutation.mutate(selectedOrder);
    }
  };

  // Quick suggestions for new users
  const showWelcomeMessage = orderHistory.length === 0;
  const showReturnCustomerFeatures = orderHistory.length > 0;

  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <User className="w-6 h-6" />
            <div>
              <h2 className="text-xl">{userProfile.customerName}</h2>
              {showReturnCustomerFeatures && (
                <p className="text-sm text-gray-600 font-normal">
                  Welcome back! You've ordered {userProfile.totalOrders} times
                </p>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{userProfile.totalOrders}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${userProfile.totalSpent.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {userProfile.favoriteItems.length}
              </p>
              <p className="text-sm text-gray-600">Favorite Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {userProfile.lastOrderDate ? formatDate(userProfile.lastOrderDate).split(',')[0] : 'Never'}
              </p>
              <p className="text-sm text-gray-600">Last Order</p>
            </div>
          </div>

          {/* Contact Info */}
          {(userProfile.customerPhone || userProfile.customerEmail) && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {userProfile.customerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{userProfile.customerPhone}</span>
                  </div>
                )}
                {userProfile.customerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{userProfile.customerEmail}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Welcome Message for New Users */}
      {showWelcomeMessage && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <Star className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-blue-800">Welcome to OrderFi!</h3>
              <p className="text-blue-600 mt-2">
                Start your first order to earn MIMI tokens and unlock exclusive rewards.
                Every $1 spent earns you 10 points that convert to valuable tokens!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorite Items - Quick Reorder */}
      {showReturnCustomerFeatures && userProfile.favoriteItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Your Favorite Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userProfile.favoriteItems.map((item, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-2">
                  {item}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Based on your order history. Reorder these items quickly from your recent orders below.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders - Fast Reorder */}
      {showReturnCustomerFeatures && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Orders
              </div>
              <Badge variant="outline">{orderHistory.length} total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : orderHistory.length > 0 ? (
              <div className="space-y-3">
                {orderHistory.slice(0, 5).map((order) => {
                  const orderItems = JSON.parse(order.items || "[]");
                  const itemNames = orderItems.map((item: any) => item.name || "Unknown").join(", ");
                  
                  return (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Order #{order.id}</span>
                          <Badge className={getStatusColor(order.status)} variant="secondary">
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1">{itemNames}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{formatDate(order.createdAt)}</span>
                          <span className="font-medium text-green-600">${order.total}</span>
                          {order.paymentMethod && (
                            <span className="capitalize">{order.paymentMethod}</span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleQuickReorder(order)}
                        variant="outline"
                        size="sm"
                        className="ml-4"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reorder
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loyalty Rewards */}
      <RewardsDashboard 
        customerId={customerId} 
        customerOrderCount={userProfile.totalOrders}
      />

      {/* Reorder Confirmation Dialog */}
      <Dialog open={isReorderDialogOpen} onOpenChange={setIsReorderDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Reorder</DialogTitle>
            <DialogDescription>
              Review your previous order before placing it again.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Order #{selectedOrder.id}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {JSON.parse(selectedOrder.items || "[]").map((item: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name || "Unknown Item"}</span>
                      <span>x{item.quantity || 1}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${selectedOrder.total}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                This will create a new order with the same items. You can modify it after placing.
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsReorderDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmReorder}
                  disabled={reorderMutation.isPending}
                  className="flex-1"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {reorderMutation.isPending ? "Placing..." : "Confirm Reorder"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}