import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import { useLocation } from 'wouter';
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
import { ChatOpsSettings, ChatOpsSettingsConfig, defaultChatOpsConfig } from '@/components/admin/ChatOpsSettings';

// Settings storage keys
const SETTINGS_KEYS = {
  notifyFreq: 'chatops_notify_freq',
  alertTypes: 'chatops_alert_types',
  soundEnabled: 'chatops_sound_enabled',
  soundVolume: 'chatops_sound_volume',
  aiModel: 'chatops_ai_model',
  autoModel: 'chatops_auto_model',
  language: 'chatops_language',
  tone: 'chatops_tone',
  responseLength: 'chatops_response_length'
};

// Default settings
const DEFAULT_SETTINGS = {
  notifyFreq: 'medium',
  alertTypes: ['orders', 'inventory'],
  soundEnabled: 'on',
  soundVolume: 70,
  aiModel: 'fast',
  autoModel: 'on',
  language: 'english',
  tone: 'professional',
  responseLength: 'detailed'
};

// Command parser for settings
const parseSettingsCommand = (input: string): { success: boolean; response: string; } => {
  const parts = input.toLowerCase().split(' ');
  
  // Handle base /settings command
  if (input.trim() === '/settings') {
    return {
      success: true,
      response: `⚙️ **ChatOps Settings Commands:**

📢 **Notifications:**
• \`/settings notifications frequency [high/medium/low/mute]\` - Set alert frequency
• \`/settings notifications types [orders/inventory/alerts] [on/off]\` - Toggle alert types
• \`/settings notifications sound [on/off/volume N]\` - Control sound alerts

🤖 **AI Model:**
• \`/settings ai model [fast/advanced/custom]\` - Choose AI model
• \`/settings ai auto [on/off]\` - Enable auto-model selection
• \`/settings language [english/spanish]\` - Set language
• \`/settings tone [professional/casual/concise]\` - Set response tone
• \`/settings response [short/detailed]\` - Set response length

🔄 **Reset:**
• \`/settings reset\` - Reset all settings to defaults

Type any command to configure your ChatOps experience!`
    };
  }

  // Parse notification frequency
  if (parts[0] === '/settings' && parts[1] === 'notifications' && parts[2] === 'frequency') {
    const option = parts[3];
    if (['high', 'medium', 'low', 'mute'].includes(option)) {
      localStorage.setItem(SETTINGS_KEYS.notifyFreq, option);
      return { success: true, response: `✅ Notification frequency set to **${option}**.` };
    } else {
      return { success: false, response: '❌ Invalid option. Use: high/medium/low/mute' };
    }
  }

  // Parse alert types toggle
  if (parts[0] === '/settings' && parts[1] === 'notifications' && parts[2] === 'types') {
    const type = parts[3];
    const action = parts[4];
    
    if (!['orders', 'inventory', 'alerts'].includes(type)) {
      return { success: false, response: '❌ Invalid type. Use: orders/inventory/alerts' };
    }
    
    if (!['on', 'off'].includes(action)) {
      return { success: false, response: '❌ Invalid action. Use: on/off' };
    }
    
    let types = JSON.parse(localStorage.getItem(SETTINGS_KEYS.alertTypes) || JSON.stringify(DEFAULT_SETTINGS.alertTypes));
    
    if (action === 'on' && !types.includes(type)) {
      types.push(type);
    } else if (action === 'off') {
      types = types.filter((t: string) => t !== type);
    }
    
    localStorage.setItem(SETTINGS_KEYS.alertTypes, JSON.stringify(types));
    return { success: true, response: `✅ ${type} alerts turned **${action}**. Active: ${types.join(', ')}` };
  }

  // Parse sound controls
  if (parts[0] === '/settings' && parts[1] === 'notifications' && parts[2] === 'sound') {
    const option = parts[3];
    
    if (option === 'on' || option === 'off') {
      localStorage.setItem(SETTINGS_KEYS.soundEnabled, option);
      return { success: true, response: `✅ Sound notifications **${option}**.` };
    } else if (option === 'volume' && parts[4]) {
      const volume = parseInt(parts[4]);
      if (volume >= 0 && volume <= 100) {
        localStorage.setItem(SETTINGS_KEYS.soundVolume, volume.toString());
        return { success: true, response: `✅ Sound volume set to **${volume}%**.` };
      } else {
        return { success: false, response: '❌ Volume must be between 0-100' };
      }
    } else {
      return { success: false, response: '❌ Use: on/off or volume [0-100]' };
    }
  }

  // Parse AI model selection
  if (parts[0] === '/settings' && parts[1] === 'ai' && parts[2] === 'model') {
    const model = parts[3];
    if (['fast', 'advanced', 'custom'].includes(model)) {
      localStorage.setItem(SETTINGS_KEYS.aiModel, model);
      return { success: true, response: `✅ AI model set to **${model}**.` };
    } else {
      return { success: false, response: '❌ Invalid model. Use: fast/advanced/custom' };
    }
  }

  // Parse auto-model toggle
  if (parts[0] === '/settings' && parts[1] === 'ai' && parts[2] === 'auto') {
    const option = parts[3];
    if (['on', 'off'].includes(option)) {
      localStorage.setItem(SETTINGS_KEYS.autoModel, option);
      return { success: true, response: `✅ Auto-model selection **${option}**.` };
    } else {
      return { success: false, response: '❌ Use: on/off' };
    }
  }

  // Parse language setting
  if (parts[0] === '/settings' && parts[1] === 'language') {
    const language = parts[2];
    if (['english', 'spanish'].includes(language)) {
      localStorage.setItem(SETTINGS_KEYS.language, language);
      return { success: true, response: `✅ Language set to **${language}**.` };
    } else {
      return { success: false, response: '❌ Supported languages: english/spanish' };
    }
  }

  // Parse tone setting
  if (parts[0] === '/settings' && parts[1] === 'tone') {
    const tone = parts[2];
    if (['professional', 'casual', 'concise'].includes(tone)) {
      localStorage.setItem(SETTINGS_KEYS.tone, tone);
      return { success: true, response: `✅ Response tone set to **${tone}**.` };
    } else {
      return { success: false, response: '❌ Available tones: professional/casual/concise' };
    }
  }

  // Parse response length
  if (parts[0] === '/settings' && parts[1] === 'response') {
    const length = parts[2];
    if (['short', 'detailed'].includes(length)) {
      localStorage.setItem(SETTINGS_KEYS.responseLength, length);
      return { success: true, response: `✅ Response length set to **${length}**.` };
    } else {
      return { success: false, response: '❌ Options: short/detailed' };
    }
  }

  // Parse reset command
  if (parts[0] === '/settings' && parts[1] === 'reset') {
    // Clear all settings
    Object.values(SETTINGS_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return { success: true, response: `✅ All settings reset to defaults. Use \`/settings\` to see available options.` };
  }

  return { success: false, response: '❌ Unknown command. Type `/settings` for help.' };
};

// Notification filtering logic
const shouldShowNotification = (notificationType: string, isCritical: boolean = false): boolean => {
  const notifyFreq = localStorage.getItem(SETTINGS_KEYS.notifyFreq) || DEFAULT_SETTINGS.notifyFreq;
  const alertTypes = JSON.parse(localStorage.getItem(SETTINGS_KEYS.alertTypes) || JSON.stringify(DEFAULT_SETTINGS.alertTypes));
  
  // Check if notification type is enabled
  if (!alertTypes.includes(notificationType)) return false;
  
  // Check frequency settings
  if (notifyFreq === 'mute') return false;
  if (notifyFreq === 'low' && !isCritical) return false;
  
  return true;
};

// Audio notification function
const playNotificationSound = (volume?: number): void => {
  const soundEnabled = localStorage.getItem(SETTINGS_KEYS.soundEnabled) || DEFAULT_SETTINGS.soundEnabled;
  const soundVolume = parseInt(localStorage.getItem(SETTINGS_KEYS.soundVolume) || DEFAULT_SETTINGS.soundVolume.toString());
  
  if (soundEnabled === 'off') return;
  
  // Create audio notification (basic implementation)
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyAzvLZjj0JFmS57+OZSA0PVqzn7q9gHAU9k9nwyJFCDBdpvO3nmmEhAIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyAzvLZjj0JFmS57+OZSA0PVqzn7q9gHAU9k9nwyJFCDBdpvO3nmmEhAA==');
  audio.volume = (volume || soundVolume) / 100;
  audio.play().catch(() => {}); // Ignore errors if audio can't play
};

// Move component definition before main component
const SuggestionChips = React.memo(({ chatContext, messages, chatState, setChatState }: {
  chatContext: 'customer' | 'onboarding' | 'operations';
  messages: ChatMessage[];
  chatState: any;
  setChatState: (state: any) => void;
}) => {
  const [location] = useLocation();
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const isOnboarded = localStorage.getItem('orderfi-onboarding-completed') === 'true';
  const lastMessage = messages[messages.length - 1];
  
  // Generate contextual suggestions based on current page
  const getContextualSuggestions = (currentPath: string) => {
    const pathSuggestions = {
      '/dashboard': [
        'Show today\'s sales performance',
        'Generate daily revenue report',
        'Check order completion rates'
      ],
      '/inventory': [
        'Show low stock items',
        'Create purchase orders',
        'Check inventory levels'
      ],
      '/inventory-simplified': [
        'Show low stock items',
        'Create purchase orders',
        'Check inventory levels'
      ],
      '/stock': [
        'Check stock levels',
        'Generate purchase orders',
        'Show reorder alerts'
      ],
      '/orders': [
        'Show pending orders',
        'Check order status',
        'Generate order reports'
      ],
      '/payments': [
        'Charge $50 via Stripe',
        'Collect 100 USDC',
        'Show payment history'
      ],
      '/tokenrewards': [
        'Check loyalty points',
        'Show reward analytics',
        'Generate loyalty reports'
      ],
      '/network': [
        'Check system status',
        'Show network analytics',
        'Generate system reports'
      ]
    };
    
    return pathSuggestions[currentPath] || [
      'Show business overview',
      'Generate daily report',
      'Check system status'
    ];
  };
  
  // Update suggestions when location changes
  useEffect(() => {
    let newSuggestions: string[] = [];
    
    // Set onboarding as completed for operations mode
    localStorage.setItem('orderfi-onboarding-completed', 'true');
    
    if (!isOnboarded) {
      newSuggestions = ["What's your restaurant called?", "Upload my menu", "Show me a demo"];
    } else if (lastMessage?.content.includes('live on OrderFi')) {
      newSuggestions = ["Generate QR code", "View dashboard", "Show menu"];
    } else {
      // Always use contextual suggestions based on current page when onboarded
      newSuggestions = getContextualSuggestions(location);
    }
    
    setCurrentSuggestions(newSuggestions);
  }, [location, isOnboarded, lastMessage, chatContext]);
  
  if (currentSuggestions.length === 0) return null;

  return (
    <div style={{ padding: '8px 16px 0 16px' }}>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {currentSuggestions.map((suggestion, index) => (
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
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState('64px');
  const [isMobile, setIsMobile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatConfig, setChatConfig] = useState<ChatOpsSettingsConfig>(defaultChatOpsConfig);
  // Removed shouldAnimate to prevent page change animations
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const hasPromptedOnboarding = useRef(false);

  const { messages, inputValue, isListening } = chatState;

  // Auto-prompt for onboarding - only once per browser session
  useEffect(() => {
    const isOnboarded = localStorage.getItem('orderfi-onboarding-completed') === 'true';
    const hasShownWelcome = sessionStorage.getItem('orderfi-welcome-shown');
    
    // Only trigger if: chat opened for first time AND not onboarded AND welcome not shown AND it's the very first open
    if (isOpen && !isOnboarded && !hasShownWelcome && !hasPromptedOnboarding.current) {
      // Check if we have only the default message
      if (messages.length === 1 && messages[0].content.includes("Hi! I'm your AI assistant")) {
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
    }
  }, [isOpen]); // Only depend on isOpen to prevent navigation refreshes

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

  // Listen for sidebar width changes and mobile detection
  useEffect(() => {
    const updateSidebarWidth = () => {
      const width = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width');
      setSidebarWidth(width || '64px');
    };

    const updateMobileState = () => {
      const isMobileScreen = window.innerWidth <= 768;
      setIsMobile(isMobileScreen);
      
      // Auto-set full-width mode for mobile (override sidebar mode)
      if (isMobileScreen && isSidebarMode) {
        setIsSidebarMode(false);
      }
    };

    // Initial checks
    updateSidebarWidth();
    updateMobileState();

    // Listen for sidebar toggle events
    const handleSidebarToggle = () => {
      updateSidebarWidth();
    };

    // Listen for window resize events
    const handleResize = () => {
      updateMobileState();
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarMode, setIsSidebarMode]);

  // Handle opening animation - only trigger once when opening
  useEffect(() => {
    if (isOpen && !isOpening && !isClosing) {
      setIsOpening(true);
      // Reset opening state after animation completes
      const timer = setTimeout(() => {
        setIsOpening(false);
      }, 300); // 300ms animation duration
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, isOpening, isClosing]);

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

    // Check if it's a settings command
    if (inputValue.startsWith('/settings')) {
      const commandResult = parseSettingsCommand(inputValue);
      
      const settingsResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: commandResult.response,
        timestamp: new Date(),
        status: 'sent'
      };
      
      const finalState = {
        ...newState,
        messages: [...newState.messages, settingsResponse]
      };
      setChatState(finalState);
      setIsLoading(false);
      return;
    }

    // Apply user settings to modify AI behavior
    const aiModel = localStorage.getItem(SETTINGS_KEYS.aiModel) || DEFAULT_SETTINGS.aiModel;
    const autoModel = localStorage.getItem(SETTINGS_KEYS.autoModel) || DEFAULT_SETTINGS.autoModel;
    const language = localStorage.getItem(SETTINGS_KEYS.language) || DEFAULT_SETTINGS.language;
    const tone = localStorage.getItem(SETTINGS_KEYS.tone) || DEFAULT_SETTINGS.tone;
    const responseLength = localStorage.getItem(SETTINGS_KEYS.responseLength) || DEFAULT_SETTINGS.responseLength;

    // Auto-model selection based on input length
    let selectedModel = aiModel;
    if (autoModel === 'on' && inputValue.length > 50) {
      selectedModel = 'advanced';
    }

    // Simulate AI response with settings applied
    setTimeout(() => {
      let responseContent = 'I understand you\'re looking for help. Let me assist you with that!';
      
      // Apply tone
      if (tone === 'casual') {
        responseContent = 'Hey! I got you covered. What can I help you with?';
      } else if (tone === 'concise') {
        responseContent = 'How can I help?';
      }
      
      // Apply response length
      if (responseLength === 'short') {
        responseContent = responseContent.slice(0, 50) + (responseContent.length > 50 ? '...' : '');
      } else if (responseLength === 'detailed') {
        responseContent += ' I have access to all restaurant operations data and can provide detailed analysis and recommendations.';
      }
      
      // Apply language (basic implementation)
      if (language === 'spanish') {
        responseContent = '¡Entiendo que buscas ayuda! Permíteme asistirte con eso.';
      }
      
      // Show model indicator for advanced model
      if (selectedModel === 'advanced') {
        responseContent += '\n\n*Using advanced AI model for detailed analysis*';
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        status: 'sent'
      };
      const finalState = {
        ...newState,
        messages: [...newState.messages, aiResponse]
      };
      setChatState(finalState);
      setIsLoading(false);
    }, selectedModel === 'advanced' ? 2000 : 1000); // Longer delay for advanced model
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

  const handleClose = () => {
    setIsClosing(true);
    // Delay the actual close to allow animation to complete
    setTimeout(() => {
      setIsClosing(false);
      onToggle();
    }, 300); // 300ms animation duration
  };

  if (!isOpen && !isClosing) {
    return null;
  }

  return (
    <>
      <div 
        ref={chatRef}
        className={`fixed z-50 ${
          isDragging ? 'cursor-grabbing transition-none' : 'cursor-grab'
        } ${
          isSidebarMode 
            ? 'w-80 h-full top-0 right-0 bottom-0' 
            : // Mobile: Full screen layout, Desktop: Centered dialog
              isMobile
                ? 'top-0 bottom-0 h-full w-full'
                : 'top-1/2 left-1/2 w-96 h-[520px] -translate-x-1/2 -translate-y-1/2'
        } ${
          isClosing ? 'animate-fade-out' : (isOpening ? 'animate-fade-in' : '')
        }`}
        style={isSidebarMode ? {
          opacity: 1.0
        } : isMobile ? {
          // Mobile: Full width minus sidebar
          left: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth})`,
          right: '0',
          opacity: 1.0
        } : {
          // Desktop: Use Tailwind positioning
          opacity: 1.0
        }}
        onMouseDown={!isSidebarMode && isMobile ? handleMouseDown : undefined}
      >
      {/* Clean chat dialog with perfect rounded corners */}
      <div 
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: isSidebarMode ? '28px' : (isMobile ? '0px' : '28px'),
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
        }}>
        
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
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
                onClick={() => setShowSettings(!showSettings)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: showSettings ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={showSettings ? "Back to Chat" : "ChatOps Settings"}
              >
                {showSettings ? (
                  <X className="w-4 h-4 text-white" />
                ) : (
                  <Settings className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '12px 16px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {showSettings ? (
            // Settings Panel
            <div style={{ flex: 1, overflow: 'auto' }}>
              <ChatOpsSettings
                config={chatConfig}
                onConfigChange={setChatConfig}
                onClose={() => setShowSettings(false)}
              />
            </div>
          ) : (
            // Messages Area
            <ScrollArea ref={scrollAreaRef} className="flex-1">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '100%' }}>
                {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ maxWidth: '85%' }}>
                    {message.type === 'user' ? (
                      <div
                        style={{
                          padding: '12px 16px',
                          borderRadius: '20px 20px 8px 20px',
                          background: 'rgba(255,255,255,0.15)',
                          color: '#111827',
                          border: '1px solid rgba(255,255,255,0.2)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)'
                        }}
                      >
                        <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.4' }}>{message.content}</p>
                      </div>
                    ) : (
                      <div style={{ padding: '4px 0' }}>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '15px', 
                          lineHeight: '1.6',
                          color: 'rgba(255,255,255,0.9)'
                        }}>{message.content}</p>
                      </div>
                    )}
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
                <div style={{ display: 'flex', justifyContent: 'flex-start', maxWidth: '85%' }}>
                  <div style={{ padding: '4px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div className="w-2 h-2 rounded-full animate-bounce bg-white/70"></div>
                      <div className="w-2 h-2 rounded-full animate-bounce bg-white/70" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce bg-white/70" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Suggestion Chips - only show when not in settings */}
        {!showSettings && (
          <div style={{ flexShrink: 0 }}>
            <SuggestionChips 
              chatContext={chatContext}
              messages={messages}
              chatState={chatState}
              setChatState={setChatState}
            />
          </div>
        )}

        {/* Input - only show when not in settings */}
        {!showSettings && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <div 
                className="relative"
                style={{
                  borderRadius: '22px',
                  background: '#3b82f6',
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
        )}
      </div>
      </div>
    </>
  );
}

export default CustomerAiChat;