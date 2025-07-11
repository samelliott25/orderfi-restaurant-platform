import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  ChefHat,
  CreditCard,
  Package,
  BarChart3
} from 'lucide-react';

interface RestaurantContext {
  currentRole: 'owner' | 'manager' | 'staff' | 'kitchen' | 'customer';
  location: 'front_of_house' | 'kitchen' | 'bar' | 'admin' | 'customer_area';
  timeOfDay: 'morning' | 'lunch' | 'afternoon' | 'dinner' | 'late_night';
  operationalStatus: 'closed' | 'prep' | 'slow' | 'busy' | 'rush' | 'cleanup';
  staffLevel: 'understaffed' | 'normal' | 'overstaffed';
  urgentAlerts: string[];
  quickActions: string[];
  adaptiveLayout: 'compact' | 'standard' | 'spacious';
}

interface ContextAwareUIContextType {
  context: RestaurantContext;
  updateContext: (updates: Partial<RestaurantContext>) => void;
  getContextualActions: () => string[];
  getContextualLayout: () => 'compact' | 'standard' | 'spacious';
  getContextualPriority: () => 'urgent' | 'normal' | 'low';
}

const ContextAwareUIContext = createContext<ContextAwareUIContextType | null>(null);

export const useContextAwareUI = () => {
  const context = useContext(ContextAwareUIContext);
  if (!context) {
    throw new Error('useContextAwareUI must be used within a ContextAwareUIProvider');
  }
  return context;
};

interface ContextAwareUIProviderProps {
  children: ReactNode;
}

export const ContextAwareUIProvider: React.FC<ContextAwareUIProviderProps> = ({ children }) => {
  const [location] = useLocation();
  const [context, setContext] = useState<RestaurantContext>({
    currentRole: 'manager',
    location: 'admin',
    timeOfDay: 'afternoon',
    operationalStatus: 'normal',
    staffLevel: 'normal',
    urgentAlerts: [],
    quickActions: [],
    adaptiveLayout: 'standard'
  });

  // Auto-detect context based on current page and time
  useEffect(() => {
    const hour = new Date().getHours();
    let timeOfDay: RestaurantContext['timeOfDay'] = 'afternoon';
    let operationalStatus: RestaurantContext['operationalStatus'] = 'normal';
    
    if (hour >= 6 && hour < 11) {
      timeOfDay = 'morning';
      operationalStatus = 'prep';
    } else if (hour >= 11 && hour < 14) {
      timeOfDay = 'lunch';
      operationalStatus = 'busy';
    } else if (hour >= 14 && hour < 17) {
      timeOfDay = 'afternoon';
      operationalStatus = 'slow';
    } else if (hour >= 17 && hour < 22) {
      timeOfDay = 'dinner';
      operationalStatus = 'rush';
    } else {
      timeOfDay = 'late_night';
      operationalStatus = 'cleanup';
    }

    // Determine role and location based on current page
    let currentRole: RestaurantContext['currentRole'] = 'manager';
    let currentLocation: RestaurantContext['location'] = 'admin';
    
    if (location.includes('/kitchen')) {
      currentRole = 'kitchen';
      currentLocation = 'kitchen';
    } else if (location.includes('/mobileapp') || location.includes('/customer')) {
      currentRole = 'customer';
      currentLocation = 'customer_area';
    } else if (location.includes('/dashboard') || location.includes('/admin')) {
      currentRole = 'manager';
      currentLocation = 'admin';
    } else if (location.includes('/orders') || location.includes('/tables')) {
      currentRole = 'staff';
      currentLocation = 'front_of_house';
    }

    setContext(prev => ({
      ...prev,
      timeOfDay,
      operationalStatus,
      currentRole,
      location: currentLocation
    }));
  }, [location]);

  // Generate contextual alerts and actions
  useEffect(() => {
    const alerts: string[] = [];
    const actions: string[] = [];
    
    // Time-based alerts
    if (context.timeOfDay === 'lunch' || context.timeOfDay === 'dinner') {
      alerts.push('Peak hours - Monitor kitchen closely');
    }
    
    if (context.operationalStatus === 'rush') {
      alerts.push('Rush period active - All hands on deck');
      actions.push('View Live Kitchen');
      actions.push('Staff Notifications');
    }
    
    // Role-based actions
    switch (context.currentRole) {
      case 'manager':
        actions.push('View Analytics', 'Staff Schedule', 'Inventory Check');
        break;
      case 'kitchen':
        actions.push('Mark Order Ready', 'Request Supplies', 'Update Cook Times');
        break;
      case 'staff':
        actions.push('Take Order', 'Process Payment', 'Table Status');
        break;
      case 'customer':
        actions.push('View Menu', 'Track Order', 'Request Service');
        break;
    }
    
    // Location-based actions
    if (context.location === 'kitchen') {
      actions.push('Print Tickets', 'Temperature Check', 'Inventory Alert');
    }
    
    setContext(prev => ({
      ...prev,
      urgentAlerts: alerts,
      quickActions: actions
    }));
  }, [context.timeOfDay, context.operationalStatus, context.currentRole, context.location]);

  const updateContext = (updates: Partial<RestaurantContext>) => {
    setContext(prev => ({ ...prev, ...updates }));
  };

  const getContextualActions = (): string[] => {
    return context.quickActions;
  };

  const getContextualLayout = (): 'compact' | 'standard' | 'spacious' => {
    if (context.operationalStatus === 'rush') return 'compact';
    if (context.currentRole === 'kitchen') return 'compact';
    if (context.currentRole === 'customer') return 'spacious';
    return 'standard';
  };

  const getContextualPriority = (): 'urgent' | 'normal' | 'low' => {
    if (context.urgentAlerts.length > 0) return 'urgent';
    if (context.operationalStatus === 'rush' || context.operationalStatus === 'busy') return 'urgent';
    if (context.timeOfDay === 'lunch' || context.timeOfDay === 'dinner') return 'normal';
    return 'low';
  };

  const contextValue: ContextAwareUIContextType = {
    context,
    updateContext,
    getContextualActions,
    getContextualLayout,
    getContextualPriority
  };

  return (
    <ContextAwareUIContext.Provider value={contextValue}>
      {children}
    </ContextAwareUIContext.Provider>
  );
};

// Context-aware layout wrapper
interface AdaptiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({ children, className = '' }) => {
  const { context, getContextualLayout } = useContextAwareUI();
  const layout = getContextualLayout();
  
  const getLayoutClasses = () => {
    switch (layout) {
      case 'compact':
        return 'p-2 gap-2 text-sm';
      case 'spacious':
        return 'p-6 gap-6 text-base';
      default:
        return 'p-4 gap-4 text-sm';
    }
  };

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {children}
    </div>
  );
};

// Context status indicator
export const ContextStatusIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { context, getContextualPriority } = useContextAwareUI();
  const priority = getContextualPriority();
  
  const getRoleIcon = () => {
    switch (context.currentRole) {
      case 'kitchen': return <ChefHat className="h-4 w-4" />;
      case 'staff': return <Users className="h-4 w-4" />;
      case 'manager': return <BarChart3 className="h-4 w-4" />;
      case 'customer': return <Users className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (context.operationalStatus) {
      case 'rush': return 'bg-red-500';
      case 'busy': return 'bg-orange-500';
      case 'normal': return 'bg-green-500';
      case 'slow': return 'bg-yellow-500';
      case 'prep': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'urgent': return 'border-red-500 text-red-600';
      case 'normal': return 'border-yellow-500 text-yellow-600';
      default: return 'border-gray-500 text-gray-600';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        {getRoleIcon()}
        <Badge variant="outline" className="capitalize">
          {context.currentRole}
        </Badge>
      </div>
      
      <div className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
        <span className="text-sm font-medium capitalize">
          {context.operationalStatus}
        </span>
      </div>
      
      {context.urgentAlerts.length > 0 && (
        <Badge variant="destructive" className="animate-pulse">
          {context.urgentAlerts.length} Alert{context.urgentAlerts.length > 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  );
};

// Context-aware alert panel
export const ContextAwareAlerts: React.FC = () => {
  const { context } = useContextAwareUI();
  
  if (context.urgentAlerts.length === 0) return null;
  
  return (
    <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
          <AlertTriangle className="h-5 w-5" />
          Urgent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {context.urgentAlerts.map((alert, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-orange-700 dark:text-orange-300">{alert}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Context-aware quick actions
export const ContextAwareQuickActions: React.FC<{ 
  onActionClick: (action: string) => void;
  maxActions?: number;
}> = ({ onActionClick, maxActions = 6 }) => {
  const { context } = useContextAwareUI();
  
  const getActionIcon = (action: string) => {
    if (action.includes('Kitchen')) return <ChefHat className="h-4 w-4" />;
    if (action.includes('Payment')) return <CreditCard className="h-4 w-4" />;
    if (action.includes('Inventory')) return <Package className="h-4 w-4" />;
    if (action.includes('Analytics')) return <BarChart3 className="h-4 w-4" />;
    if (action.includes('Order')) return <Clock className="h-4 w-4" />;
    if (action.includes('Staff')) return <Users className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {context.quickActions.slice(0, maxActions).map((action, index) => (
        <button
          key={index}
          onClick={() => onActionClick(action)}
          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
        >
          {getActionIcon(action)}
          <span className="text-sm font-medium">{action}</span>
        </button>
      ))}
    </div>
  );
};

export default ContextAwareUIProvider;