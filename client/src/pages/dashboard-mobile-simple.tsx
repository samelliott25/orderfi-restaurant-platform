import React from 'react';
import SimpleMobileLayout from '@/components/SimpleMobileLayout';
import { DollarSign, ShoppingCart, Users, TrendingUp, Star, Clock, Zap, Award } from 'lucide-react';

export default function DashboardMobileSimple() {
  return (
    <SimpleMobileLayout title="Restaurant Dashboard">
      <div className="p-4 space-y-6">
        {/* Quick Stats Grid with OrderFi Styling */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-xl p-4 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Revenue</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">$2,450</p>
                <p className="text-xs text-green-600 font-medium">+12% today</p>
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
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">147</p>
                <p className="text-xs text-orange-600 font-medium">+8 pending</p>
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
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">89</p>
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
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">$28.50</p>
                <p className="text-xs text-green-600 font-medium">+$2.10 vs yesterday</p>
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
      </div>
    </SimpleMobileLayout>
  );
}