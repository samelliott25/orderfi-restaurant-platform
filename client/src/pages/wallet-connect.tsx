import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StandardLayout } from '@/components/StandardLayout';
import { WalletConnectDialog } from '@/components/WalletConnectDialog';
import { Wallet, ArrowRight, Shield, Star, Gift, Zap, CheckCircle, Users, TrendingUp, Lock } from 'lucide-react';

export default function WalletConnect() {
  const [showDialog, setShowDialog] = useState(false);

  const benefits = [
    {
      icon: Star,
      title: "Token Rewards",
      description: "Earn ORDERFI tokens with every order and unlock exclusive perks",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Blockchain-powered transactions with enterprise-grade security",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Exclusive Features",
      description: "Access Web3-only features and early access to new releases",
      color: "from-pink-500 to-orange-500"
    },
    {
      icon: Gift,
      title: "Loyalty Program",
      description: "Decentralized rewards system that grows with your engagement",
      color: "from-orange-500 to-yellow-500"
    },
    {
      icon: Users,
      title: "Community Access",
      description: "Join the OrderFi DAO and participate in governance decisions",
      color: "from-green-500 to-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Staking Rewards",
      description: "Stake your tokens to earn passive income and voting power",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const stats = [
    { label: "Active Wallets", value: "12,500+", icon: Users },
    { label: "Total Rewards", value: "2.5M ORDERFI", icon: Star },
    { label: "Transactions", value: "45,000+", icon: TrendingUp }
  ];

  return (
    <StandardLayout 
      title="Connect Your Wallet"
      subtitle="Unlock Web3 rewards and secure crypto payments"
    >
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="kleurvorm-card p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 playwrite-font">
              Welcome to Web3 Dining
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Experience the future of restaurant payments with blockchain technology. 
              Earn rewards, access exclusive features, and enjoy secure transactions.
            </p>
            
            <WalletConnectDialog>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Connect Your Wallet
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </WalletConnectDialog>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="kleurvorm-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="kleurvorm-card p-6 hover:scale-105 transition-all duration-300">
              <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-full flex items-center justify-center mb-4`}>
                <benefit.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Security Section */}
        <div className="kleurvorm-card p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bank-Level Security</h2>
              <p className="text-gray-600 mb-6">
                Your wallet connection is secured by enterprise-grade encryption and never stores your private keys. 
                OrderFi only requests transaction permissions when needed, ensuring your funds remain under your complete control.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Non-custodial wallet integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">No private key storage</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-700">Audited smart contracts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="kleurvorm-card p-8 text-center bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of users already earning rewards and enjoying secure Web3 payments.
          </p>
          <WalletConnectDialog>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Connect Your Wallet Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </WalletConnectDialog>
        </div>
      </div>
    </StandardLayout>
  );
}