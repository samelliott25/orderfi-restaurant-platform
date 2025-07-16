import React from 'react';
import { KleurvormCard } from '@/components/kleurvorm/KleurvormCard';
import { KleurvormButton } from '@/components/kleurvorm/KleurvormButton';
import { KleurvormProgressCircle } from '@/components/kleurvorm/KleurvormProgressCircle';
import { KleurvormStats } from '@/components/kleurvorm/KleurvormStats';
import { KleurvormBottomNav } from '@/components/kleurvorm/KleurvormBottomNav';
import { ChefHat, TrendingUp, Clock, Star } from 'lucide-react';

export default function KleurvormHome() {
  const todaysStats = [
    { label: 'Orders', value: '24', color: 'var(--kleurvorm-blue)' },
    { label: 'Revenue', value: '$580', color: 'var(--kleurvorm-purple)' },
    { label: 'Items', value: '67', color: 'var(--kleurvorm-pink)' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-kleurvorm-light-blue to-kleurvorm-white pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-kleurvorm-orange to-kleurvorm-red rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold kleurvorm-heading">OrderFi</h1>
              <p className="kleurvorm-small">Smart restaurant ordering</p>
            </div>
          </div>
        </div>

        {/* Main Welcome Card */}
        <KleurvormCard className="mb-8 text-center">
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-kleurvorm-light-blue via-kleurvorm-purple to-kleurvorm-pink rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <ChefHat className="w-12 h-12 text-kleurvorm-purple" />
              </div>
            </div>
            <h2 className="text-3xl font-bold kleurvorm-heading mb-4">
              Build <span style={{ color: 'var(--kleurvorm-purple)' }}>healthy</span> ordering
            </h2>
            <p className="kleurvorm-body text-lg mb-6">
              Streamline your restaurant operations with AI-powered ordering and real-time analytics
            </p>
            <KleurvormButton variant="primary" size="lg">
              Let's start
            </KleurvormButton>
          </div>
          <div className="text-center pt-4 border-t border-kleurvorm-light-blue">
            <p className="kleurvorm-small">Don't have an account?</p>
            <button className="kleurvorm-small font-semibold" style={{ color: 'var(--kleurvorm-purple)' }}>
              Register now
            </button>
          </div>
        </KleurvormCard>

        {/* Today's Performance */}
        <KleurvormCard className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="kleurvorm-subheading text-lg">Hello, Manager</h3>
              <p className="kleurvorm-small">Today, March 22</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-kleurvorm-blue to-kleurvorm-purple rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex justify-center mb-6">
            <KleurvormProgressCircle value={87} label="efficiency" size="lg" />
          </div>
          
          <KleurvormStats stats={todaysStats} className="mb-6" />
          
          <div className="text-center">
            <p className="kleurvorm-small mb-2">Activity</p>
            <div className="flex justify-center gap-2">
              <div className="w-6 h-6 bg-kleurvorm-blue rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="w-6 h-6 bg-kleurvorm-purple rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div className="w-6 h-6 bg-kleurvorm-pink rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </KleurvormCard>

        {/* Quick Actions */}
        <KleurvormCard variant="gradient" className="mb-8">
          <h3 className="kleurvorm-subheading text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <KleurvormButton variant="secondary" size="md">
              View Orders
            </KleurvormButton>
            <KleurvormButton variant="outline" size="md">
              Analytics
            </KleurvormButton>
          </div>
        </KleurvormCard>

        {/* Popular Menu Items */}
        <KleurvormCard className="mb-8">
          <h3 className="kleurvorm-subheading text-lg mb-4">Popular near you</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-kleurvorm-light-blue rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-kleurvorm-purple" />
              </div>
              <div className="flex-1">
                <h4 className="kleurvorm-body font-semibold">Signature Burger</h4>
                <p className="kleurvorm-small">$18</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-kleurvorm-light-blue rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-kleurvorm-purple" />
              </div>
              <div className="flex-1">
                <h4 className="kleurvorm-body font-semibold">Caesar Salad</h4>
                <p className="kleurvorm-small">$14</p>
              </div>
            </div>
          </div>
        </KleurvormCard>
      </div>
      
      <KleurvormBottomNav />
    </div>
  );
}