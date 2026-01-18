import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Mic, 
  MicOff,
  Bot,
  User,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  AlertTriangle,
  ChefHat,
  BarChart3,
  Clock,
  ShoppingCart,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StandardLayout from '@/components/StandardLayout';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

interface QuickStat {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: any;
}

export default function ManagementChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch real-time stats
  const { data: orders = [] } = useQuery<any[]>({
    queryKey: ['/api/orders'],
    retry: false,
  });

  const { data: menuItems = [] } = useQuery<any[]>({
    queryKey: ['/api/restaurants/1/menu'],
    retry: false,
  });

  // Calculate quick stats
  const todayOrders = orders.filter((o: any) => {
    const orderDate = new Date(o.created_at);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum: number, o: any) => sum + (parseFloat(o.total) || 0), 0);
  const pendingOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'preparing').length;
  const lowStockItems = menuItems.filter((item: any) => item.stock_quantity < 10).length;

  const quickStats: QuickStat[] = [
    { label: "Today's Revenue", value: `$${todayRevenue.toFixed(2)}`, trend: 'up', change: '+12%', icon: DollarSign },
    { label: 'Active Orders', value: String(pendingOrders), trend: 'neutral', icon: ShoppingCart },
    { label: 'Low Stock Items', value: String(lowStockItems), trend: lowStockItems > 0 ? 'down' : 'up', icon: Package },
    { label: 'Menu Items', value: String(menuItems.length), trend: 'neutral', icon: ChefHat }
  ];

  // Initial greeting
  useEffect(() => {
    const greeting: ChatMessage = {
      id: 'greeting',
      role: 'assistant',
      content: `Good ${getTimeOfDay()}! 👋 I'm your OrderFi business assistant.\n\nYou can ask me things like:\n• "How are sales today?"\n• "What items are running low?"\n• "Show me today's orders"\n• "Add a new menu item"\n\nWhat would you like to know?`,
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, []);

  function getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate AI response based on query
  const generateResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Revenue/Sales queries
    if (lowerMessage.includes('sales') || lowerMessage.includes('revenue') || lowerMessage.includes('money')) {
      return `📊 **Today's Performance**\n\n• Total Revenue: $${todayRevenue.toFixed(2)}\n• Orders Completed: ${todayOrders.length}\n• Average Order Value: $${todayOrders.length > 0 ? (todayRevenue / todayOrders.length).toFixed(2) : '0.00'}\n\nWould you like me to show a breakdown by category or compare to yesterday?`;
    }

    // Order queries
    if (lowerMessage.includes('order') || lowerMessage.includes('pending') || lowerMessage.includes('queue')) {
      const pending = orders.filter((o: any) => o.status === 'pending');
      const preparing = orders.filter((o: any) => o.status === 'preparing');
      const completed = orders.filter((o: any) => o.status === 'completed');
      
      return `🍽️ **Order Status**\n\n• Pending: ${pending.length} orders\n• Preparing: ${preparing.length} orders\n• Completed Today: ${completed.length} orders\n\n${pendingOrders > 5 ? '⚠️ Kitchen is getting busy!' : '✅ Kitchen is keeping up well.'}\n\nWould you like to see order details or adjust kitchen capacity?`;
    }

    // Stock/Inventory queries
    if (lowerMessage.includes('stock') || lowerMessage.includes('inventory') || lowerMessage.includes('low') || lowerMessage.includes('running out')) {
      const lowItems = menuItems.filter((item: any) => item.stock_quantity < 10);
      
      if (lowItems.length === 0) {
        return `✅ **Inventory Status: Good**\n\nAll items are well-stocked. No immediate restocking needed.\n\nWould you like me to set up automatic low-stock alerts?`;
      }
      
      return `⚠️ **Low Stock Alert**\n\n${lowItems.length} items need attention:\n\n${lowItems.slice(0, 5).map((item: any) => `• ${item.name}: ${item.stock_quantity || 0} left`).join('\n')}\n\nWould you like me to create a reorder list or adjust menu availability?`;
    }

    // Menu queries
    if (lowerMessage.includes('menu') || lowerMessage.includes('item') || lowerMessage.includes('dish')) {
      const categories = Array.from(new Set(menuItems.map((item: any) => item.category)));
      return `📋 **Menu Overview**\n\n• Total Items: ${menuItems.length}\n• Categories: ${categories.join(', ')}\n\nTop sellers today:\n${menuItems.slice(0, 3).map((item: any) => `• ${item.name} - $${parseFloat(item.price).toFixed(2)}`).join('\n')}\n\nWould you like to add, update, or remove menu items?`;
    }

    // Help queries
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do') || lowerMessage.includes('commands')) {
      return `🤖 **I can help you with:**\n\n**Sales & Revenue**\n• "How are sales today?"\n• "Compare to last week"\n\n**Orders**\n• "Show pending orders"\n• "How's the kitchen doing?"\n\n**Inventory**\n• "What's running low?"\n• "Update stock levels"\n\n**Menu**\n• "Show menu items"\n• "Add a new dish"\n\nJust ask naturally - I'll understand!`;
    }

    // Staff queries
    if (lowerMessage.includes('staff') || lowerMessage.includes('employee') || lowerMessage.includes('team')) {
      return `👥 **Staff Overview**\n\nYour team management features include:\n• Shift scheduling\n• Performance tracking\n• Role management\n\nWould you like to view today's schedule or manage staff roles?`;
    }

    // Default response
    return `I'm not quite sure what you're looking for. Try asking about:\n\n• **Sales**: "How's business today?"\n• **Orders**: "Show me pending orders"\n• **Inventory**: "What's running low?"\n• **Menu**: "Show me the menu"\n\nOr say "help" for a full list of what I can do!`;
  };

  // Handle send message
  const handleSend = async (directMessage?: string) => {
    const messageToSend = directMessage || inputValue;
    if (!messageToSend.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    const response = await generateResponse(messageToSend);
    
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsProcessing(false);
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({ title: "Voice not supported", description: "Your browser doesn't support voice input", variant: "destructive" });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const quickActions = [
    { label: "Today's sales", icon: DollarSign },
    { label: "Pending orders", icon: ShoppingCart },
    { label: "Low stock items", icon: AlertTriangle },
    { label: "Help", icon: HelpCircle }
  ];

  return (
    <StandardLayout>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b bg-orange-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="text-white">
                <h1 className="font-bold text-lg">Management Assistant</h1>
                <p className="text-sm opacity-90">Ask me anything about your restaurant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Quick Stats Bar */}
            <div className="flex-shrink-0 p-4 border-b bg-gray-50 dark:bg-gray-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickStats.map((stat, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${
                        stat.trend === 'up' ? 'bg-green-100 text-green-600' :
                        stat.trend === 'down' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[85%]`}>
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-orange-500 text-white'
                            : 'bg-white dark:bg-gray-800 border shadow-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 border rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex-shrink-0 p-4 border-t bg-white dark:bg-gray-900">
              <div className="max-w-3xl mx-auto">
                {/* Quick Actions */}
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputValue(action.label)}
                      className="flex-shrink-0"
                    >
                      <action.icon className="w-4 h-4 mr-1" />
                      {action.label}
                    </Button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleVoiceInput}
                    className={isListening ? 'bg-red-100 text-red-600 border-red-300' : ''}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                  
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about your restaurant..."
                    className="flex-1"
                  />
                  
                  <Button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isProcessing}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}