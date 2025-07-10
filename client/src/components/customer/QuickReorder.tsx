import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, RefreshCw } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface LastOrder {
  id: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export function QuickReorder() {
  const { addItem } = useCart();
  
  // Mock last order data - in production would come from API
  const lastOrder: LastOrder = {
    id: "ORD-001",
    date: "2025-01-08T19:30:00Z",
    items: [
      { id: "1", name: "Classic Burger", quantity: 1, price: 12.99 },
      { id: "2", name: "Buffalo Wings", quantity: 1, price: 9.99 }
    ],
    total: 22.98
  };

  const handleQuickReorder = () => {
    // Add all items from last order to current cart
    lastOrder.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          description: "",
          category: "Previous Order"
        });
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="mb-6 border-orange-200 dark:border-orange-700 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950 dark:to-pink-950">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          Quick Reorder
          <Badge variant="secondary" className="ml-auto">
            {formatDate(lastOrder.date)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-2">Your last order:</p>
          {lastOrder.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{item.quantity}x {item.name}</span>
              <span className="text-orange-600 dark:text-orange-400 font-medium">${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2 flex justify-between items-center font-semibold">
            <span>Total:</span>
            <span className="text-orange-600 dark:text-orange-400">${lastOrder.total.toFixed(2)}</span>
          </div>
        </div>
        
        <Button 
          onClick={handleQuickReorder}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium"
          size="lg"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Add to Cart - ${lastOrder.total.toFixed(2)}
        </Button>
      </CardContent>
    </Card>
  );
}