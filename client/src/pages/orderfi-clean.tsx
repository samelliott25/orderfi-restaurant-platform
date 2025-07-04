import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useNavigate } from 'wouter';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function OrderFiPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTokens] = useState(1250);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: currentMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          sessionId: 'orderfi-session',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const aiResponse: Message = {
        id: messages.length + 2,
        text: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleChatToggle = () => {
    if (!isChatExpanded) {
      // Show loading screen animation
      setShowLoadingScreen(true);
      setTimeout(() => {
        setShowLoadingScreen(false);
        setIsChatExpanded(true);
      }, 2000);
    } else {
      setIsChatExpanded(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-700 ease-in-out overflow-x-hidden ${
      isPageLoaded ? 'opacity-100' : 'opacity-0'
    }`} style={{ backgroundColor: 'rgb(252, 248, 238)' }}>
      {/* Header */}
      <header className="relative bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">O</span>
            </div>
            <h1 className="text-2xl font-bold font-heading">OrderFi</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {availableTokens} tokens
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/landing-page')}
            >
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to OrderFi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your AI-powered restaurant ordering assistant. Chat with me to explore the menu, place orders, and get personalized recommendations.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">View Menu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Browse our full menu with categories and pricing</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">View your past orders and reorder favorites</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Check your loyalty points and available rewards</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Items */}
        <section>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Featured Today</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-video bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-2xl">🍔</span>
                </div>
                <h4 className="font-semibold mb-2">Signature Burger</h4>
                <p className="text-sm text-gray-600 mb-2">Fresh beef patty with special sauce</p>
                <p className="font-bold text-orange-600">$12.99</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="aspect-video bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-2xl">🍕</span>
                </div>
                <h4 className="font-semibold mb-2">Margherita Pizza</h4>
                <p className="text-sm text-gray-600 mb-2">Classic tomato, mozzarella, and basil</p>
                <p className="font-bold text-orange-600">$15.99</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="aspect-video bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-2xl">🥗</span>
                </div>
                <h4 className="font-semibold mb-2">Caesar Salad</h4>
                <p className="text-sm text-gray-600 mb-2">Crisp romaine with house dressing</p>
                <p className="font-bold text-orange-600">$8.99</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Loading Screen Animation */}
      {showLoadingScreen && (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30" />
          
          {/* Center content */}
          <div className="relative z-10 text-center text-white">
            <div className="text-5xl font-bold mb-4 animate-bounce font-heading">
              OrderFi
            </div>
            <div className="text-xl animate-pulse">
              Launching AI Assistant...
            </div>
          </div>
          
          {/* Morphing circles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20 animate-ping"
                style={{
                  width: `${(i + 1) * 100}px`,
                  height: `${(i + 1) * 100}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Clean Chat Interface */}
      {isChatExpanded && (
        <div className={`fixed inset-0 z-[8000] flex items-center justify-center animate-in fade-in duration-300 ${isKeyboardOpen ? 'items-start pt-20' : 'items-center'}`}>
          {/* Blurred Background */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          {/* Close Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsChatExpanded(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
          >
            ×
          </Button>

          {/* Chat Interface */}
          <div className="relative w-full max-w-md mx-4">
            {/* Messages Area */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-4 min-h-[400px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 space-y-4 mb-6">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-800 text-lg mb-2 font-light tracking-wide">
                      Hi, I'm your AI assistant
                    </div>
                    <div className="text-gray-600 text-sm font-light tracking-wider">
                      How can I help you today?
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-xl ${
                          message.isUser
                            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="text-sm leading-relaxed">
                          {message.text}
                        </div>
                        <div className={`text-xs mt-1 ${
                          message.isUser ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Input Area */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    onFocus={() => setIsKeyboardOpen(true)}
                    onBlur={() => setIsKeyboardOpen(false)}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isLoading}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-0 right-0 bg-transparent pointer-events-none">
        {/* AI Chat Button - Simple Design */}
        <div className="flex justify-center pointer-events-auto z-[200]">
          <Button
            onClick={handleChatToggle}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 border-0 shadow-2xl text-white hover:from-orange-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center"
            style={{ transform: 'translateY(-8px)' }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}