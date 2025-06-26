import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AiChatOrder } from "@/components/AiChatOrder";
import { SimpleOrderFi } from "@/components/SimpleOrderFi";
import { IntegratedChatSearch } from "@/components/IntegratedChatSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, Zap, MessageSquare, Grid3X3, Bot, Sparkles, TrendingUp, Clock, Users } from "lucide-react";

// OrderFi - AI-first conversational ordering experience with modern UX innovations
export default function OrderFiPage() {
  const [restaurantId] = useState(1);
  const [orderingMode, setOrderingMode] = useState<'chat' | 'browse'>('chat');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [chatMessage, setChatMessage] = useState<string>('');
  
  // Get menu items for the interface (load in background)
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: [`/api/restaurants/${restaurantId}/menu`],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Get restaurant data for interface
  const { data: restaurants = [], isLoading: restaurantLoading } = useQuery({
    queryKey: ['/api/restaurants'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const restaurant = Array.isArray(restaurants) ? restaurants.find((r: any) => r.id === restaurantId) : null;

  // Real-time clock for contextual ordering
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate contextual AI suggestions based on time and popular items
  useEffect(() => {
    const hour = currentTime.getHours();
    let suggestions: string[] = [];
    
    if (hour >= 6 && hour < 11) {
      suggestions = ["What's good for breakfast?", "Something quick and energizing", "Coffee and pastry combo"];
    } else if (hour >= 11 && hour < 16) {
      suggestions = ["Lunch specials today?", "Something light and fresh", "Popular lunch items"];
    } else if (hour >= 16 && hour < 20) {
      suggestions = ["What's trending for dinner?", "Comfort food recommendations", "Share plates for groups"];
    } else {
      suggestions = ["Late night favorites?", "Something satisfying", "Quick bites available"];
    }
    
    // Add popular items from menu if available
    if (menuItems && Array.isArray(menuItems) && menuItems.length > 0) {
      const popularCategories = Array.from(new Set(menuItems.slice(0, 3).map((item: any) => item.category)));
      if (popularCategories[0]) {
        suggestions.push(`What's in ${popularCategories[0]}?`);
      }
    }
    
    setAiSuggestions(suggestions);
  }, [currentTime.getHours(), Array.isArray(menuItems) ? menuItems.length : 0]);

  const handleChatMessage = (message: string) => {
    setShowQuickActions(false); // Hide quick actions after first interaction
    // Store the message to be passed to AiChatOrder component
    setChatMessage(message);
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // Filter menu items based on search query
      const filtered = Array.isArray(menuItems) ? menuItems.filter((item: any) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.category?.toLowerCase().includes(query.toLowerCase()) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
      ) : [];
      setSearchResults(filtered);
      setOrderingMode('browse'); // Switch to browse mode to show results
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getMealContext = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 11) return { meal: "breakfast", emoji: "🌅", color: "from-yellow-400 to-orange-500" };
    if (hour >= 11 && hour < 16) return { meal: "lunch", emoji: "☀️", color: "from-blue-400 to-cyan-500" };
    if (hour >= 16 && hour < 20) return { meal: "dinner", emoji: "🌆", color: "from-purple-400 to-pink-500" };
    return { meal: "late night", emoji: "🌙", color: "from-indigo-400 to-purple-500" };
  };

  const mealContext = getMealContext();





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
          <div 
            data-ai-chat 
            className={`transition-all duration-500 ${showQuickActions ? 'mt-80' : 'mt-0'}`}
            style={{ paddingTop: showQuickActions ? '0' : '20px' }}
          >
            <AiChatOrder 
              restaurantId={restaurantId}
              menuItems={Array.isArray(menuItems) ? menuItems : []}
              restaurant={restaurant}
              externalMessage={chatMessage}
              onMessageProcessed={() => setChatMessage('')}
            />
          </div>
        )}
          
        </div>
      </div>

      {/* Enhanced Bottom Chat Interface */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 shadow-2xl safe-area-pb">
        <div className="p-4">
          {/* Voice Wave Animation when listening */}
          <div className="mb-2 flex justify-center">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-orange-400 to-red-500 rounded-full transition-all duration-300"
                  style={{
                    height: isSearching ? `${8 + Math.sin(Date.now() / 200 + i) * 4}px` : '4px',
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
          </div>

          <IntegratedChatSearch
            onSendMessage={handleChatMessage}
            onSearch={handleSearch}
            isLoading={isSearching}
            placeholder={`${getTimeBasedGreeting()}, what sounds good for ${mealContext.meal}?`}
          />

          {/* Quick Action Pills */}
          {!showQuickActions && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleChatMessage("What's popular right now?")}
                className="whitespace-nowrap bg-orange-50 text-orange-700 hover:bg-orange-100"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                What's Popular
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleChatMessage("Show me something quick")}
                className="whitespace-nowrap bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                <Zap className="h-3 w-3 mr-1" />
                Quick Bites
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickActions(true)}
                className="whitespace-nowrap bg-purple-50 text-purple-700 hover:bg-purple-100"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                More Ideas
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}