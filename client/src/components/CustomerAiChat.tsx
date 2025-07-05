import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  X,
  Sparkles,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Star,
  Coffee,
  Utensils,
  DollarSign,
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  ThumbsUp,
  Smile,
  ChefHat,
  Flame,
  Leaf,
  Timer,
  Award,
  TrendingUp,
  Target,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  Share,
  Copy,
  Link,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Save,
  FileText,
  Image,
  Video,
  Music,
  Headphones,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Repeat,
  Shuffle,
  Radio,
  Tv,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Watch,
  Camera,
  Printer,
  Scanner,
  Keyboard,
  Mouse,
  Gamepad2,
  Joystick,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Spade,
  Club,
  Diamond,
  Heart as HeartIcon,
  Crown,
  Shield,
  Sword,
  Wand2,
  Gem,
  Key,
  Lock,
  Unlock,
  Home,
  Building,
  Store,
  Warehouse,
  Factory,
  School,
  Hospital,
  Church,
  Landmark,
  Castle,
  Tent,
  TreePine,
  Mountain,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Snowflake,
  Droplets,
  Waves,
  Fish,
  Bird,
  Butterfly,
  Bug,
  Flower,
  Flower2,
  Seedling,
  Trees,
  Cactus,
  Palmtree,
  Apple,
  Banana,
  Cherry,
  Grape,
  Orange,
  Strawberry,
  Carrot,
  Broccoli,
  Corn,
  Wheat,
  Milk,
  Egg,
  Beef,
  Drumstick,
  Pizza,
  Sandwich,
  Cookie,
  Cake,
  IceCream,
  Donut,
  Candy,
  Lollipop,
  Croissant,
  Bagel,
  Pretzel,
  Popcorn,
  Salad,
  Soup,
  Ramen,
  Sushi,
  Taco,
  Burrito,
  Hotdog,
  Fries,
  Popcorn as PopcornIcon
} from 'lucide-react';

interface CustomerAiChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export function CustomerAiChat({ isOpen, onToggle }: CustomerAiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hi! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date(),
      status: 'sent'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I understand you\'re looking for help. Let me assist you with that!',
        timestamp: new Date(),
        status: 'sent'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ marginLeft: '256px' }}
    >
      <div 
        className="w-96 h-[500px] rounded-2xl shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 duration-300 relative overflow-hidden"
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
                width: `${8 + i * 2}px`,
                height: `${8 + i * 2}px`,
                background: `rgba(255, 255, 255, ${0.1 + i * 0.05})`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.3}s`
              }}
            />
          ))}
        </div>

        {/* Chat Header */}
        <div className="relative z-10 p-4 border-b border-white/20 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>
                <p className="text-xs text-white/70">Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea 
          ref={scrollAreaRef}
          className="flex-1 h-[320px] p-4 bg-white/10 backdrop-blur-sm"
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-white text-orange-600 rounded-br-sm'
                      : 'bg-black/20 text-white rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {message.type === 'user' && (
                      <div className="ml-2">
                        {message.status === 'sending' && (
                          <Clock className="w-3 h-3 opacity-70" />
                        )}
                        {message.status === 'sent' && (
                          <CheckCircle className="w-3 h-3 opacity-70" />
                        )}
                        {message.status === 'error' && (
                          <AlertCircle className="w-3 h-3 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-black/20 text-white rounded-2xl rounded-bl-sm px-4 py-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="relative z-10 p-4 border-t border-white/20 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="pr-10 bg-white/90 border-white/20 text-gray-900 placeholder-gray-500 focus:bg-white"
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVoiceInput}
                className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 ${
                  isListening ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-white text-orange-600 hover:bg-white/90 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}