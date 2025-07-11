import { useState, useEffect } from "react";
import StandardLayout from '@/components/StandardLayout';
import { DollarSign, ShoppingCart, Users, TrendingUp, Star, Clock, Zap, Award, Activity, Bell, Target } from 'lucide-react';

// Restaurant metrics data
const restaurantMetrics = {
  revenue: { current: 18750, change: 8.2, label: 'Revenue', trend: 'up' },
  orders: { current: 234, change: 12.5, label: 'Orders', trend: 'up' },
  customers: { current: 189, change: 5.8, label: 'Customers', trend: 'up' },
  avgOrder: { current: 32.45, change: -2.1, label: 'Avg Order', trend: 'down' }
};

export default function OptimizedDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <StandardLayout 
      title="Restaurant Dashboard" 
      subtitle="Beautiful OrderFi analytics and insights"
    >
      <div className="p-4 space-y-6">
        {/* Quick Stats Grid with OrderFi Styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Revenue</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  ${restaurantMetrics.revenue.current.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 font-medium">+{restaurantMetrics.revenue.change}% today</p>
              </div>
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Orders</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {restaurantMetrics.orders.current}
                </p>
                <p className="text-xs text-orange-600 font-medium">+{restaurantMetrics.orders.change}% vs yesterday</p>
              </div>
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Customers</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {restaurantMetrics.customers.current}
                </p>
                <p className="text-xs text-green-600 font-medium">Active now</p>
              </div>
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Avg Order</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  ${restaurantMetrics.avgOrder.current.toFixed(2)}
                </p>
                <p className="text-xs text-red-600 font-medium">{restaurantMetrics.avgOrder.change}% vs yesterday</p>
              </div>
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Live Activity Feed with OrderFi Styling */}
        <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5"></div>
          <div className="relative">
            <h3 className="font-semibold text-lg mb-4 playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Live Activity
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">Order #247 completed</span>
                  <p className="text-xs text-muted-foreground">Table 12 • $45.50</p>
                </div>
                <span className="text-xs text-muted-foreground">2m ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">New order received</span>
                  <p className="text-xs text-muted-foreground">Table 8 • $32.25</p>
                </div>
                <span className="text-xs text-muted-foreground">5m ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">Peak hour started</span>
                  <p className="text-xs text-muted-foreground">Kitchen notifications enabled</p>
                </div>
                <span className="text-xs text-muted-foreground">8m ago</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Insights Panel */}
        <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
          <div className="relative">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <Award className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-lg playwrite-font bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI Insights
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Revenue up 12% today</p>
                <p className="text-xs text-green-600 dark:text-green-500">Buffalo Wings driving growth</p>
              </div>
              
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Staff efficiency at 94%</p>
                <p className="text-xs text-blue-600 dark:text-blue-500">Above average for Thursday</p>
              </div>
              
              <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Peak hour in 30 minutes</p>
                <p className="text-xs text-orange-600 dark:text-orange-500">Suggested prep: extra staff</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5"></div>
          <div className="relative">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-lg playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Quick Actions
              </h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-200 hover:scale-105">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium">View Orders</span>
                </div>
              </button>
              
              <button className="p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:from-orange-500/20 hover:to-red-500/20 transition-all duration-200 hover:scale-105">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium">Inventory</span>
                </div>
              </button>
              
              <button className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-200 hover:scale-105">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium">Staff</span>
                </div>
              </button>
              
              <button className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:from-green-500/20 hover:to-emerald-500/20 transition-all duration-200 hover:scale-105">
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium">Reports</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}