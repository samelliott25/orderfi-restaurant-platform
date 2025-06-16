import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { chatApi } from "@/lib/api";
import { Bot, User, Send, Mic, MoreVertical } from "lucide-react";

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

interface ChatInterfaceProps {
  restaurantId: number;
  welcomeMessage?: string;
}

export function ChatInterface({ restaurantId, welcomeMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
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
      
      setMessages(prev => prev.filter(msg => msg.id !== "typing").concat([aiMessage]));
      setConversationHistory(prev => [
        ...prev,
        { role: 'assistant', content: response.message }
      ]);
    },
    onError: () => {
      setMessages(prev => prev.filter(msg => msg.id !== "typing").concat([{
        id: `error-${Date.now()}`,
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }]));
    },
  });

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [
      ...prev,
      { role: 'user', content: inputValue }
    ]);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: "typing",
      content: "Typing...",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, typingMessage]);

    const messageToSend = inputValue;
    setInputValue("");

    await sendMessageMutation.mutateAsync({
      message: messageToSend,
      restaurantId,
      sessionId,
      conversationHistory,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (text: string) => {
    setInputValue(text);
    setTimeout(() => handleSendMessage(), 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Bot className="text-white h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Waiter</h3>
            <p className="text-sm text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Online
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div className={`flex items-start space-x-3 ${message.isUser ? 'justify-end' : ''}`}>
              {!message.isUser && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white text-sm h-4 w-4" />
                </div>
              )}
              
              <div className={`rounded-2xl p-4 max-w-xs lg:max-w-sm ${
                message.isUser 
                  ? 'bg-primary text-white rounded-tr-sm' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}>
                {message.id === "typing" ? (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  <>
                    <p>{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.isUser ? 'text-primary-200' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </>
                )}
              </div>

              {message.isUser && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-gray-600 text-sm h-4 w-4" />
                </div>
              )}
            </div>

            {/* Suggested Items */}
            {message.suggestedItems && message.suggestedItems.length > 0 && (
              <div className="flex items-start space-x-3 mt-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white text-sm h-4 w-4" />
                </div>
                <div className="space-y-2">
                  {message.suggestedItems.map((item) => (
                    <Card 
                      key={item.id} 
                      className="p-3 hover:shadow-sm transition-shadow cursor-pointer border-gray-200"
                      onClick={() => handleQuickReply(`Tell me more about ${item.name}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">${item.price}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="pr-12 rounded-full"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || sendMessageMutation.isPending}
            className="rounded-full p-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center space-x-4 mt-3">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full text-sm"
            onClick={() => handleQuickReply("Show me the menu")}
          >
            Show menu
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full text-sm"
            onClick={() => handleQuickReply("What are today's specials?")}
          >
            Daily specials
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full text-sm"
            onClick={() => handleQuickReply("I have allergies, can you help?")}
          >
            Allergies
          </Button>
        </div>
      </div>
    </div>
  );
}
