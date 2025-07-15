import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Calendar,
  Star,
  Clock,
  Target,
  ArrowUp,
  ArrowDown,
  Coffee,
  Utensils,
  Pizza
} from 'lucide-react';

interface KleurvormDashboardProps {
  className?: string;
}

const KleurvormDashboard: React.FC<KleurvormDashboardProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data inspired by health/food app analytics
  const dailyStats = {
    revenue: 2840,
    orders: 127,
    customers: 89,
    avgOrder: 22.36
  };

  const progressData = [
    { label: 'Revenue Goal', current: 2840, target: 4000, color: 'var(--kleurvorm-primary)' },
    { label: 'Orders', current: 127, target: 150, color: 'var(--kleurvorm-secondary)' },
    { label: 'Customers', current: 89, target: 120, color: 'var(--kleurvorm-accent)' }
  ];

  const suggestions = [
    {
      title: "Today's Special",
      subtitle: "Caesar Salad",
      price: "$15.99",
      orders: 23,
      icon: <Utensils className="w-6 h-6" />
    },
    {
      title: "Popular Item",
      subtitle: "Margherita Pizza",
      price: "$18.99",
      orders: 31,
      icon: <Pizza className="w-6 h-6" />
    },
    {
      title: "Trending",
      subtitle: "Iced Coffee",
      price: "$4.99",
      orders: 45,
      icon: <Coffee className="w-6 h-6" />
    }
  ];

  const recentActivity = [
    { time: '2 min ago', action: 'New order #127', type: 'order' },
    { time: '5 min ago', action: 'Payment received', type: 'payment' },
    { time: '8 min ago', action: 'Caesar Salad added', type: 'menu' },
    { time: '12 min ago', action: 'Customer feedback', type: 'feedback' }
  ];

  const ProgressRing = ({ value, max, color, size = 120 }: { value: number; max: number; color: string; size?: number }) => {
    const percentage = (value / max) * 100;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="kleurvorm-progress-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="absolute inset-0 transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="kleurvorm-progress-content">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">of {max}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={`kleurvorm-background-gradient p-4 sm:p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Hello, Restaurant Manager</h1>
              <p className="text-white/80">Monday, {new Date().toLocaleDateString()}</p>
            </div>
            <button className="kleurvorm-pill-button">
              Take Action
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            {['overview', 'analytics', 'menu'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? 'kleurvorm-tab-active' : 'kleurvorm-tab-inactive'}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Progress & Stats */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Daily Progress Ring */}
            <div className="kleurvorm-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Daily Progress</h3>
                  <p className="text-gray-600">Track your daily goals</p>
                </div>
                <Badge className="kleurvorm-nutrition-badge">Live</Badge>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <ProgressRing 
                  value={dailyStats.revenue} 
                  max={4000} 
                  color="var(--kleurvorm-primary)"
                  size={160}
                />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">${dailyStats.revenue}</div>
                <div className="text-gray-500 mb-4">Revenue Today</div>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{dailyStats.orders}</div>
                    <div className="text-xs text-gray-500">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">{dailyStats.customers}</div>
                    <div className="text-xs text-gray-500">Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">${dailyStats.avgOrder}</div>
                    <div className="text-xs text-gray-500">Avg Order</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Activity Feed */}
            <div className="kleurvorm-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{item.action}</div>
                      <div className="text-xs text-gray-500">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Suggestions & Quick Actions */}
          <div className="space-y-6">
            
            {/* Today's Suggestions */}
            <div className="kleurvorm-card-suggestion">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">Today's Suggestions</h3>
              </div>
              
              <div className="space-y-4">
                {suggestions.map((item, index) => (
                  <div key={index} className="kleurvorm-food-card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.subtitle}</h4>
                        <p className="text-sm text-gray-600">{item.title}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{item.price}</div>
                        <div className="text-xs text-gray-500">{item.orders} orders</div>
                      </div>
                    </div>
                    <button className="kleurvorm-pill-button w-full">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="kleurvorm-stat-card">
                <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
                <div className="text-2xl font-bold text-gray-900">+23%</div>
                <div className="text-sm text-gray-600">vs Yesterday</div>
              </div>
              <div className="kleurvorm-stat-card">
                <Users className="w-8 h-8 text-blue-500 mb-2" />
                <div className="text-2xl font-bold text-gray-900">89</div>
                <div className="text-sm text-gray-600">Customers</div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="kleurvorm-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="kleurvorm-pill-button w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Orders
                </button>
                <button className="kleurvorm-pill-button w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Customer Feedback
                </button>
                <button className="kleurvorm-pill-button w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Revenue Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KleurvormDashboard;