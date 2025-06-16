import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { orderApi, paymentApi } from "@/lib/api";
import { ShoppingCart, CreditCard, Trash2 } from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  modifications?: string;
}

export function OrderSummary() {
  const { toast } = useToast();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: 1,
      name: "Margherita Pizza",
      price: 18.99,
      quantity: 1,
      modifications: "Large • Extra basil",
    },
  ]);

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const createOrderMutation = useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: async (order) => {
      try {
        const paymentResponse = await paymentApi.createCheckout(order.id, total);
        // In a real app, redirect to Stripe checkout
        toast({ 
          title: "Order created successfully!", 
          description: `Order #${order.id} is ready for payment.` 
        });
        // For demo purposes, just show success
        console.log("Payment URL:", paymentResponse.url);
      } catch (error) {
        toast({ 
          title: "Payment setup failed", 
          description: "Order created but payment setup failed.",
          variant: "destructive" 
        });
      }
    },
    onError: () => {
      toast({ 
        title: "Failed to create order", 
        variant: "destructive" 
      });
    },
  });

  const handleRemoveItem = (itemId: number) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleProceedToPayment = () => {
    if (orderItems.length === 0) {
      toast({ 
        title: "No items in order", 
        description: "Please add items to your order first.",
        variant: "destructive" 
      });
      return;
    }

    const orderData = {
      restaurantId: 1,
      customerName: "Customer",
      customerEmail: "customer@example.com",
      items: JSON.stringify(orderItems),
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      status: "pending",
    };

    createOrderMutation.mutate(orderData);
  };

  if (orderItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 text-primary h-5 w-5" />
            Your Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>Your order is empty</p>
            <p className="text-sm">Chat with our AI to add items!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2 text-primary h-5 w-5" />
          Your Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orderItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                {item.modifications && (
                  <p className="text-sm text-gray-600">{item.modifications}</p>
                )}
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right flex items-center space-x-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">${tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${total.toFixed(2)}</span>
          </div>
        </div>
        
        <Button 
          className="w-full mt-4" 
          onClick={handleProceedToPayment}
          disabled={createOrderMutation.isPending}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {createOrderMutation.isPending ? "Processing..." : "Proceed to Payment"}
        </Button>
      </CardContent>
    </Card>
  );
}
