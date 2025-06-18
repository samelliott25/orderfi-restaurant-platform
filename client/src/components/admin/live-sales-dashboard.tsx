import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  TrendingUp, 
  Users, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity
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
    <div className="min-h-screen bg-[#f5f1e8] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Good morning, Chef</h1>
          <p className="text-gray-600">
            Mimi wishes you a good and productive day. 45 orders waiting for your attention today. You also have one live 
            alert in your calendar today.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Show all ...</button>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 mb-8 w-full">
        {/* Orders Card - Yellow Gradient */}
        <div className="bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-gray-700 font-medium mb-2">Orders:</h3>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-2xl font-bold text-gray-900">{todayStats.totalOrders} orders</span>
            <span className="text-sm text-gray-600">{todayStats.pendingOrders} pending</span>
          </div>
          <div className="text-xs text-gray-600 mb-4">
            Average: {todayStats.ordersPerHour.toFixed(1)}/hour • Minimum: 8 • Maximum: 24
          </div>
          {/* Simple bar chart visualization */}
          <div className="flex items-end space-x-1 h-16">
            {[30, 45, 60, 35, 50, 40, 55].map((height, i) => (
              <div key={i} className="bg-yellow-600 rounded-t opacity-70" style={{ height: `${height}%`, width: '8px' }}></div>
            ))}
          </div>
        </div>

        {/* Revenue Card - Pink Gradient */}
        <div className="bg-gradient-to-br from-pink-200 to-pink-400 rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-gray-700 font-medium mb-2">Revenue summary:</h3>
          <div className="flex items-baseline space-x-2 mb-1">
            <span className="text-2xl font-bold text-gray-900">${todayStats.totalRevenue.toFixed(0)}</span>
            <span className="text-sm text-gray-600">+12.3%</span>
          </div>
          <div className="text-xs text-gray-600 mb-4">
            Average: ${todayStats.averageOrderValue.toFixed(0)} • Target: $2000
          </div>
          {/* Trend line */}
          <div className="relative h-16">
            <svg className="w-full h-full" viewBox="0 0 200 60">
              <path d="M 10 40 Q 50 30 100 25 T 190 20" stroke="#db2777" strokeWidth="2" fill="none" className="opacity-70"/>
              <circle cx="190" cy="20" r="3" fill="#db2777"/>
            </svg>
          </div>
        </div>

        {/* Completion Rate Card - Green Gradient */}
        <div className="bg-gradient-to-br from-green-200 to-green-400 rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-gray-700 font-medium mb-2">By condition:</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">{todayStats.completedOrders} completed</span>
              <span className="text-sm text-gray-700">{todayStats.pendingOrders} pending</span>
            </div>
            <div className="text-xs text-gray-600">
              Success rate: {todayStats.completionRate}%
            </div>
          </div>
          {/* Progress visualization */}
          <div className="relative h-16 bg-green-300 rounded-lg overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-green-600 transition-all duration-1000"
              style={{ width: `${todayStats.completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Sessions Card - Blue Gradient */}
        <div className="bg-gradient-to-br from-blue-200 to-blue-400 rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-gray-700 font-medium mb-2">Sessions:</h3>
          <div className="space-y-1 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Active:</span>
              <span className="text-lg font-bold text-gray-900">{todayStats.pendingOrders}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">Avg duration: 24min</span>
            </div>
          </div>
          {/* Activity indicator */}
          <div className="flex justify-end">
            <div className="w-12 h-12 bg-blue-500 rounded-full opacity-60 flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Queue and Details */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        {/* Order List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Order queue</h2>
            <div className="flex items-center space-x-2">
              <select className="bg-black text-white px-3 py-1 rounded-full text-sm">
                <option>Today</option>
                <option>This Week</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            {liveOrders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No active orders</p>
            ) : (
              liveOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      order.status === 'pending' ? 'bg-red-100' :
                      order.status === 'preparing' ? 'bg-blue-100' :
                      order.status === 'ready' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <span className="text-xl">
                        {order.status === 'pending' ? '🍽️' :
                         order.status === 'preparing' ? '👨‍🍳' :
                         order.status === 'ready' ? '✅' : '📋'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{order.customerName || `Order #${order.id}`}</div>
                      <div className="text-sm text-gray-500 capitalize">{order.status.replace('_', ' ')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {Math.floor(order.timeElapsed / 60)}:{(order.timeElapsed % 60).toString().padStart(2, '0')} min
                    </div>
                    <div className="text-sm text-gray-500">${order.total.toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Details */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order details</h2>
          
          {liveOrders.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{liveOrders[0].customerName}</h3>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  PREP-TIME-24M72
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Min:</span>
                  <span className="font-medium">24 mins • 3 Months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{liveOrders[0].status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Checked:</span>
                  <span className="font-medium">⚡ Ready on 21 April 2021</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="text-sm text-gray-600 mb-2">Order items:</div>
                <div className="text-sm font-medium">High level of spice • Normal</div>
                <div className="text-xs text-gray-500 mt-1">hemoglobin levels</div>
                <div className="text-xs text-gray-500 mt-2">Prescription • 2 times a day</div>
                <div className="text-xs text-gray-500">Dosage • Day and Night before</div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <p className="text-gray-500">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}