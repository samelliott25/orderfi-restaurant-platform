import { useState } from 'react';
import { ThreeOrb } from './ThreeOrb';
import { Button } from './ui/button';
import { MessageSquare, X, Sparkles } from 'lucide-react';

interface UniversalOrbChatProps {
  pageContext: string; // 'customer' | 'admin' | 'kitchen' | 'analytics'
  className?: string;
}

export function UniversalOrbChat({ pageContext, className = '' }: UniversalOrbChatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>([]);
  const [currentInput, setCurrentInput] = useState('');

  const getContextualGreeting = () => {
    switch (pageContext) {
      case 'admin':
        return 'Hi! I can help you with restaurant operations, analytics, and management tasks.';
      case 'kitchen':
        return 'Hello! I can assist with orders, recipes, and kitchen operations.';
      case 'analytics':
        return 'Welcome! I can help analyze your data and generate insights.';
      default:
        return 'Hi! What would you like to order today?';
    }
  };

  const getContextualActions = () => {
    switch (pageContext) {
      case 'admin':
        return [
          { label: '📊 Show Analytics', action: 'show-analytics' },
          { label: '📋 Recent Orders', action: 'recent-orders' },
          { label: '👥 Staff Status', action: 'staff-status' },
          { label: '💰 Revenue Report', action: 'revenue-report' }
        ];
      case 'kitchen':
        return [
          { label: '🍳 Active Orders', action: 'active-orders' },
          { label: '⏰ Order Times', action: 'order-times' },
          { label: '📝 Recipes', action: 'recipes' },
          { label: '📊 Kitchen Stats', action: 'kitchen-stats' }
        ];
      case 'analytics':
        return [
          { label: '📈 Sales Trends', action: 'sales-trends' },
          { label: '🔥 Popular Items', action: 'popular-items' },
          { label: '⏱️ Peak Hours', action: 'peak-hours' },
          { label: '💡 Insights', action: 'insights' }
        ];
      default:
        return [
          { label: '🍽️ Menu', action: 'show-menu' },
          { label: '✨ Surprise Me', action: 'recommend' },
          { label: '🌟 Special', action: 'specials' },
          { label: '🔥 Popular', action: 'popular' }
        ];
    }
  };

  const handleActionClick = (action: string) => {
    const userMessage = {
      id: Date.now().toString(),
      text: `${action.replace('-', ' ')}`,
      isUser: true,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: `I'll help you with ${action.replace('-', ' ')}. Processing your request...`,
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  if (!isExpanded) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={() => setIsExpanded(true)}
          className="relative group"
        >
          <ThreeOrb className="w-16 h-16 transform transition-all duration-300 hover:scale-110" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <MessageSquare className="h-5 w-5 text-white opacity-80" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
            AI
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm ${className}`}>
      <div className="absolute inset-4 bg-black/80 rounded-3xl backdrop-blur-xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <ThreeOrb className="w-10 h-10" />
            <div>
              <h3 className="text-white font-medium">OrderFi AI</h3>
              <p className="text-white/60 text-sm">{pageContext} assistant</p>
            </div>
          </div>
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
          {chatMessages.length === 0 ? (
            <div className="text-center space-y-6">
              <div className="text-white/90 text-lg">{getContextualGreeting()}</div>
              
              {/* Action Bubbles */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                {getContextualActions().map((action) => (
                  <button
                    key={action.action}
                    onClick={() => handleActionClick(action.action)}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white text-sm backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.isUser
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/20 text-white border border-white/30'
                    }`}
                  >
                    <div className="text-sm">{message.text}</div>
                    <div className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/20">
          <div className="flex gap-3">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && currentInput.trim()) {
                  const userMessage = {
                    id: Date.now().toString(),
                    text: currentInput,
                    isUser: true,
                    timestamp: new Date()
                  };
                  setChatMessages(prev => [...prev, userMessage]);
                  setCurrentInput('');
                  
                  // Simulate AI response
                  setTimeout(() => {
                    const aiResponse = {
                      id: (Date.now() + 1).toString(),
                      text: "I understand your request. Let me help you with that!",
                      isUser: false,
                      timestamp: new Date()
                    };
                    setChatMessages(prev => [...prev, aiResponse]);
                  }, 1000);
                }
              }}
            />
            <Button
              onClick={() => {
                if (currentInput.trim()) {
                  const userMessage = {
                    id: Date.now().toString(),
                    text: currentInput,
                    isUser: true,
                    timestamp: new Date()
                  };
                  setChatMessages(prev => [...prev, userMessage]);
                  setCurrentInput('');
                }
              }}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}