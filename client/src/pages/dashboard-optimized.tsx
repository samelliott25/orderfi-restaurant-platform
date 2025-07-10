import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { useChatContext } from '@/contexts/ChatContext';
import StandardLayout from '@/components/StandardLayout';
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary';
import { SwipeableMetricCards } from '@/components/dashboard/SwipeableMetricCards';
import { TouchOptimizedTabs } from '@/components/dashboard/TouchOptimizedTabs';
import { PersonalizationEngine } from '@/components/dashboard/PersonalizationEngine';
import { InstantActions } from '@/components/dashboard/InstantActions';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  ShoppingCart, 
  TrendingUp, 
  ChefHat, 
  Users,
  Activity,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Bell,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Generate performance metrics with status indicators
const generateMetrics = () => ({
  revenue: {
    current: 18750,
    change: 8.2,
    trend: 'up' as const,
    status: 'good' as const
  },
  orders: {
    current: 234,
    change: 12.5,
    trend: 'up' as const,
    status: 'good' as const
  },
  customers: {
    current: 189,
    change: 5.8,
    trend: 'up' as const,
    status: 'good' as const
  },
  avgOrder: {
    current: 32.45,
    change: -2.1,
    trend: 'down' as const,
    status: 'warning' as const
  }
});

// Critical operational alerts
const generateOperationalAlerts = () => [
  {
    id: 'ALERT_001',
    type: 'critical',
    message: 'Kitchen prep time exceeding 15 minutes',
    action: 'Check kitchen capacity',
    timestamp: '2 min ago'
  },
  {
    id: 'ALERT_002', 
    type: 'warning',
    message: 'Low stock: Burger patties (8 remaining)',
    action: 'Reorder inventory',
    timestamp: '5 min ago'
  }
];

// Live order data with priorities
const generateLiveOrders = () => [
  {
    id: 'ORD-1012',
    customer: 'Sarah M.',
    items: 'Burger Deluxe, Fries',
    total: 28.50,
    status: 'preparing',
    priority: 'high',
    time: '3m',
    table: 'T-04'
  },
  {
    id: 'ORD-1013',
    customer: 'Mike J.',
    items: 'Caesar Salad',
    total: 16.00,
    status: 'ready',
    priority: 'normal',
    time: '8m',
    table: 'T-07'
  },
  {
    id: 'ORD-1014',
    customer: 'Emma K.',
    items: 'Pasta Marinara, Wine',
    total: 34.00,
    status: 'pending',
    priority: 'normal',
    time: '1m',
    table: 'T-12'
  }
];

// Command Center Component
const CommandCenter = ({ alerts, onAlertAction }: { 
  alerts: any[], 
  onAlertAction: (alertId: string, action: string) => void 
}) => (
  <Card className="bg-card border-border">
    <CardHeader>
      <CardTitle className="text-foreground playwrite-font font-normal flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        Command Center
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">All systems operational</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-3 rounded-lg border ${
                alert.type === 'critical' 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-yellow-500/10 border-yellow-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.type === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                  } animate-pulse`}></div>
                  <span className="text-sm font-medium text-foreground">
                    {alert.message}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAlertAction(alert.id, alert.action)}
                className="text-xs h-7"
              >
                {alert.action}
              </Button>
            </div>
          ))
        )}
      </div>
    </CardContent>
  </Card>
);

// Live Orders Display
const LiveOrdersDisplay = ({ orders }: { orders: any[] }) => (
  <Card className="bg-card border-border">
    <CardHeader>
      <CardTitle className="text-foreground playwrite-font font-normal flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        Live Orders
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
          {orders.length}
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3 max-h-80 overflow-auto">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 bg-secondary rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                order.status === 'ready' ? 'bg-green-500' :
                order.status === 'preparing' ? 'bg-orange-500' : 'bg-yellow-500'
              }`}></div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">{order.id}</span>
                  <Badge variant="outline" className="text-xs">
                    {order.table}
                  </Badge>
                  {order.priority === 'high' && (
                    <Badge variant="destructive" className="text-xs">
                      Priority
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {order.customer} • {order.items}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                ${order.total.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">{order.time}</div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function OptimizedDashboard() {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState('executive');
  const [metrics, setMetrics] = useState(generateMetrics());
  const [alerts, setAlerts] = useState(generateOperationalAlerts());
  const [liveOrders, setLiveOrders] = useState(generateLiveOrders());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userRole] = useState<'manager' | 'owner' | 'staff'>('manager'); // Simulate user role

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateMetrics());
      setLiveOrders(generateLiveOrders());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAlertAction = (alertId: string, action: string) => {
    // Simulate resolving alert
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    
    // Show success feedback
    console.log(`Action taken: ${action} for alert ${alertId}`);
  };

  // Transform metrics for SwipeableMetricCards
  const swipeableMetrics = [
    {
      id: 'revenue',
      title: 'Revenue Today',
      value: `$${metrics.revenue.current.toLocaleString()}`,
      change: metrics.revenue.change,
      trend: metrics.revenue.trend,
      icon: <DollarSign className="w-4 h-4" />,
      color: 'text-green-500',
      description: 'Total revenue earned today compared to yesterday'
    },
    {
      id: 'orders',
      title: 'Orders',
      value: metrics.orders.current.toString(),
      change: metrics.orders.change,
      trend: metrics.orders.trend,
      icon: <ShoppingCart className="w-4 h-4" />,
      color: 'text-blue-500',
      description: 'Number of orders processed today'
    },
    {
      id: 'customers',
      title: 'Customers',
      value: metrics.customers.current.toString(),
      change: metrics.customers.change,
      trend: metrics.customers.trend,
      icon: <Users className="w-4 h-4" />,
      color: 'text-purple-500',
      description: 'Unique customers served today'
    },
    {
      id: 'avgOrder',
      title: 'Avg Order',
      value: `$${metrics.avgOrder.current.toFixed(2)}`,
      change: metrics.avgOrder.change,
      trend: metrics.avgOrder.trend,
      icon: <Target className="w-4 h-4" />,
      color: 'text-orange-500',
      description: 'Average order value comparison'
    }
  ];

  const dashboardTabs = [
    {
      id: 'executive',
      label: 'Executive',
      icon: BarChart3,
      description: 'High-level KPIs and status'
    },
    {
      id: 'operations',
      label: 'Operations',
      icon: Activity,
      badge: alerts.length,
      description: 'Live alerts and operations'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      badge: liveOrders.filter(o => o.status === 'ready').length,
      description: 'Live order management'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Performance insights'
    }
  ];

  return (
    <StandardLayout 
      title="Restaurant Dashboard" 
      subtitle="Optimized for mobile-first operations"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <TouchOptimizedTabs
          tabs={dashboardTabs}
          activeTab={activeView}
          onTabChange={setActiveView}
        />
        


        {/* Executive Summary View */}
        {activeView === 'executive' && (
          <div className="space-y-6">
            <ExecutiveSummary 
              metrics={metrics}
              currentTime={currentTime}
            />
            
            {/* Mobile Optimized Metrics */}
            <div className="md:hidden">
              <SwipeableMetricCards metrics={swipeableMetrics} />
            </div>
          </div>
        )}

        {/* Operations Command Center */}
        {activeView === 'operations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommandCenter 
                alerts={alerts}
                onAlertAction={handleAlertAction}
              />
              <LiveOrdersDisplay orders={liveOrders} />
            </div>
            
            {/* AI Personalization and Instant Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PersonalizationEngine 
                userRole={userRole}
                currentTime={currentTime}
                metrics={metrics}
              />
              <InstantActions />
            </div>
          </div>
        )}

        {/* Live Orders View */}
        {activeView === 'orders' && (
          <div className="space-y-6">
            <LiveOrdersDisplay orders={liveOrders} />
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground playwrite-font font-normal">
                  Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Comprehensive analytics and forecasting features
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions Footer (Mobile) */}
        <div className="block md:hidden fixed bottom-20 left-4 right-4 z-40">
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="bg-background/80 backdrop-blur-sm border-border"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}