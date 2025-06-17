import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { chatApi } from "@/lib/api";
import { Bot, User, Send, Sparkles, Zap } from "lucide-react";
import { VoiceInput } from "./VoiceInput";
import { TypingText } from "./TypingText";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  suggestedItems?: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
  }>;
}

interface FluidChatInterfaceProps {
  restaurantId: number;
  welcomeMessage?: string;
}

export function FluidChatInterface({ restaurantId, welcomeMessage }: FluidChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (welcomeMessage) {
      setMessages([{
        id: "welcome",
        content: welcomeMessage,
        isUser: false,
        timestamp: new Date(),
      }]);
    }
  }, [welcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: chatApi.sendMessage,
    onSuccess: (response) => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: response.message,
        isUser: false,
        timestamp: new Date(),
        suggestedItems: response.suggestedItems,
      };
      setMessages(prev => prev.filter(m => m.id !== 'typing').concat([aiMessage]));
      setConversationHistory(prev => [...prev, { role: 'assistant', content: response.message }]);
      setIsTyping(false);
    },
    onError: () => {
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      setIsTyping(false);
    }
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, { role: 'user', content: inputValue }]);

    // Add typing indicator
    setIsTyping(true);
    const typingMessage: ChatMessage = {
      id: 'typing',
      content: '',
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, typingMessage]);

    sendMessageMutation.mutate({
      message: inputValue,
      restaurantId,
      sessionId,
      conversationHistory: [...conversationHistory, { role: 'user', content: inputValue }]
    });

    setInputValue("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 fluid-bg"></div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.isUser 
                  ? 'bg-primary text-primary-foreground user-avatar' 
                  : 'bg-secondary text-secondary-foreground ai-avatar'
              }`}>
                {message.isUser ? (
                  <User className="h-5 w-5" />
                ) : message.id === 'typing' ? (
                  <div className="typing-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </div>

              {/* Clean Message Display */}
              <div className={`max-w-[80%] ${
                message.isUser ? 'text-right' : 'text-left'
              }`}>
                {message.id === 'typing' ? (
                  <div className="flex items-center space-x-2 py-2">
                    <Sparkles className="h-4 w-4 animate-pulse text-orange-500" />
                    <span className="text-sm text-gray-700">Mimi is thinking...</span>
                  </div>
                ) : (
                  <>
                    <p className={`text-lg leading-relaxed font-medium text-black break-words ${
                      message.isUser ? 'font-semibold' : 'font-normal'
                    }`} style={{ fontFamily: message.isUser ? 'Inter, Arial, sans-serif' : 'Rancho, cursive' }}>
                      {message.isUser ? (
                        message.content
                      ) : (
                        <TypingText 
                          text={message.content} 
                          speed={4}
                        />
                      )}
                    </p>
                    <p className="text-xs text-gray-600 mt-1" 
                       style={{ fontFamily: 'Inter, sans-serif' }}>
                      {formatTime(message.timestamp)}
                    </p>
                  </>
                )}

                {/* Clean Suggested Items */}
                {message.suggestedItems && message.suggestedItems.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-800" 
                       style={{ fontFamily: 'Inter, sans-serif' }}>
                      Recommended for you:
                    </p>
                    {message.suggestedItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="p-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white/80 transition-all duration-300 cursor-pointer shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-black" 
                                style={{ fontFamily: 'Inter, sans-serif' }}>
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-700 mt-1 leading-relaxed" 
                               style={{ fontFamily: 'Inter, sans-serif' }}>
                              {item.description}
                            </p>
                          </div>
                          <div className="ml-4 text-sm font-semibold text-orange-600">
                            {item.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t-2 border-white bg-background relative z-10">
        {/* Voice Input Section */}
        <div className="mb-4 flex justify-center">
          <VoiceInput
            onTranscript={(text) => {
              setInputValue(text);
              // Auto-send voice messages after a brief delay
              setTimeout(() => {
                const event = new Event('submit');
                const form = document.querySelector('form');
                if (form && text.trim()) {
                  form.dispatchEvent(event);
                }
              }, 500);
            }}
            onStartListening={() => {
              // Optional: Add visual feedback when listening starts
            }}
            onStopListening={() => {
              // Optional: Add visual feedback when listening stops
            }}
            disabled={sendMessageMutation.isPending}
          />
        </div>

        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about our menu or speak your order..."
              className="pr-12 bg-background/90 backdrop-blur border-border/50 focus:border-primary/50 transition-colors duration-300 fluid-input"
              disabled={sendMessageMutation.isPending}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || sendMessageMutation.isPending}
            className="rounded-full w-12 h-12 p-0 send-button hover:scale-110 transition-transform duration-300"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}