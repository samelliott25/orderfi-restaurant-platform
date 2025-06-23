import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SimpleOrderFi } from "@/components/SimpleOrderFi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Smartphone, Zap } from "lucide-react";

// OrderFi - Mobile-first blockchain ordering experience
export default function OrderFiPage() {
  const [restaurantId] = useState(1);
  
  // Get menu items for the interface
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: [`/api/restaurants/${restaurantId}/menu`],
  });

  // Get restaurant info
  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['/api/restaurants', restaurantId],
  });

  const isLoading = menuLoading || restaurantLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p>Loading delicious menu...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Mobile-first OrderFi interface */}
      <div className="max-w-md mx-auto">
        <SimpleOrderFi 
          restaurantName={(restaurant as any)?.name || "Mimi's Restaurant"}
          menuItems={Array.isArray(menuItems) ? menuItems : []}
        />
      </div>

      {/* Desktop QR code display for table placement */}
      <div className="hidden lg:block fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
        <div className="text-center space-y-3">
          <QrCode className="h-16 w-16 mx-auto text-gray-600" />
          <div>
            <p className="font-medium text-sm">Scan to Order</p>
            <p className="text-xs text-gray-500">Table Service</p>
          </div>
          <Button size="sm" variant="outline">
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile View
          </Button>
        </div>
      </div>

      {/* Performance indicator */}
      <div className="hidden lg:block fixed bottom-4 right-4 bg-green-50 border border-green-200 p-3 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-green-800">
          <Zap className="h-4 w-4" />
          <span>0.5% fees • Instant settlements</span>
        </div>
      </div>
    </div>
  );
}