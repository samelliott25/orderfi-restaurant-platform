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
  
  // Get menu items for the interface (load in background)
  const { data: menuItems = [] } = useQuery({
    queryKey: [`/api/restaurants/${restaurantId}/menu`],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Get restaurant info (load in background)
  const { data: restaurant } = useQuery({
    queryKey: ['/api/restaurants', restaurantId],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

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



  return (
    <div className="fixed inset-0 flex flex-col" style={{ backgroundColor: '#fcfcfc' }}>
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto p-4 h-full overflow-y-auto pb-32">
          
          {/* Search Results Display */}
        {searchResults.length > 0 && (
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4 font-heading">Search Results ({searchResults.length} items)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((item: any) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 font-heading">{item.name}</h4>
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
              <h2 className="text-lg font-semibold font-heading">Choose Your Experience</h2>
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
                Chat with OrderFi Ai
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

        {/* Chat Interface - Default Mode */}
        {searchResults.length === 0 && (
          <div data-ai-chat>
            <AiChatOrder 
              restaurantId={restaurantId}
              menuItems={menuItems}
              restaurant={restaurant}
            />
          </div>
        )}
          
        </div>
      </div>

      {/* Bottom Integrated Chat/Search Interface */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-pb">
        <div className="p-4">
          <IntegratedChatSearch
            onSendMessage={handleChatMessage}
            onSearch={handleSearch}
            isLoading={isSearching}
            placeholder="Ask OrderFi Ai or search menu..."
          />
        </div>
      </div>
    </div>
  );
}