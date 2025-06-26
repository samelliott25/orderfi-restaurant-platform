import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Send, 
  Mic, 
  MicOff, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  Diamond,
  User,
  Clock,
  DollarSign,
  Eye,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  orderItems?: Array<{
    id: number;
    name: string;
    price: string;
    quantity: number;
  }>;
}

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  specialInstructions?: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
}

interface AiChatOrderProps {
  restaurantId: number;
  menuItems: MenuItem[];
  restaurant: any;
  externalMessage?: string;
  onMessageProcessed?: () => void;
}

export function AiChatOrder({ restaurantId, menuItems, restaurant, externalMessage, onMessageProcessed }: AiChatOrderProps) {
  const restaurantName = restaurant?.name || "Restaurant";
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Handle external messages
  useEffect(() => {
    if (externalMessage && externalMessage.trim()) {
      const sendExternalMessage = async () => {
        await handleSendMessage(externalMessage);
        if (onMessageProcessed) {
          onMessageProcessed();
        }
      };
      sendExternalMessage();
    }
  }, [externalMessage]);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to ${restaurantName || 'our restaurant'}! I'm OrderFi Ai. What can I get you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Find menu items mentioned in AI messages
  const findMenuItemsInMessage = (content: string): MenuItem[] => {
    const foundItems: MenuItem[] = [];
    
    menuItems.forEach(item => {
      const regex = new RegExp(`\\b${item.name}\\b`, 'gi');
      if (regex.test(content)) {
        foundItems.push(item);
      }
    });
    
    // Remove duplicates
    return foundItems.filter((item, index, self) => 
      index === self.findIndex(i => i.id === item.id)
    );
  };

  const handleMenuItemClick = (item: MenuItem) => {
    setSelectedMenuItem(item);
  };

  const addMenuItemToCart = (item: MenuItem, quantity: number = 1) => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity
    };
    addToCart(cartItem);
    setSelectedMenuItem(null);
  };

  // Process AI response and extract order items
  const processAiResponse = async (userMessage: string): Promise<string> => {
    setIsProcessing(true);
    
    try {
      // Use OpenAI API to process the conversation
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are OrderFi Ai, a concise restaurant ordering assistant. Keep responses brief and focused.

MENU ITEMS:
${menuItems.map(item => `- ${item.name}: ${item.description} - $${item.price} (${item.category})`).join('\n')}

INSTRUCTIONS:
1. Keep responses under 3 sentences
2. Be direct and helpful, avoid lengthy explanations
3. Recommend 1-2 items max per response
4. When adding items to cart, use this format at the end:
   ADD_TO_CART: {"items": [{"id": 1, "name": "Item Name", "price": "00.00", "quantity": 1}]}
5. Ask one specific question if needed
6. Focus on getting the order, not extensive descriptions

Customer said: "${userMessage}"`
            },
            ...messages.slice(-5).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: userMessage
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      let aiResponse = data.response || "I'm having trouble processing that. Could you try again?";

      // Check if AI wants to add items to cart
      if (aiResponse.includes('ADD_TO_CART:')) {
        const [responseText, cartData] = aiResponse.split('ADD_TO_CART:');
        try {
          const cartItems = JSON.parse(cartData.trim());
          if (cartItems.items) {
            cartItems.items.forEach((item: CartItem) => {
              addToCart(item);
            });
          }
        } catch (e) {
          console.error('Error parsing cart data:', e);
        }
        aiResponse = responseText.trim();
      }

      return aiResponse;
    } catch (error) {
      console.error('AI processing error:', error);
      return "I'm having some technical difficulties. Let me help you browse our menu directly, or you can tell me what you'd like and I'll do my best to assist you!";
    } finally {
      setIsProcessing(false);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prev, item];
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} (${item.quantity}x) - $${item.price}`,
    });
  };

  const updateCartQuantity = (id: number, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleSendMessage = async (messageOverride?: string) => {
    const messageToSend = messageOverride || inputMessage;
    if (!messageToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageOverride) {
      setInputMessage("");
    }

    // Get AI response
    const aiResponse = await processAiResponse(messageToSend);
    
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };
      
      recognition.start();
    } else {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice input",
        variant: "destructive"
      });
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const orderData = {
        restaurantId: 1,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || ''
        })),
        totalAmount: calculateTotal().toFixed(2),
        customerNotes: messages.slice(-3).map(m => m.content).join(' | ')
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order placed successfully!",
        description: "Your order has been sent to the kitchen.",
      });
      setCart([]);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Perfect! Your order has been placed and sent to the kitchen. You'll receive updates on the progress. Is there anything else I can help you with today?",
        timestamp: new Date()
      }]);
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    },
    onError: (error) => {
      toast({
        title: "Order failed",
        description: "There was an issue placing your order. Please try again.",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#fcfcfc' }}>
      {/* Shopping Cart Badge - Floating */}
      {cart.length > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <ShoppingCart className="h-4 w-4 mr-1" />
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </Badge>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[280px] sm:max-w-sm px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-orange-500 text-white ml-auto'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <Diamond className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="text-sm leading-relaxed">
                    <span className="whitespace-pre-wrap">{message.content}</span>
                  </div>
                  
                  {/* Show clickable menu items mentioned in the message */}
                  {message.role === 'assistant' && (() => {
                    const foundItems = findMenuItemsInMessage(message.content);
                    return foundItems.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {foundItems.map((item, index) => (
                          <button
                            key={`${item.id}-${index}`}
                            onClick={() => handleMenuItemClick(item)}
                            className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs hover:bg-orange-200 transition-colors border border-orange-300"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            {item.name}
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                  
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-orange-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <User className="h-5 w-5 text-orange-100 mt-0.5 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-lg shadow-sm border max-w-xs">
              <div className="flex items-center space-x-2">
                <Diamond className="h-5 w-5 text-orange-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="bg-white border-t p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium font-heading">Your Order</h3>
              <Badge variant="outline">${calculateTotal().toFixed(2)}</Badge>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 ml-2">${item.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromCart(item.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => placeOrderMutation.mutate()}
              disabled={placeOrderMutation.isPending}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {placeOrderMutation.isPending ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Place Order - ${calculateTotal().toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Input Area - Hidden since integrated with top search/chat bar */}
      <div className="bg-white border-t p-4" style={{ display: 'none' }}>
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Tell me what you'd like to order..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button
            onClick={handleVoiceInput}
            variant="outline"
            size="icon"
            className={isListening ? 'bg-red-100 text-red-600' : ''}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isProcessing}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Menu Item Detail Popup */}
      <Dialog open={!!selectedMenuItem} onOpenChange={() => setSelectedMenuItem(null)}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedMenuItem?.name}</span>
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                ${selectedMenuItem?.price}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedMenuItem && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-sm">{selectedMenuItem.description}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {selectedMenuItem.category}
                </Badge>
                <div className="text-lg font-semibold text-orange-600">
                  ${selectedMenuItem.price}
                </div>
              </div>

              <Separator />

              <div className="flex space-x-2">
                <Button
                  onClick={() => addMenuItemToCart(selectedMenuItem, 1)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={() => setSelectedMenuItem(null)}
                  variant="outline"
                  className="border-gray-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => {
                    setSelectedMenuItem(null);
                    setInputMessage(`Tell me more about the ${selectedMenuItem.name}`);
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-orange-600 hover:text-orange-700"
                >
                  Ask OrderFi Ai about this item
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}