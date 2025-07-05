import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: {
            currentCart,
            conversationHistory: messages.slice(-10)
          }
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
    return null;
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 w-96 h-[500px] rounded-2xl shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 duration-300 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(25, 95%, 53%) 0%, hsl(340, 82%, 52%) 100%)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
              background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(239,68,68,0.08) 50%, transparent 100%)`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${6 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Close Button */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onToggle}
        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 z-10 w-8 h-8 rounded-full backdrop-blur-xl transition-all duration-200"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Button>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto relative" style={{ height: 'calc(100% - 140px)' }}>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-white text-xl mb-3 font-medium tracking-tight">
              Hi, I'm your AI assistant
            </div>
            <div className="text-white/70 text-base font-normal tracking-normal">
              How can I help you today?
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className="text-white font-light text-base leading-relaxed mb-1">
                    {message.content}
                  </div>
                  <div className="text-white/70 text-xs font-light">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                  
                  {/* Menu recommendations */}
                  {message.menuRecommendations && message.menuRecommendations.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.menuRecommendations.map((item: any) => (
                        <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                            <Badge variant="outline">${item.price}</Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                          {onAddToCart && (
                            <Button
                              onClick={() => onAddToCart(item)}
                              size="sm"
                              className="w-full text-xs bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollAreaRef} />
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-4 relative">
        <div className="flex items-center space-x-3">
          {/* Microphone Button */}
          <Button
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-0 text-white backdrop-blur-xl transition-all duration-200"
            style={{ backdropFilter: 'blur(20px)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about our menu..."
              className="w-full border-2 border-white/30 text-white placeholder-white/80 rounded-2xl px-5 py-4 text-base focus:border-white/50 transition-all duration-200 bg-white/10 backdrop-blur-xl font-medium"
              style={{ backdropFilter: 'blur(20px)' }}
              ref={inputRef}
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 border-0 text-white backdrop-blur-xl transition-all duration-200"
            style={{ backdropFilter: 'blur(20px)' }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}