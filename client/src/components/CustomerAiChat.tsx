import React, { useState, useRef, useEffect } from 'react';
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
  Minus,
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

// Move component definition before main component
const SuggestionChips = React.memo(({ chatContext, messages, chatState, setChatState }: {
  chatContext: 'customer' | 'onboarding' | 'operations';
  messages: ChatMessage[];
  chatState: any;
  setChatState: (state: any) => void;
}) => {
  const isOnboarded = localStorage.getItem('orderfi-onboarding-completed');
  const lastMessage = messages[messages.length - 1];
  
  let suggestions: string[] = [];
  
  if (!isOnboarded) {
    suggestions = ["What's your restaurant called?", "Upload my menu", "Show me a demo"];
  } else if (lastMessage?.content.includes('live on OrderFi')) {
    suggestions = ["Generate QR code", "View dashboard", "Show menu"];
  } else if (chatContext === 'operations') {
    suggestions = ["Kitchen status", "Daily sales", "Menu analytics"];
  } else {
    suggestions = ["Take an order", "Menu updates", "Check inventory"];
  }
  
  if (suggestions.length === 0) return null;

  return (
    <div style={{ padding: '8px 16px 0 16px' }}>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => {
              const newState = { ...chatState, inputValue: suggestion };
              setChatState(newState);
            }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
});

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
  const { 
    isSidebarMode, 
    setIsSidebarMode, 
    chatState, 
    setChatState, 
    isLoading, 
    setIsLoading,
    chatContext,
    setChatContext,
    onboardingState,
    setOnboardingState
  } = useChatContext();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [position, setPosition] = useState<Position>(getPersistedPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // Removed shouldAnimate to prevent page change animations
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const hasPromptedOnboarding = useRef(false);

  const { messages, inputValue, isListening } = chatState;

  // Auto-prompt for onboarding - only once per browser session
  useEffect(() => {
    const isOnboarded = localStorage.getItem('orderfi-onboarding-completed');
    const hasShownWelcome = sessionStorage.getItem('orderfi-welcome-shown');
    
    // Only trigger if: chat opened for first time AND not onboarded AND welcome not shown AND messages is just default
    if (isOpen && !isOnboarded && !hasShownWelcome && !hasPromptedOnboarding.current && messages.length === 1) {
      hasPromptedOnboarding.current = true;
      sessionStorage.setItem('orderfi-welcome-shown', 'true');
      
      setChatContext('onboarding');
      const onboardingWelcome: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Welcome to OrderFi! 🍽️ 

I'll help you set up your restaurant in just a few minutes through conversation - no forms or complexity.

Ready to get started? Just tell me your restaurant's name and I'll guide you through the rest!`,
        timestamp: new Date(),
        status: 'sent'
      };
      
      setChatState({
        ...chatState,
        messages: [...messages, onboardingWelcome]
      });
    }
  }, [isOpen]); // Only depend on isOpen to prevent retriggering

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Watch for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Animation completely disabled to prevent page change issues

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
      <div 
        ref={chatRef}
        className={`fixed z-50 ${
          isDragging ? 'cursor-grabbing transition-none' : 'cursor-grab transition-all duration-500 ease-out'
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
      {/* Clean chat dialog with perfect rounded corners */}
      <div 
        style={{
          background: isDarkMode 
            ? 'linear-gradient(145deg, rgba(236, 72, 153, 0.85), rgba(88, 28, 135, 0.85))'
            : 'linear-gradient(145deg, rgba(249, 115, 22, 0.85), rgba(236, 72, 153, 0.85))',
          borderRadius: '28px',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
        }}>
        
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden relative sentient-orb-mini">
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 w-full h-full pointer-events-none text-white">
                    <svg className="w-0.5 h-0.5 absolute ai-cascade-1" style={{ top: '25%', left: '12%', transform: 'rotate(45deg)' }} viewBox="0 0 24 24" fill="white">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                    </svg>
                    <svg className="w-0.5 h-0.5 absolute ai-cascade-2" style={{ top: '72%', left: '18%', transform: 'rotate(-67deg)' }} viewBox="0 0 24 24" fill="white">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                    </svg>
                    <svg className="w-0.5 h-0.5 absolute ai-cascade-3" style={{ top: '15%', left: '50%', transform: 'rotate(123deg)', animationDelay: '1.5s' }} viewBox="0 0 24 24" fill="white">
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                    </svg>
                  </div>
                  <svg className="w-4 h-4 text-white relative z-10 ai-star-pulse star-no-rotate" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 style={{ color: 'white', fontSize: '15px', fontWeight: '600', margin: 0 }}>ChatOps</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: 0 }}>Online</p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={toggleSidebarMode}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={isSidebarMode ? "Float chat" : "Snap to sidebar"}
              >
                {isSidebarMode ? (
                  <Move className="w-4 h-4 text-white" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={() => {
                  setIsSidebarMode(true);
                  onToggle(); // Close the floating dialog
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Minimize to sidebar"
              >
                <Minus className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={onToggle}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '12px 16px' }}>
          <ScrollArea ref={scrollAreaRef} className="h-full">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ maxWidth: '85%' }}>
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: message.type === 'user' ? '20px 20px 8px 20px' : '20px 20px 20px 8px',
                        backgroundColor: message.type === 'user' 
                          ? '#f97316' 
                          : isDarkMode 
                            ? 'rgba(147, 51, 234, 0.8)' // Purple-600 with transparency
                            : 'rgba(249, 115, 22, 0.1)', // Light orange tint
                        color: message.type === 'user' ? 'white' : isDarkMode ? 'white' : '#111827',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.4' }}>{message.content}</p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '4px',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    backgroundColor: isDarkMode 
                      ? 'rgba(147, 51, 234, 0.8)' // Purple-600 with transparency to match ChatOps bubble
                      : 'rgba(249, 115, 22, 0.1)', // Light orange tint to match ChatOps bubble
                    borderRadius: '20px 20px 20px 8px',
                    padding: '12px 16px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-white/70' : 'bg-orange-500'}`}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-white/70' : 'bg-orange-500'}`} style={{ animationDelay: '0.1s' }}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-white/70' : 'bg-orange-500'}`} style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Suggestion Chips */}
        <SuggestionChips 
          chatContext={chatContext}
          messages={messages}
          chatState={chatState}
          setChatState={setChatState}
        />

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <div 
                className="relative"
                style={{
                  borderRadius: '22px',
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)',
                  backgroundSize: '300% 100%',
                  animation: 'gradientShift 3s ease infinite',
                  padding: '1px'
                }}
              >
                <div style={{
                  borderRadius: '21px',
                  backgroundColor: '#ffffff',
                  position: 'relative',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  width: '100%',
                  height: '100%'
                }}>
                <input
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Message..."
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#111827'
                  }}
                />
                <button
                  onClick={toggleVoiceInput}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isListening ? '#ef4444' : 'rgba(156,163,175,0.8)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-white" />
                  ) : (
                    <Mic className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: !inputValue.trim() || isLoading ? 'rgba(255,255,255,0.3)' : 'white',
                color: !inputValue.trim() || isLoading ? 'rgba(255,255,255,0.5)' : '#f97316',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !inputValue.trim() || isLoading ? 'not-allowed' : 'pointer',
                zIndex: 10,
                position: 'relative',
                flexShrink: 0
              }}
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