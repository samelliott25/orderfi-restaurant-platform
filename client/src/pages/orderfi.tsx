import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiChatOrder } from "@/components/AiChatOrder";
import { SimpleOrderFi } from "@/components/SimpleOrderFi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, Zap, MessageSquare, Grid3X3, Bot } from "lucide-react";

// OrderFi - AI-first conversational ordering experience
export default function OrderFiPage() {
  const [restaurantId] = useState(1);
  const [orderingMode, setOrderingMode] = useState<'chat' | 'browse'>('chat');
  
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
            <p>Loading Mimi AI Assistant...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Mobile-first interface with mode selector */}
      <div className="max-w-md mx-auto">
        
        {/* Mode Selector - Only visible when in browse mode */}
        {orderingMode === 'browse' && (
          <div className="bg-white border-b p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Choose Your Experience</h2>
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                Browse Mode
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setOrderingMode('chat')}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Bot className="h-4 w-4 mr-2" />
                Chat with Mimi AI
              </Button>
              <Button
                variant="outline"
                onClick={() => setOrderingMode('browse')}
                className="flex-1 border-orange-300 text-orange-600"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Browse Menu
              </Button>
            </div>
          </div>
        )}

        {/* Primary AI Chat Interface */}
        {orderingMode === 'chat' && (
          <div className="relative">
            <AiChatOrder 
              restaurantName={(restaurant as any)?.name || "Mimi's Restaurant"}
              menuItems={Array.isArray(menuItems) ? menuItems : []}
            />
            
            {/* Secondary option to browse menu */}
            <div className="absolute top-4 right-4">
              <Button
                onClick={() => setOrderingMode('browse')}
                variant="outline"
                size="sm"
                className="bg-white/90 backdrop-blur-sm border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <Grid3X3 className="h-3 w-3 mr-1" />
                Browse
              </Button>
            </div>
          </div>
        )}

        {/* Secondary Browse Interface */}
        {orderingMode === 'browse' && (
          <SimpleOrderFi 
            restaurantName={(restaurant as any)?.name || "Mimi's Restaurant"}
            menuItems={Array.isArray(menuItems) ? menuItems : []}
          />
        )}
      </div>

      {/* Desktop QR code display for table placement */}
      <div className="hidden lg:block fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
        <div className="text-center space-y-3">
          <QrCode className="h-16 w-16 mx-auto text-gray-600" />
          <p className="text-sm font-medium">Scan to Order</p>
          <p className="text-xs text-gray-500">AI Assistant Ready</p>
        </div>
      </div>

      {/* Bottom token rewards indicator */}
      <div className="hidden lg:block fixed bottom-4 right-4 bg-orange-500 text-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span className="text-sm font-medium">Earn tokens with each order!</span>
        </div>
      </div>

      {/* AI Mode indicator for desktop */}
      {orderingMode === 'chat' && (
        <div className="hidden lg:block fixed bottom-4 left-4 bg-white border-2 border-orange-500 text-orange-600 p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span className="text-sm font-medium">AI Assistant Active</span>
          </div>
        </div>
      )}
    </div>
  );
}