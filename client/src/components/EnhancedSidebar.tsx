import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { VoiceFirstInterface } from './VoiceFirstInterface';
import { RealTimeStatusIndicator } from './RealTimeSync';
import { ContextStatusIndicator } from './ContextAwareUI';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  CreditCard, 
  Users, 
  FileText, 
  Settings,
  ChefHat,
  Table,
  Smartphone,
  Coins,
  Mic,
  Activity,
  Brain,
  Zap,
  Timer,
  TrendingUp,
  Bell,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  voiceCommand?: string;
}

interface VoiceCommand {
  command: string;
  confidence: number;
  action: string;
  timestamp: Date;
}

export const EnhancedSidebar: React.FC = () => {
  const [location] = useLocation();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [metrics, setMetrics] = useState({
    pendingOrders: 23,
    lowStock: 8,
    notifications: 5
  });

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(prev => ({
        pendingOrders: Math.max(0, prev.pendingOrders + Math.floor(Math.random() * 6) - 3),
        lowStock: Math.max(0, prev.lowStock + Math.floor(Math.random() * 4) - 2),
        notifications: Math.max(0, prev.notifications + Math.floor(Math.random() * 3) - 1)
      }));
    };

    const interval = setInterval(updateMetrics, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleVoiceCommand = (command: VoiceCommand) => {
    console.log('Voice command received:', command);
    setLastVoiceCommand(command.command);
    
    const lowerCommand = command.command.toLowerCase();
    
    // Navigate based on voice commands
    if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
      window.location.href = '/dashboard';
    } else if (lowerCommand.includes('order') && !lowerCommand.includes('mobile')) {
      window.location.href = '/orders';
    } else if (lowerCommand.includes('kitchen')) {
      window.location.href = '/kitchen';
    } else if (lowerCommand.includes('inventory') || lowerCommand.includes('stock')) {
      window.location.href = '/inventory';
    } else if (lowerCommand.includes('payment')) {
      window.location.href = '/payments';
    } else if (lowerCommand.includes('staff')) {
      window.location.href = '/staff';
    } else if (lowerCommand.includes('table')) {
      window.location.href = '/tables';
    } else if (lowerCommand.includes('mobile') || lowerCommand.includes('app')) {
      window.location.href = '/mobileapp';
    } else if (lowerCommand.includes('setting')) {
      window.location.href = '/settings';
    }
  };

  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" />,
      voiceCommand: 'dashboard'
    },
    { 
      name: 'Orders', 
      path: '/orders', 
      icon: <ClipboardList className="h-5 w-5" />,
      badge: metrics.pendingOrders > 0 ? metrics.pendingOrders.toString() : undefined,
      voiceCommand: 'orders'
    },
    { 
      name: 'Kitchen', 
      path: '/kitchen', 
      icon: <ChefHat className="h-5 w-5" />,
      voiceCommand: 'kitchen'
    },
    { 
      name: 'Tables', 
      path: '/tables', 
      icon: <Table className="h-5 w-5" />,
      voiceCommand: 'tables'
    },
    { 
      name: 'Inventory', 
      path: '/inventory', 
      icon: <Package className="h-5 w-5" />,
      badge: metrics.lowStock > 0 ? metrics.lowStock.toString() : undefined,
      voiceCommand: 'inventory'
    },
    { 
      name: 'Payments', 
      path: '/payments', 
      icon: <CreditCard className="h-5 w-5" />,
      voiceCommand: 'payments'
    },
    { 
      name: 'Staff', 
      path: '/staff', 
      icon: <Users className="h-5 w-5" />,
      voiceCommand: 'staff'
    },
    { 
      name: 'Reporting', 
      path: '/reporting', 
      icon: <FileText className="h-5 w-5" />,
      voiceCommand: 'reporting'
    },
    { 
      name: 'Mobile App', 
      path: '/mobileapp', 
      icon: <Smartphone className="h-5 w-5" />,
      voiceCommand: 'mobile app'
    },
    { 
      name: 'Token Rewards', 
      path: '/tokenrewards', 
      icon: <Coins className="h-5 w-5" />,
      voiceCommand: 'rewards'
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" />,
      voiceCommand: 'settings'
    }
  ];

  const getOperationalStatus = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return { status: 'Morning Prep', color: 'bg-blue-500' };
    if (hour >= 11 && hour < 14) return { status: 'Lunch Rush', color: 'bg-orange-500' };
    if (hour >= 14 && hour < 17) return { status: 'Afternoon', color: 'bg-green-500' };
    if (hour >= 17 && hour < 22) return { status: 'Dinner Rush', color: 'bg-red-500' };
    return { status: 'Evening', color: 'bg-purple-500' };
  };

  const operationalStatus = getOperationalStatus();

  return (
    <div className="flex flex-col h-full">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <Brain className="h-6 w-6 text-orange-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-lg font-bold playwrite-font bg-gradient-to-r from-[#F5A623] via-orange-500 to-pink-500 bg-clip-text text-transparent">
            OrderFi
          </h1>
        </div>
        
        {/* Status Indicators */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${operationalStatus.color}`}></div>
            <span className="text-xs font-medium">{operationalStatus.status}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{currentTime.toLocaleTimeString()}</span>
            <RealTimeStatusIndicator />
          </div>
        </div>
      </div>

      {/* Voice Interface Toggle */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsVoiceActive(!isVoiceActive)}
          className={`w-full ${isVoiceActive ? 'bg-orange-100 border-orange-300' : ''}`}
        >
          <Mic className="h-4 w-4 mr-2" />
          {isVoiceActive ? 'Voice Active' : 'Voice Commands'}
        </Button>
        
        {lastVoiceCommand && (
          <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs">
            <span className="text-green-700 dark:text-green-300">
              Last: "{lastVoiceCommand}"
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              location === item.path
                ? 'bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        ))}
      </nav>

      {/* Voice Interface */}
      {isVoiceActive && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <VoiceFirstInterface 
            onVoiceCommand={handleVoiceCommand}
            context="ordering"
          />
        </div>
      )}

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
            <div className="font-bold text-orange-600">{metrics.pendingOrders}</div>
            <div className="text-muted-foreground">Pending</div>
          </div>
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <div className="font-bold text-blue-600">{metrics.lowStock}</div>
            <div className="text-muted-foreground">Low Stock</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSidebar;