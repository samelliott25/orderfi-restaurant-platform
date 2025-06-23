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
  Bot,
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
  restaurantName: string;
  menuItems: MenuItem[];
}

export function AiChatOrder({ restaurantName, menuItems }: AiChatOrderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm Mimi, your AI ordering assistant at ${restaurantName}. I'm here to help you create the perfect meal! 

What are you in the mood for today? I can recommend dishes, tell you about our specials, or help you build a complete meal. Just tell me what sounds good!`,
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

  // Parse AI message content to identify menu items and make them clickable
  const parseMessageContent = (content: string): Array<{type: 'text', content: string} | {type: 'menuItem', content: string, item: MenuItem}> => {
    const parts: Array<{type: 'text', content: string} | {type: 'menuItem', content: string, item: MenuItem}> = [];
    let lastIndex = 0;
    
    // Find menu item names in the message
    menuItems.forEach(item => {
      const regex = new RegExp(`\\b${item.name}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        // Add text before the menu item
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: content.slice(lastIndex, match.index)
          });
        }
        
        // Add the clickable menu item
        parts.push({
          type: 'menuItem',
          content: match[0],
          item: item
        });
        
        lastIndex = regex.lastIndex;
      }
    });
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', content }];
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
              content: `You are Mimi, a friendly AI restaurant ordering assistant. You help customers place orders by understanding their preferences and recommending items from the menu.

MENU ITEMS:
${menuItems.map(item => `- ${item.name}: ${item.description} - $${item.price} (${item.category})`).join('\n')}

INSTRUCTIONS:
1. Be conversational and helpful
2. When customers express interest in items, ask follow-up questions about preferences
3. Suggest complementary items (appetizers, sides, drinks)
4. When ready to add items to cart, format responses with JSON at the end like:
   ADD_TO_CART: {"items": [{"id": 1, "name": "Classic Burger", "price": "23.00", "quantity": 1, "specialInstructions": ""}]}
5. Always be enthusiastic about food recommendations
6. Ask about dietary restrictions, spice preferences, etc.
7. Offer to customize items when possible

Current conversation context: The customer just said "${userMessage}"`
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Get AI response
    const aiResponse = await processAiResponse(inputMessage);
    
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="h-8 w-8 text-orange-500" />
            <div>
              <h1 className="text-lg font-semibold">Mimi AI Assistant</h1>
              <p className="text-sm text-gray-600">{restaurantName}</p>
            </div>
          </div>
          {cart.length > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              <ShoppingCart className="h-4 w-4 mr-1" />
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </Badge>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-orange-500 text-white ml-auto'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <Bot className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="text-sm">
                    {message.role === 'assistant' 
                      ? parseMessageContent(message.content).map((part, index) => (
                          <span key={index}>
                            {part.type === 'text' 
                              ? part.content
                              : (
                                <button
                                  onClick={() => handleMenuItemClick(part.item)}
                                  className="inline-block mx-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-md hover:bg-orange-200 transition-colors font-medium text-sm border border-orange-300"
                                >
                                  {part.content}
                                </button>
                              )
                            }
                          </span>
                        ))
                      : <span className="whitespace-pre-wrap">{message.content}</span>
                    }
                  </div>
                  <p className={`text-xs mt-1 ${
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
                <Bot className="h-5 w-5 text-orange-500" />
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
              <h3 className="font-medium">Your Order</h3>
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

      {/* Input Area */}
      <div className="bg-white border-t p-4">
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
                  Ask Mimi about this item
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}