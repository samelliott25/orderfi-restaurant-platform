import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiChatOrder } from "@/components/AiChatOrder";
import { SimpleOrderFi } from "@/components/SimpleOrderFi";
import { IntegratedChatSearch } from "@/components/IntegratedChatSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, Zap, MessageSquare, Grid3X3, Bot } from "lucide-react";

// OrderFi - AI-first conversational ordering experience
export default function OrderFiPage() {
  const [restaurantId] = useState(1);
  const [orderingMode, setOrderingMode] = useState<'chat' | 'browse'>('chat');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Get menu items for the interface
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: [`/api/restaurants/${restaurantId}/menu`],
  });

  // Get restaurant info
  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['/api/restaurants', restaurantId],
  });

  const isLoading = menuLoading || restaurantLoading;

  const handleChatMessage = (message: string) => {
    // Pass message to AiChatOrder component
    const chatComponent = document.querySelector('[data-ai-chat]') as any;
    if (chatComponent && chatComponent.sendMessage) {
      chatComponent.sendMessage(message);
    }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // Filter menu items based on search query
      const filtered = menuItems.filter((item: any) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.category?.toLowerCase().includes(query.toLowerCase()) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filtered);
      setOrderingMode('browse'); // Switch to browse mode to show results
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Integrated Chat/Search Interface */}
      <div className="sticky top-20 z-30 bg-gradient-to-br from-orange-50 to-red-50 p-4 border-b border-orange-200">
        <IntegratedChatSearch
          onSendMessage={handleChatMessage}
          onSearch={handleSearch}
          isLoading={isSearching}
          placeholder="Ask Mimi or search menu..."
        />
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto">
        
        {/* Search Results Display */}
        {searchResults.length > 0 && (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Search Results ({searchResults.length} items)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((item: any) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-orange-600">${item.price}</span>
                      <Button 
                        size="sm"
                        onClick={() => handleChatMessage(`Add ${item.name} to my order`)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Add to Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button 
              variant="outline" 
              onClick={() => {setSearchResults([]); setOrderingMode('chat');}}
              className="mt-4 w-full"
            >
              Return to Chat
            </Button>
          </div>
        )}

        {/* Mode Selector - Only visible when in browse mode and no search results */}
        {orderingMode === 'browse' && searchResults.length === 0 && (
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