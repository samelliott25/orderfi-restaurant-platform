import { useState, useRef, useEffect } from 'react';
import { useChatContext } from '@/contexts/ChatContext';
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
  Popcorn as PopcornIcon,
  ChevronRight,
  Move
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

interface Position {
  x: number;
  y: number;
}

// Global state for persistent chat conversation and position
const CHAT_STORAGE_KEY = 'orderfi-chat-state';
const POSITION_STORAGE_KEY = 'orderfi-chat-position';

const getPersistedChatState = () => {
  try {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        messages: parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      };
    }
  } catch (error) {
    console.warn('Failed to load chat state:', error);
  }
  return {
    messages: [
      {
        id: '1',
        type: 'assistant',
        content: 'Hi! I\'m your AI assistant. How can I help you today?',
        timestamp: new Date(),
        status: 'sent'
      }
    ],
    inputValue: '',
    isListening: false
  };
};

const getPersistedPosition = (): Position => {
  try {
    const saved = localStorage.getItem(POSITION_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load chat position:', error);
  }
  return { x: 50, y: 50 }; // Default center position (percentages)
};

export function CustomerAiChat({ isOpen, onToggle }: CustomerAiChatProps) {
  const { isSidebarMode, setIsSidebarMode, chatState, setChatState, isLoading, setIsLoading } = useChatContext();
  const [position, setPosition] = useState<Position>(getPersistedPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  const { messages, inputValue, isListening } = chatState;

  // Track whether chat should animate on mount
  useEffect(() => {
    // Only animate if this is the first time opening (not a page navigation)
    const chatOpenKey = 'orderfi-chat-first-open';
    const hasOpenedBefore = sessionStorage.getItem(chatOpenKey);
    
    if (isOpen && !hasOpenedBefore) {
      setShouldAnimate(true);
      sessionStorage.setItem(chatOpenKey, 'true');
    } else if (!isOpen) {
      // Clear the flag when chat is closed so it can animate again when reopened
      sessionStorage.removeItem(chatOpenKey);
      setShouldAnimate(false);
    } else {
      setShouldAnimate(false);
    }
  }, [isOpen]);

  // Use global chat state persistence

  // Persist position to localStorage
  const persistPosition = (newPosition: Position) => {
    setPosition(newPosition);
    localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(newPosition));
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!chatRef.current) return;
    
    const rect = chatRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !chatRef.current) return;
    
    const newX = ((e.clientX - dragOffset.x) / window.innerWidth) * 100;
    const newY = ((e.clientY - dragOffset.y) / window.innerHeight) * 100;
    
    // Constrain to viewport
    const constrainedX = Math.max(0, Math.min(85, newX)); // 85% to account for chat width
    const constrainedY = Math.max(0, Math.min(85, newY)); // 85% to account for chat height
    
    persistPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

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

    const newState = {
      ...chatState,
      messages: [...messages, userMessage],
      inputValue: ''
    };
    setChatState(newState);
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
      const finalState = {
        ...newState,
        messages: [...newState.messages, aiResponse]
      };
      setChatState(finalState);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSidebarMode = () => {
    setIsSidebarMode(!isSidebarMode);
    if (!isSidebarMode) {
      // Snap to right side
      setPosition({ x: 75, y: 10 });
    } else {
      // Return to center position
      setPosition({ x: 35, y: 20 });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = { ...chatState, inputValue: e.target.value };
    setChatState(newState);
  };

  const toggleVoiceInput = () => {
    const newState = { ...chatState, isListening: !isListening };
    setChatState(newState);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop blur overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
        onClick={onToggle}
      />
      
      <div 
        ref={chatRef}
        className={`fixed z-50 transition-all ${
          shouldAnimate ? 'animate-in slide-in-from-bottom-4 duration-500' : ''
        } ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${
          isSidebarMode 
            ? 'w-80 h-screen top-0 right-0' 
            : // Mobile: Full screen with sidebar space, Desktop: Normal size
              'inset-0 left-[60px] w-[calc(100vw-60px)] h-screen md:inset-auto md:left-auto md:w-96 md:h-[520px]'
        }`}
        style={isSidebarMode ? {
          opacity: 0.9
        } : {
          // Desktop positioning only (mobile uses CSS classes above)
          ...(typeof window !== 'undefined' && window.innerWidth > 768 ? {
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(0, 0)'
          } : {}),
          opacity: 0.9
        }}
        onMouseDown={!isSidebarMode ? handleMouseDown : undefined}
      >
      {/* iOS-style glass card with OrderFi gradient theme - translucent */}
      <div className="w-full h-full rounded-[28px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-[20px] border border-white/20"
           style={{
             background: 'linear-gradient(145deg, hsl(25, 95%, 53%) 0%, hsl(340, 82%, 52%) 100%)',
             boxShadow: `
               0 8px 32px rgba(0, 0, 0, 0.15),
               0 2px 8px rgba(0, 0, 0, 0.1),
               inset 0 1px 0 rgba(255, 255, 255, 0.3),
               inset 0 -1px 0 rgba(0, 0, 0, 0.1)
             `
           }}>
        
        {/* Subtle top gradient highlight - iOS style */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
        
        {/* iOS-style header with frosted glass effect */}
        <div className="relative px-6 py-4 border-b border-white/20 bg-gradient-to-b from-white/15 to-transparent backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Modern iOS-style avatar with OrderFi theme */}
              <div className="w-10 h-10 rounded-full bg-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Bot className="w-5 h-5 text-white drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-[600] text-white text-[15px] tracking-[-0.01em] drop-shadow-sm">ChatOps</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_4px_rgba(34,197,94,0.6)]"></div>
                  <p className="text-[13px] text-white/80 font-[500]">Online</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Snap to sidebar arrow button */}
              <button
                onClick={toggleSidebarMode}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.2)] active:scale-95 backdrop-blur-sm border border-white/30"
                title={isSidebarMode ? "Float chat" : "Snap to sidebar"}
              >
                {isSidebarMode ? (
                  <Move className="w-4 h-4 text-white" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white" />
                )}
              </button>
              {/* iOS-style close button */}
              <button
                onClick={onToggle}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.2)] active:scale-95 backdrop-blur-sm border border-white/30"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages area with iOS scroll behavior */}
        <div className={`flex-1 overflow-hidden bg-white/5 backdrop-blur-sm ${
          isSidebarMode ? 'h-[calc(100vh-140px)]' : 'h-[calc(100vh-140px)] md:h-[350px]'
        }`}>
          <ScrollArea 
            ref={scrollAreaRef}
            className="h-full px-4 py-3"
          >
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%] group">
                    <div
                      className={`px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm border ${
                        message.type === 'user'
                          ? 'bg-white/90 text-gray-900 rounded-[20px] rounded-br-[8px] ml-auto border-white/30'
                          : 'bg-white/20 text-white rounded-[20px] rounded-bl-[8px] border-white/20'
                      }`}
                    >
                      <p className="text-[15px] leading-[1.4] font-[400]">{message.content}</p>
                    </div>
                    <div className={`flex items-center mt-1 space-x-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[11px] text-white/70 font-[500] drop-shadow-sm">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {message.type === 'user' && (
                        <div>
                          {message.status === 'sending' && (
                            <Clock className="w-3 h-3 text-white/60" />
                          )}
                          {message.status === 'sent' && (
                            <CheckCircle className="w-3 h-3 text-white/80" />
                          )}
                          {message.status === 'error' && (
                            <AlertCircle className="w-3 h-3 text-red-300" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/20 rounded-[20px] rounded-bl-[8px] px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-sm border border-white/20">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* iOS-style input bar with OrderFi theme */}
        <div className="relative px-4 py-3 border-t border-white/20 bg-gradient-to-t from-white/10 to-transparent backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <div className="relative rounded-[22px] bg-white/90 backdrop-blur-sm border border-white/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                <input
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Message..."
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-12 bg-transparent border-0 outline-none text-[15px] text-gray-900 placeholder-gray-500 font-[400]"
                />
                <button
                  onClick={toggleVoiceInput}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center ${
                    isListening 
                      ? 'bg-red-500 text-white shadow-[0_2px_8px_rgba(239,68,68,0.3)]' 
                      : 'bg-gray-200/80 text-gray-600 hover:bg-gray-300/80'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            {/* iOS-style send button with OrderFi theme */}
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center ${
                !inputValue.trim() || isLoading
                  ? 'bg-white/30 text-white/50 cursor-not-allowed'
                  : 'bg-white text-orange-500 hover:bg-white/90 active:scale-95 shadow-[0_4px_12px_rgba(255,255,255,0.3)]'
              }`}
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}