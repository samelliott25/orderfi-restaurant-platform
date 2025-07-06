import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Globe, 
  ChefHat, 
  Smartphone, 
  CreditCard, 
  Star,
  Users,
  TrendingUp,
  Bot,
  Coins,
  Network,
  Eye,
  Menu,
  X,
  ChevronRight,
  Play,
  Check,
  Sparkles,
  Wallet,
  MessageSquare,
  BarChart3
} from 'lucide-react';

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'platform', 'tokenomics', 'roadmap'];
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
                <svg className="w-5 h-5 text-white relative z-10" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold playwrite-font bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                OrderFi
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: 'hero', label: 'Home' },
                { id: 'features', label: 'Features' },
                { id: 'platform', label: 'Platform' },
                { id: 'tokenomics', label: 'Tokenomics' },
                { id: 'roadmap', label: 'Roadmap' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.id 
                      ? 'text-orange-400' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={() => setLocation('/dashboard')}
              >
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                onClick={() => setLocation('/dashboard')}
              >
                Launch App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800">
            <div className="px-4 py-6 space-y-4">
              {[
                { id: 'hero', label: 'Home' },
                { id: 'features', label: 'Features' },
                { id: 'platform', label: 'Platform' },
                { id: 'tokenomics', label: 'Tokenomics' },
                { id: 'roadmap', label: 'Roadmap' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-gray-300 hover:text-white py-2"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-700"
                  onClick={() => setLocation('/dashboard')}
                >
                  Sign In
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                  onClick={() => setLocation('/dashboard')}
                >
                  Launch App
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <Badge className="mb-8 bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 text-orange-300">
              <Sparkles className="w-3 h-3 mr-2" />
              Next-Gen Restaurant Technology
            </Badge>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                Revolutionize
              </span>
              <br />
              Restaurant Operations
              <br />
              <span className="text-gray-300 text-3xl md:text-4xl lg:text-5xl">
                with AI & Web3
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              OrderFi combines conversational AI, blockchain payments, and smart contracts to create the world's first fully decentralized restaurant ecosystem.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8 py-6 h-auto"
                onClick={() => setLocation('/dashboard')}
              >
                <Play className="w-5 h-5 mr-2" />
                Launch Platform
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 text-lg px-8 py-6 h-auto"
                onClick={() => scrollToSection('features')}
              >
                <Eye className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {[
                { value: '$2.5M+', label: 'Volume Processed' },
                { value: '150+', label: 'Restaurants' },
                { value: '50K+', label: 'Orders' },
                { value: '99.9%', label: 'Uptime' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Powered by Innovation
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of restaurant technology with our cutting-edge AI and blockchain infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot className="w-8 h-8" />,
                title: 'AI Chat Ordering',
                description: 'Natural language processing powered by GPT-4o for seamless customer interactions and order management.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: <Wallet className="w-8 h-8" />,
                title: 'Crypto Payments',
                description: 'Accept USDC, Bitcoin, and Ethereum with instant settlement and zero chargebacks.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Coins className="w-8 h-8" />,
                title: '$MIMI Rewards',
                description: 'Native loyalty token with staking, governance, and tier-based customer benefits.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: <Network className="w-8 h-8" />,
                title: 'Blockchain Storage',
                description: 'Immutable order history, menu versioning, and supply chain transparency on Base.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Real-time Analytics',
                description: 'Advanced business intelligence with AI-powered insights and predictive analytics.',
                color: 'from-indigo-500 to-blue-500'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Enterprise Security',
                description: 'Military-grade encryption, multi-sig wallets, and comprehensive audit trails.',
                color: 'from-red-500 to-orange-500'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section id="platform" className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Complete Restaurant OS
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From order taking to payment processing, manage every aspect of your restaurant with our unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Features list */}
            <div className="space-y-8">
              {[
                {
                  icon: <MessageSquare className="w-6 h-6" />,
                  title: 'Conversational AI',
                  description: 'Natural language ordering with context awareness and menu recommendations.'
                },
                {
                  icon: <ChefHat className="w-6 h-6" />,
                  title: 'Kitchen Management',
                  description: 'Real-time order tracking, prep times, and automated kitchen display systems.'
                },
                {
                  icon: <CreditCard className="w-6 h-6" />,
                  title: 'Multi-Payment Rails',
                  description: 'Traditional cards, crypto payments, and loyalty tokens in one system.'
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: 'Staff Dashboard',
                  description: 'Comprehensive admin panel with role-based access and performance metrics.'
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side - Dashboard preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
                <div className="bg-black rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold text-white">OrderFi Dashboard</h4>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-400">$14.5K</div>
                      <div className="text-sm text-gray-400">Today's Revenue</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400">147</div>
                      <div className="text-sm text-gray-400">Orders</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { order: '#1247', status: 'Preparing', time: '3 min' },
                      { order: '#1248', status: 'Ready', time: '0 min' },
                      { order: '#1249', status: 'Pending', time: '5 min' }
                    ].map((order, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                        <span className="text-white font-medium">{order.order}</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {order.status}
                        </Badge>
                        <span className="text-gray-400 text-sm">{order.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                $MIMI Tokenomics
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Sustainable token economics designed for long-term growth and community rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Token Distribution */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white mb-6">Token Distribution</h3>
              {[
                { label: 'Community Rewards', percentage: '40%', color: 'bg-orange-500' },
                { label: 'Restaurant Partners', percentage: '25%', color: 'bg-red-500' },
                { label: 'Development Team', percentage: '20%', color: 'bg-pink-500' },
                { label: 'Treasury & Operations', percentage: '15%', color: 'bg-purple-500' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white font-medium">{item.label}</span>
                    <span className="text-gray-400">{item.percentage}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: item.percentage }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Utility & Benefits */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Token Utility</h3>
              {[
                {
                  title: 'Loyalty Rewards',
                  description: 'Earn tokens for every order and unlock exclusive benefits'
                },
                {
                  title: 'Governance Rights',
                  description: 'Vote on platform upgrades and new restaurant partnerships'
                },
                {
                  title: 'Staking Rewards',
                  description: 'Stake tokens to earn yield and premium platform features'
                },
                {
                  title: 'Payment Discounts',
                  description: 'Pay with $MIMI for reduced fees and faster processing'
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{benefit.title}</h4>
                    <p className="text-gray-400">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                Development Roadmap
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our vision for the future of decentralized restaurant technology.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                quarter: 'Q1 2025',
                title: 'Platform Launch',
                status: 'completed',
                items: ['AI Chat Ordering', 'USDC Payments', 'Basic Analytics', 'Restaurant Onboarding']
              },
              {
                quarter: 'Q2 2025',
                title: 'Token Integration',
                status: 'current',
                items: ['$MIMI Token Launch', 'Loyalty Program', 'Staking Mechanisms', 'Governance Framework']
              },
              {
                quarter: 'Q3 2025',
                title: 'Advanced Features',
                status: 'upcoming',
                items: ['Supply Chain Tracking', 'Multi-Chain Support', 'Advanced AI Models', 'Enterprise Tools']
              },
              {
                quarter: 'Q4 2025',
                title: 'Global Expansion',
                status: 'future',
                items: ['International Markets', 'Franchise Integration', 'Mobile Apps', 'IoT Connectivity']
              }
            ].map((phase, index) => (
              <div key={index} className="relative">
                <div className="flex items-start space-x-6">
                  {/* Timeline dot */}
                  <div className={`w-4 h-4 rounded-full mt-6 flex-shrink-0 ${
                    phase.status === 'completed' ? 'bg-green-500' :
                    phase.status === 'current' ? 'bg-orange-500' :
                    'bg-gray-600'
                  }`}></div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-xl font-bold text-white">{phase.quarter}</h3>
                      <Badge variant={phase.status === 'completed' ? 'default' : 'outline'} 
                             className={
                               phase.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                               phase.status === 'current' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                               'border-gray-600 text-gray-400'
                             }>
                        {phase.status === 'completed' ? 'Completed' :
                         phase.status === 'current' ? 'In Progress' :
                         'Planned'}
                      </Badge>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-3">{phase.title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {phase.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <ChevronRight className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-400 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Timeline line */}
                {index < 3 && (
                  <div className="absolute left-2 top-10 w-0.5 h-full bg-gray-800"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join the future of restaurant technology. Start accepting crypto, engaging customers with AI, and building loyalty with blockchain rewards.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-lg px-8 py-6 h-auto"
              onClick={() => setLocation('/dashboard')}
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 text-lg px-8 py-6 h-auto"
              onClick={() => scrollToSection('features')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
              <span className="text-xl font-bold playwrite-font text-white">OrderFi</span>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <span>© 2025 OrderFi. All rights reserved.</span>
              <span>•</span>
              <button className="hover:text-white transition-colors">Privacy</button>
              <span>•</span>
              <button className="hover:text-white transition-colors">Terms</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}