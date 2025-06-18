import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  TrendingUp, 
  Users, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completionRate: number;
  ordersPerHour: number;
}

interface LiveOrder {
  id: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total: number;
  items: number;
  timeElapsed: number;
  customerName?: string;
}

export function LiveSalesDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([]);
  const [todayStats, setTodayStats] = useState<OrderStats>({
    totalOrders: 47,
    completedOrders: 42,
    cancelledOrders: 3,
    pendingOrders: 2,
    totalRevenue: 1847.50,
    averageOrderValue: 39.31,
    completionRate: 89.4,
    ordersPerHour: 12.3
  });

  // Collapsible section states
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [metricsOpen, setMetricsOpen] = useState(true);
  const [ordersOpen, setOrdersOpen] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate live order updates
      setLiveOrders(prev => prev.map(order => ({
        ...order,
        timeElapsed: order.timeElapsed + 1
      })));
      
      // Simulate new orders occasionally
      if (Math.random() < 0.1) {
        const newOrder: LiveOrder = {
          id: Date.now(),
          status: 'pending',
          total: Math.floor(Math.random() * 80) + 20,
          items: Math.floor(Math.random() * 5) + 1,
          timeElapsed: 0,
          customerName: `Customer ${Math.floor(Math.random() * 1000)}`
        };
        setLiveOrders(prev => [newOrder, ...prev.slice(0, 9)]);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initialize with sample live orders
  useEffect(() => {
    setLiveOrders([
      { id: 1, status: 'preparing', total: 45.50, items: 3, timeElapsed: 12, customerName: 'John D.' },
      { id: 2, status: 'ready', total: 23.75, items: 2, timeElapsed: 8, customerName: 'Sarah M.' },
      { id: 3, status: 'pending', total: 67.20, items: 4, timeElapsed: 2, customerName: 'Mike R.' },
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeColor = (timeElapsed: number) => {
    if (timeElapsed < 10) return 'text-green-600';
    if (timeElapsed < 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-background p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-3">Good morning, Chef</h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
            Welcome to your restaurant dashboard. You have 45 orders waiting for attention today with one live alert in your calendar.
          </p>
        </div>
        <div className="flex items-center space-x-6">
          <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            View all
          </button>
          <div className="flex items-center space-x-2 bg-accent/10 px-3 py-2 rounded-full">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-accent">Live</span>
          </div>
        </div>
      </div>

      {/* Key Metrics - Collapsible */}
      <Collapsible open={overviewOpen} onOpenChange={setOverviewOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left p-4 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
          <h2 className="text-xl font-semibold text-foreground">Today's Overview</h2>
          {overviewOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 mt-4 w-full">
        {/* Orders Card */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-2xl font-semibold text-foreground">{todayStats.totalOrders}</span>
            <span className="text-sm text-muted-foreground">today</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <span>{todayStats.pendingOrders} pending</span>
            <span>•</span>
            <span>{todayStats.ordersPerHour.toFixed(1)}/hour avg</span>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-2xl font-semibold text-foreground">${todayStats.totalRevenue.toFixed(0)}</span>
            <span className="text-sm font-medium text-accent">+12.3%</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Avg: ${todayStats.averageOrderValue.toFixed(0)} • Target: $2000
          </div>
        </div>

        {/* Completion Status Card */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Completion Rate</h3>
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-2xl font-semibold text-foreground">{todayStats.completionRate}%</span>
            <span className="text-sm text-muted-foreground">success</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            <span>{todayStats.completedOrders} completed</span>
            <span>•</span>
            <span>{todayStats.pendingOrders} pending</span>
          </div>
        </div>

        {/* Active Sessions Card */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Active Sessions</h3>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mb-2">
            <span className="text-2xl font-semibold text-foreground">2</span>
            <span className="text-sm text-muted-foreground">active</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Avg duration: 24min
          </div>
        </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Order Queue and Details - Collapsible */}
      <Collapsible open={ordersOpen} onOpenChange={setOrdersOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-left p-4 bg-card rounded-lg border border-border hover:bg-muted/50 transition-colors">
          <h2 className="text-xl font-semibold text-foreground">Live Orders</h2>
          {ordersOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
              {/* Order List */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Order Queue</h3>
                  <select className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium border-0 outline-none">
                    <option>Today</option>
                    <option>This Week</option>
                  </select>
                </div>
          
          <div className="space-y-3">
            {liveOrders.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 bg-card rounded-xl border border-border">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="font-medium">No active orders</p>
                <p className="text-sm">Orders will appear here when customers place them</p>
              </div>
            ) : (
              liveOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      order.status === 'pending' ? 'bg-destructive/10 text-destructive' :
                      order.status === 'preparing' ? 'bg-primary/10 text-primary' :
                      order.status === 'ready' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                    }`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        {order.status === 'pending' ? 
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/> :
                          order.status === 'preparing' ? 
                          <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/> :
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                        }
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{order.customerName || `Order #${order.id}`}</div>
                      <div className="text-sm text-muted-foreground capitalize">{order.status.replace('_', ' ')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">
                      {Math.floor(order.timeElapsed / 60)}:{(order.timeElapsed % 60).toString().padStart(2, '0')} min
                    </div>
                    <div className="text-sm text-muted-foreground">${order.total.toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Details */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-6">Order Details</h3>
          
          {liveOrders.length > 0 ? (
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-foreground">{liveOrders[0].customerName}</h4>
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                  PREP-TIME-24M72
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">24 mins</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize text-foreground">{liveOrders[0].status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium text-foreground">${liveOrders[0].total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4">
                <div className="text-sm text-muted-foreground mb-2">Order Items:</div>
                <div className="text-sm font-medium text-foreground">{liveOrders[0].items} items</div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <p className="text-muted-foreground">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}