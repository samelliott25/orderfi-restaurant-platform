import React from 'react';
import SimpleMobileLayout from '@/components/SimpleMobileLayout';

export default function DashboardMobileSimple() {
  return (
    <SimpleMobileLayout title="Restaurant Dashboard">
      <div className="p-4 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">Revenue</h3>
            <p className="text-2xl font-bold text-green-600">$2,450</p>
            <p className="text-xs text-green-500">+12% today</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">Orders</h3>
            <p className="text-2xl font-bold text-blue-600">147</p>
            <p className="text-xs text-blue-500">+8 pending</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">Customers</h3>
            <p className="text-2xl font-bold text-purple-600">89</p>
            <p className="text-xs text-purple-500">Active now</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">Avg Order</h3>
            <p className="text-2xl font-bold text-orange-600">$28.50</p>
            <p className="text-xs text-orange-500">+$2.10 vs yesterday</p>
          </div>
        </div>
        
        {/* Mobile Features Demo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="font-semibold text-lg mb-4 playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Mobile Navigation Features
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">ChatOps AI Center Button</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Touch-Friendly Navigation</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Mobile-First Design</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Glassmorphism Effects</span>
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How to Use</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Tap the AI button at the bottom for ChatOps</li>
            <li>• Use left/right scrolling for more navigation</li>
            <li>• All interfaces optimized for mobile touch</li>
            <li>• 44px+ touch targets for easy operation</li>
          </ul>
        </div>
      </div>
    </SimpleMobileLayout>
  );
}