import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  ShoppingCart, 
  ChefHat, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Phone,
  Megaphone
} from "lucide-react";

interface InstantActionsProps {
  className?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  urgency: 'critical' | 'high' | 'normal';
  action: () => void;
  description: string;
}

export function InstantActions({ className = "" }: InstantActionsProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const handleAction = (actionId: string, actionFn: () => void) => {
    setActiveAction(actionId);
    
    // Simulate action execution
    setTimeout(() => {
      actionFn();
      setCompletedActions(prev => new Set([...prev, actionId]));
      setActiveAction(null);
      
      // Clear completed status after 3 seconds
      setTimeout(() => {
        setCompletedActions(prev => {
          const newSet = new Set(prev);
          newSet.delete(actionId);
          return newSet;
        });
      }, 3000);
    }, 1000);
  };

  const quickActions: QuickAction[] = [
    {
      id: 'ADD_STAFF',
      label: 'Call In Staff',
      icon: Phone,
      color: 'text-blue-500',
      urgency: 'high',
      description: 'Contact on-call staff for rush coverage',
      action: () => console.log('Calling in additional staff')
    },
    {
      id: 'KITCHEN_ALERT',
      label: 'Kitchen Alert',
      icon: ChefHat,
      color: 'text-orange-500',
      urgency: 'critical',
      description: 'Send priority alert to kitchen team',
      action: () => console.log('Kitchen alert sent')
    },
    {
      id: 'STOP_ORDERS',
      label: 'Pause Orders',
      icon: AlertTriangle,
      color: 'text-red-500',
      urgency: 'critical',
      description: 'Temporarily pause new order intake',
      action: () => console.log('Orders paused')
    },
    {
      id: 'PROMO_ACTIVATE',
      label: 'Flash Sale',
      icon: DollarSign,
      color: 'text-green-500',
      urgency: 'normal',
      description: 'Activate 15% off appetizers promotion',
      action: () => console.log('Flash sale activated')
    },
    {
      id: 'ANNOUNCE',
      label: 'PA System',
      icon: Megaphone,
      color: 'text-purple-500',
      urgency: 'normal',
      description: 'Make restaurant-wide announcement',
      action: () => console.log('PA announcement ready')
    },
    {
      id: 'PRIORITY_QUEUE',
      label: 'VIP Queue',
      icon: Users,
      color: 'text-indigo-500',
      urgency: 'high',
      description: 'Activate VIP customer priority system',
      action: () => console.log('VIP queue activated')
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'border-red-500 bg-red-500/5 hover:bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/5 hover:bg-orange-500/10';
      case 'normal': return 'border-blue-500 bg-blue-500/5 hover:bg-blue-500/10';
      default: return 'border-border bg-card hover:bg-secondary';
    }
  };

  return (
    <Card className={`bg-card border-border ${className}`}>
      <CardHeader>
        <CardTitle className="text-foreground playwrite-font font-normal flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Instant Actions
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">
            Quick Response
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            const isActive = activeAction === action.id;
            const isCompleted = completedActions.has(action.id);
            
            return (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => handleAction(action.id, action.action)}
                disabled={isActive}
                className={`h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200 ${getUrgencyColor(action.urgency)} ${
                  isCompleted ? 'border-green-500 bg-green-500/10' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : isActive ? (
                    <Clock className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : (
                    <IconComponent className={`w-5 h-5 ${action.color}`} />
                  )}
                  <span className="font-medium text-sm">
                    {isCompleted ? 'Completed' : isActive ? 'Processing...' : action.label}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground text-center leading-tight">
                  {action.description}
                </p>
                
                {action.urgency === 'critical' && !isCompleted && !isActive && (
                  <Badge variant="destructive" className="text-xs">
                    Critical
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
        
        {/* Emergency Protocol */}
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              Emergency Protocol
            </span>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400 mb-2">
            For critical situations requiring immediate intervention
          </p>
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => handleAction('EMERGENCY', () => console.log('Emergency protocol activated'))}
          >
            Activate Emergency Response
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}