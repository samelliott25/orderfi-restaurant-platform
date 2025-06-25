import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User,
  MessageCircle,
  Loader2,
  X,
  Minimize2,
  Maximize2
} from "lucide-react";
import mimiLogo from "@assets/Mimi dashboard logo_1750329007735.webp";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  menuRecommendations?: any[];
}

interface CustomerAiChatProps {
  isOpen: boolean;
  onToggle: () => void;
  onAddToCart?: (item: any) => void;
  currentCart?: any[];
}

export function CustomerAiChat({ isOpen, onToggle, onAddToCart, currentCart = [] }: CustomerAiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message - OrderFi style
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessages: ChatMessage[] = [
        {
          id: "welcome",
          type: "assistant",
          content: "Hey there! 👋 I'm your OrderFi AI assistant. Want to start with a drink?",
          timestamp: new Date()
        },
        {
          id: "welcome-2",
          type: "assistant", 
          content: "I can help you discover our menu, answer questions about ingredients, and even remember your favorites for next time. What sounds good to you today?",
          timestamp: new Date()
        }
      ];
      setMessages(welcomeMessages);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send to customer AI chat endpoint
      const response = await fetch("/api/customer-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context: "customer_ordering",
          currentCart: currentCart
        })
      });

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.message,
        timestamp: new Date(),
        menuRecommendations: data.menuRecommendations || []
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment. In the meantime, feel free to browse our menu directly!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full gradient-bg text-white shadow-lg hover:shadow-xl transition-all duration-300"
        size="sm"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 z-40 w-96 shadow-2xl border-[#8b795e]/20 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-[32rem]'
    }`}>
      <CardHeader className="pb-3 bg-gradient-to-r from-[#8b795e] to-[#a08d6b] text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <img src={mimiLogo} alt="Mimi" className="w-6 h-6 rounded-full" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium">Mimi AI Assistant</CardTitle>
              <p className="text-xs text-white/80">Your dining companion</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setIsMinimized(!isMinimized)}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              onClick={onToggle}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-0 flex flex-col h-[calc(32rem-5rem)]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-[#8b795e] to-[#a08d6b] rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[75%] ${message.type === 'user' ? 'order-first' : ''}`}>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-[#8b795e] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {/* Menu recommendations */}
                      {message.menuRecommendations && message.menuRecommendations.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.menuRecommendations.map((item) => (
                            <div key={item.id} className="bg-white border rounded-lg p-3 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-sm">{item.name}</h4>
                                <Badge variant="outline">${item.price}</Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                              {onAddToCart && (
                                <Button
                                  onClick={() => onAddToCart(item)}
                                  size="sm"
                                  className="w-full text-xs"
                                >
                                  Add to Cart
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-[#8b795e]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-[#8b795e]" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#8b795e] to-[#a08d6b] rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <Loader2 className="h-4 w-4 animate-spin text-[#8b795e]" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Mimi about our menu..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  size="sm"
                  className="gradient-bg text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}