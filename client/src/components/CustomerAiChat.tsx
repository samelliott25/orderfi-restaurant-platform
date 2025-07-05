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
    <div className="fixed bottom-20 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium text-gray-900">OrderFi AI</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onToggle}
          className="w-6 h-6 rounded-full hover:bg-gray-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto" style={{ height: 'calc(100% - 140px)' }}>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-900 text-lg mb-2 font-medium">
              Hi, I'm your AI assistant
            </div>
            <div className="text-gray-600 text-sm">
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
                  <div className={`rounded-lg px-3 py-2 ${
                    message.type === 'user' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
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
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about our menu..."
              className="w-full pr-10"
              ref={inputRef}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}