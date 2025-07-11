import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Clock, 
  Star,
  ChefHat,
  Zap,
  Activity
} from 'lucide-react';

interface FreshDashboardProps {
  designStyle: 'neubrutalist' | 'glassmorphism' | 'bento';
}

export function FreshDashboard({ designStyle }: FreshDashboardProps) {
  const [activeMetric, setActiveMetric] = useState('revenue');

  const metrics = [
    { id: 'revenue', label: 'Revenue', value: '$12,456', change: '+23%', icon: DollarSign, color: 'from-emerald-500 to-green-600' },
    { id: 'orders', label: 'Orders', value: '1,234', change: '+12%', icon: ShoppingCart, color: 'from-blue-500 to-cyan-600' },
    { id: 'customers', label: 'Customers', value: '856', change: '+8%', icon: Users, color: 'from-purple-500 to-indigo-600' },
    { id: 'rating', label: 'Rating', value: '4.8', change: '+0.2', icon: Star, color: 'from-yellow-500 to-orange-600' },
  ];

  const getContainerClasses = () => {
    switch (designStyle) {
      case 'neubrutalist':
        return 'p-6 bg-white min-h-screen';
      case 'glassmorphism':
        return 'p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen';
      case 'bento':
        return 'p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen';
      default:
        return 'p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen';
    }
  };

  const getCardClasses = (isActive = false) => {
    switch (designStyle) {
      case 'neubrutalist':
        return `neubrutalist-card ${isActive ? 'bg-yellow-300' : 'bg-white'}`;
      case 'glassmorphism':
        return 'glassmorphism-card';
      case 'bento':
        return `bento-item ${isActive ? 'ring-2 ring-orange-500' : ''}`;
      default:
        return `bento-item ${isActive ? 'ring-2 ring-orange-500' : ''}`;
    }
  };

  const getHeaderClasses = () => {
    switch (designStyle) {
      case 'neubrutalist':
        return 'display-large text-black mb-8';
      case 'glassmorphism':
        return 'display-large text-white mb-8';
      case 'bento':
        return 'display-large text-gray-900 mb-8';
      default:
        return 'display-large text-gray-900 mb-8';
    }
  };

  return (
    <div className={getContainerClasses()}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={getHeaderClasses()}>
          OrderFi Dashboard
          <span className="ml-4 text-base font-normal">
            {designStyle === 'neubrutalist' && '🚀 BRUTAL MODE'}
            {designStyle === 'glassmorphism' && '✨ Glass Mode'}
            {designStyle === 'bento' && '🍱 Bento Mode'}
          </span>
        </h1>
        <p className={`text-lg ${designStyle === 'glassmorphism' ? 'text-white/80' : 'text-gray-600'}`}>
          Fresh 2026 design system in action
        </p>
      </div>

      {/* Design Style Switcher */}
      <div className="flex gap-4 mb-8">
        <Button className="neubrutalist-button">Neubrutalist</Button>
        <Button className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 rounded-lg">
          Glassmorphism
        </Button>
        <Button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 rounded-xl">
          Bento Grid
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="bento-grid mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isActive = activeMetric === metric.id;
          
          return (
            <Card 
              key={metric.id} 
              className={`${getCardClasses(isActive)} cursor-pointer transition-all duration-300`}
              onClick={() => setActiveMetric(metric.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${designStyle === 'glassmorphism' ? 'text-white/80' : 'text-gray-600'}`}>
                    {metric.label}
                  </span>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`text-2xl font-bold ${designStyle === 'glassmorphism' ? 'text-white' : 'text-gray-900'}`}>
                    {metric.value}
                  </div>
                  <Badge variant="secondary" className="micro-pulse">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metric.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Orders */}
        <Card className={getCardClasses()}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${designStyle === 'glassmorphism' ? 'text-white' : 'text-gray-900'}`}>
              <Activity className="h-5 w-5" />
              Live Orders
              <Badge className="micro-glow">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${
                  designStyle === 'glassmorphism' 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <ChefHat className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${designStyle === 'glassmorphism' ? 'text-white' : 'text-gray-900'}`}>
                      Order #{1200 + i}
                    </div>
                    <div className={`text-sm ${designStyle === 'glassmorphism' ? 'text-white/60' : 'text-gray-500'}`}>
                      Buffalo Wings × 2
                    </div>
                  </div>
                  <Badge variant="outline" className="micro-bounce">
                    <Clock className="h-3 w-3 mr-1" />
                    {i * 2} min
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className={getCardClasses()}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${designStyle === 'glassmorphism' ? 'text-white' : 'text-gray-900'}`}>
              <Zap className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`text-3xl font-bold ${designStyle === 'glassmorphism' ? 'text-white' : 'text-gray-900'}`}>
                94%
              </div>
              <div className={`text-sm ${designStyle === 'glassmorphism' ? 'text-white/60' : 'text-gray-500'}`}>
                Kitchen efficiency this week
              </div>
              
              {/* Animated Progress Bar */}
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full gradient-animated"
                  style={{ width: '94%' }}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[
                  { label: 'Speed', value: '2.3 min', icon: '⚡' },
                  { label: 'Quality', value: '4.8/5', icon: '⭐' },
                  { label: 'Uptime', value: '99.9%', icon: '🚀' }
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className={`text-sm font-medium ${designStyle === 'glassmorphism' ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value}
                    </div>
                    <div className={`text-xs ${designStyle === 'glassmorphism' ? 'text-white/60' : 'text-gray-500'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}