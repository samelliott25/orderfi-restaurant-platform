import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { VoiceFirstInterface } from './VoiceFirstInterface';
import { RealTimeStatusIndicator, RealTimeEventsMonitor, useRealTime } from './RealTimeSync';
import { ContextStatusIndicator, ContextAwareAlerts, ContextAwareQuickActions, AdaptiveLayout, useContextAwareUI } from './ContextAwareUI';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign, 
  ChefHat, 
  Package, 
  CreditCard, 
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Timer,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Mic,
  Brain,
  Layers,
  Sparkles
} from 'lucide-react';

interface DashboardMetrics {
  revenue: {
    today: number;
    yesterday: number;
    trend: number;
    target: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    avgTime: number;
  };
  customers: {
    active: number;
    satisfaction: number;
    returning: number;
  };
  operations: {
    kitchenEfficiency: number;
    staffUtilization: number;
    inventoryHealth: number;
    systemPerformance: number;
  };
}

interface VoiceCommand {
  command: string;
  confidence: number;
  action: string;
  timestamp: Date;
}

export const SuperiorDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    revenue: { today: 14530, yesterday: 13200, trend: 10.1, target: 15000 },
    orders: { total: 567, pending: 23, completed: 544, avgTime: 12.3 },
    customers: { active: 89, satisfaction: 4.7, returning: 67 },
    operations: { kitchenEfficiency: 94, staffUtilization: 87, inventoryHealth: 91, systemPerformance: 98 }
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState<string | null>(null);
  
  const { context, getContextualPriority } = useContextAwareUI();
  const priority = getContextualPriority();

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(prev => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          today: prev.revenue.today + Math.random() * 100 - 50
        },
        orders: {
          ...prev.orders,
          total: prev.orders.total + Math.floor(Math.random() * 3),
          pending: Math.max(0, prev.orders.pending + Math.floor(Math.random() * 6) - 3)
        },
        customers: {
          ...prev.customers,
          active: Math.max(0, prev.customers.active + Math.floor(Math.random() * 10) - 5)
        }
      }));
    };

    const interval = setInterval(updateMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleVoiceCommand = (command: VoiceCommand) => {
    console.log('Voice command received:', command);
    setLastVoiceCommand(command.command);
    
    // Process voice commands
    const lowerCommand = command.command.toLowerCase();
    
    if (lowerCommand.includes('show') && lowerCommand.includes('order')) {
      setActiveTab('orders');
    } else if (lowerCommand.includes('show') && lowerCommand.includes('kitchen')) {
      setActiveTab('kitchen');
    } else if (lowerCommand.includes('show') && lowerCommand.includes('analytic')) {
      setActiveTab('analytics');
    } else if (lowerCommand.includes('show') && lowerCommand.includes('overview')) {
      setActiveTab('overview');
    }
  };

  const handleQuickAction = (action: string) => {
    console.log('Quick action:', action);
    // Route to appropriate page or trigger action
    if (action.includes('Kitchen')) {
      setActiveTab('kitchen');
    } else if (action.includes('Analytics')) {
      setActiveTab('analytics');
    } else if (action.includes('Order')) {
      setActiveTab('orders');
    }
  };

  const getMetricTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  const getMetricTrendColor = (trend: number) => {
    return trend > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <AdaptiveLayout className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20">
      {/* Header with Real-Time Status */}
      <div className="flex items-center justify-between mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-orange-200 dark:border-orange-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                OrderFi AI
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <ContextStatusIndicator />
          <RealTimeStatusIndicator />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={isVoiceActive ? 'bg-orange-100 border-orange-300' : ''}
          >
            <Mic className="h-4 w-4 mr-2" />
            Voice
          </Button>
        </div>
      </div>

      {/* Context-Aware Alerts */}
      <div className="mb-6">
        <ContextAwareAlerts />
      </div>

      {/* Voice Interface */}
      {isVoiceActive && (
        <div className="mb-6">
          <VoiceFirstInterface 
            onVoiceCommand={handleVoiceCommand}
            context="ordering"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-6">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-orange-500" />
              Quick Actions
              {lastVoiceCommand && (
                <Badge variant="outline" className="ml-2 text-xs">
                  Last: "{lastVoiceCommand}"
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContextAwareQuickActions 
              onActionClick={handleQuickAction}
              maxActions={6}
            />
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">${metrics.revenue.today.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm">
                  {getMetricTrendIcon(metrics.revenue.trend)}
                  <span className={getMetricTrendColor(metrics.revenue.trend)}>
                    {metrics.revenue.trend > 0 ? '+' : ''}{metrics.revenue.trend.toFixed(1)}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <Progress 
              value={(metrics.revenue.today / metrics.revenue.target) * 100} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Target: ${metrics.revenue.target.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{metrics.orders.total}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs">
                    {metrics.orders.pending} pending
                  </Badge>
                </div>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
              <Timer className="h-3 w-3" />
              Avg: {metrics.orders.avgTime}min
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{metrics.customers.active}</p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-yellow-600">★ {metrics.customers.satisfaction}</span>
                  <span className="text-muted-foreground">satisfaction</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.customers.returning}% returning customers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{metrics.operations.systemPerformance}%</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  All systems operational
                </div>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
            <Progress 
              value={metrics.operations.systemPerformance} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="kitchen" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Kitchen
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Kitchen Efficiency</span>
                    <span className="text-sm font-bold">{metrics.operations.kitchenEfficiency}%</span>
                  </div>
                  <Progress value={metrics.operations.kitchenEfficiency} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Staff Utilization</span>
                    <span className="text-sm font-bold">{metrics.operations.staffUtilization}%</span>
                  </div>
                  <Progress value={metrics.operations.staffUtilization} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Inventory Health</span>
                    <span className="text-sm font-bold">{metrics.operations.inventoryHealth}%</span>
                  </div>
                  <Progress value={metrics.operations.inventoryHealth} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  Real-Time Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RealTimeEventsMonitor maxEvents={5} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Live Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      #1
                    </div>
                    <div>
                      <p className="font-medium">Table 5 - 2 Burgers, 1 Fries</p>
                      <p className="text-sm text-muted-foreground">Ordered 12 minutes ago</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Cooking
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      #2
                    </div>
                    <div>
                      <p className="font-medium">Table 2 - 1 Salad, 2 Drinks</p>
                      <p className="text-sm text-muted-foreground">Ordered 8 minutes ago</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Ready
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-4">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-500" />
                Kitchen Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">94%</p>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">12.3</p>
                  <p className="text-sm text-muted-foreground">Avg Cook Time</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">23</p>
                  <p className="text-sm text-muted-foreground">Orders Queue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                Business Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-lg">
                    <h3 className="font-medium mb-2">Revenue Trend</h3>
                    <p className="text-2xl font-bold text-green-600">+10.1%</p>
                    <p className="text-sm text-muted-foreground">vs. yesterday</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                    <h3 className="font-medium mb-2">Customer Satisfaction</h3>
                    <p className="text-2xl font-bold text-yellow-600">4.7/5</p>
                    <p className="text-sm text-muted-foreground">based on 89 reviews</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdaptiveLayout>
  );
};

export default SuperiorDashboard;