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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: isOpen ? 'linear-gradient(135deg, hsl(25, 95%, 53%) 0%, hsl(340, 82%, 52%) 100%)' : 'transparent',
        clipPath: isOpen ? 'circle(150% at 50% 50%)' : 'circle(0px at 50% 100%)',
        transition: 'clip-path 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: isOpen ? 'auto' : 'none',
        visibility: isOpen ? 'visible' : 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      {isOpen && (
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
      )}
      
      {/* Close Button */}
      {isOpen && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onToggle}
          className="absolute top-6 right-6 text-white/80 hover:text-white hover:bg-white/10 z-10 w-8 h-8 rounded-full backdrop-blur-xl transition-all duration-200"
          style={{ backdropFilter: 'blur(20px)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </Button>
      )}

      {/* Chat Interface */}
      <div className="relative w-full h-full p-4 flex flex-col" style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.6s ease-in-out' }}>
        {/* Messages Area */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-4 flex-1 flex flex-col shadow-2xl min-h-0 max-h-full" style={{ backdropFilter: 'blur(40px)' }}>
          {/* Messages */}
          <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-white/90 text-xl mb-3 font-medium tracking-tight">
                  Hi, I'm your AI assistant
                </div>
                <div className="text-white/70 text-base font-normal tracking-normal">
                  How can I help you today?
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-xl ${
                        message.type === 'user'
                          ? 'bg-white/20 text-white backdrop-blur-sm'
                          : 'bg-white/15 text-white/95 backdrop-blur-md'
                      }`}
                    >
                      <div className="text-sm leading-relaxed font-light tracking-wide">
                        {message.content}
                      </div>
                      <div className="text-xs text-white/50 mt-1 font-light tracking-wider">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                      
                      {/* Menu recommendations */}
                      {message.menuRecommendations && message.menuRecommendations.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.menuRecommendations.map((item: any) => (
                            <div key={item.id} className="bg-white/20 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-sm text-white">{item.name}</h4>
                                <Badge variant="outline" className="text-white border-white/20">${item.price}</Badge>
                              </div>
                              <p className="text-xs text-white/70 mb-2">{item.description}</p>
                              {onAddToCart && (
                                <Button
                                  onClick={() => onAddToCart(item)}
                                  size="sm"
                                  className="w-full text-xs bg-white/20 hover:bg-white/30 text-white border-0"
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
              </>
            )}
          </div>
          
          {/* Input Area */}
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
                className="w-full border-0 text-black placeholder-white rounded-2xl px-5 py-4 text-base backdrop-blur-xl focus:bg-[#f9a999] transition-all duration-200 bg-[#f7877d] font-medium text-center"
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
    </div>
  );
}