import React, { useState } from 'react';
import { KleurvormCard } from '@/components/kleurvorm/KleurvormCard';
import { KleurvormButton } from '@/components/kleurvorm/KleurvormButton';
import { KleurvormProgressCircle } from '@/components/kleurvorm/KleurvormProgressCircle';
import { KleurvormStats } from '@/components/kleurvorm/KleurvormStats';
import { KleurvormBottomNav } from '@/components/kleurvorm/KleurvormBottomNav';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, ShoppingCart, TrendingUp, Clock, ChefHat } from 'lucide-react';

export default function KleurvormDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const revenueData = [
    { time: '9:00', amount: 120 },
    { time: '10:00', amount: 240 },
    { time: '11:00', amount: 380 },
    { time: '12:00', amount: 550 },
    { time: '13:00', amount: 720 },
    { time: '14:00', amount: 480 },
    { time: '15:00', amount: 320 },
    { time: '16:00', amount: 280 },
    { time: '17:00', amount: 450 },
    { time: '18:00', amount: 680 },
  ];

  const categoryData = [
    { name: 'Starters', value: 30, color: 'var(--kleurvorm-blue)' },
    { name: 'Mains', value: 45, color: 'var(--kleurvorm-purple)' },
    { name: 'Desserts', value: 15, color: 'var(--kleurvorm-pink)' },
    { name: 'Beverages', value: 10, color: 'var(--kleurvorm-orange)' },
  ];

  const kpiStats = [
    { label: 'Revenue', value: '$4,280', color: 'var(--kleurvorm-blue)' },
    { label: 'Orders', value: '156', color: 'var(--kleurvorm-purple)' },
    { label: 'Avg Order', value: '$27.40', color: 'var(--kleurvorm-pink)' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-kleurvorm-light-blue to-kleurvorm-white pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold kleurvorm-heading mb-2">Dashboard</h1>
          <p className="kleurvorm-small">Real-time restaurant analytics</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-white rounded-full p-2 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-kleurvorm-blue to-kleurvorm-purple text-white'
                      : 'text-kleurvorm-black hover:bg-kleurvorm-light-blue'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KleurvormCard>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="kleurvorm-subheading">Today's Revenue</h3>
                    <p className="text-2xl font-bold kleurvorm-heading" style={{ color: 'var(--kleurvorm-blue)' }}>
                      $4,280
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-kleurvorm-blue to-kleurvorm-purple rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="kleurvorm-small text-green-500">+12% from yesterday</span>
                </div>
              </KleurvormCard>

              <KleurvormCard>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="kleurvorm-subheading">Orders</h3>
                    <p className="text-2xl font-bold kleurvorm-heading" style={{ color: 'var(--kleurvorm-purple)' }}>
                      156
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-kleurvorm-purple to-kleurvorm-pink rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="kleurvorm-small text-green-500">+8% from yesterday</span>
                </div>
              </KleurvormCard>

              <KleurvormCard>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="kleurvorm-subheading">Avg Order</h3>
                    <p className="text-2xl font-bold kleurvorm-heading" style={{ color: 'var(--kleurvorm-pink)' }}>
                      $27.40
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-kleurvorm-pink to-kleurvorm-orange rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="kleurvorm-small text-green-500">+5% from yesterday</span>
                </div>
              </KleurvormCard>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <KleurvormCard>
                <h3 className="kleurvorm-subheading text-lg mb-4">Revenue Today</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Bar dataKey="amount" fill="var(--kleurvorm-blue)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </KleurvormCard>

              <KleurvormCard>
                <h3 className="kleurvorm-subheading text-lg mb-4">Order Categories</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </KleurvormCard>
            </div>

            {/* Performance Circle */}
            <KleurvormCard className="text-center">
              <h3 className="kleurvorm-subheading text-lg mb-6">Kitchen Performance</h3>
              <div className="flex justify-center mb-6">
                <KleurvormProgressCircle value={92} label="efficiency" size="lg" />
              </div>
              <KleurvormStats stats={kpiStats} />
            </KleurvormCard>
          </div>
        )}

        {/* Other tabs content would go here */}
        {activeTab !== 'overview' && (
          <KleurvormCard>
            <div className="text-center py-12">
              <h3 className="kleurvorm-subheading text-lg mb-4">
                {tabs.find(tab => tab.id === activeTab)?.label} Content
              </h3>
              <p className="kleurvorm-body">This section is coming soon...</p>
            </div>
          </KleurvormCard>
        )}
      </div>
      
      <KleurvormBottomNav />
    </div>
  );
}