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
  BarChart3,
  Minus
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
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
              <span className="text-xl font-medium text-gray-900">
                OrderFi
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: 'hero', label: 'Home' },
                { id: 'features', label: 'Features' },
                { id: 'platform', label: 'Platform' },
                { id: 'specs', label: 'Specs' },
                { id: 'pricing', label: 'Pricing' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.id 
                      ? 'text-orange-500' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setLocation('/dashboard')}
              >
                Sign In
              </Button>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
                onClick={() => setLocation('/dashboard')}
              >
                Try Now
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
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100">
            <div className="px-4 py-6 space-y-4">
              {[
                { id: 'hero', label: 'Home' },
                { id: 'features', label: 'Features' },
                { id: 'platform', label: 'Platform' },
                { id: 'specs', label: 'Specs' },
                { id: 'pricing', label: 'Pricing' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 py-2"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setLocation('/dashboard')}
                >
                  Sign In
                </Button>
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={() => setLocation('/dashboard')}
                >
                  Try Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-24 pb-20 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-orange-50 rounded-full mb-8">
              <span className="text-orange-600 text-sm font-medium">New</span>
              <Minus className="w-3 h-3 mx-2 text-orange-400" />
              <span className="text-gray-600 text-sm">AI-Powered Restaurant OS</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight text-gray-900">
              Built for the future
              <br />
              of <span className="font-medium text-orange-500">dining</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              OrderFi combines AI ordering, crypto payments, and smart analytics 
              in one seamless restaurant platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Button 
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-4 h-auto text-lg"
                onClick={() => setLocation('/dashboard')}
              >
                Try OrderFi
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8 py-4 h-auto text-lg"
                onClick={() => scrollToSection('features')}
              >
                Learn More
              </Button>
            </div>

            {/* Product Image/Visual */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gray-100 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-500">OrderFi Dashboard</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-600">$24.5K</div>
                      <div className="text-sm text-gray-600">Today's Revenue</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">342</div>
                      <div className="text-sm text-gray-600">Orders</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">98.2%</div>
                      <div className="text-sm text-gray-600">Satisfaction</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">AI Assistant</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Wallet className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">Crypto Payments</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">Connected</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-orange-100 rounded-full opacity-60"></div>
              <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-blue-100 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-light mb-6 text-gray-900">
              Everything you need
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light">
              A complete restaurant operating system built for modern dining experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                icon: <Bot className="w-6 h-6" />,
                title: 'AI Assistant',
                description: 'Intelligent chat ordering that understands natural language and customer preferences.',
                stats: '99.7% accuracy'
              },
              {
                icon: <Wallet className="w-6 h-6" />,
                title: 'Crypto Payments',
                description: 'Accept USDC and major cryptocurrencies with instant settlement.',
                stats: '0% fees'
              },
              {
                icon: <Coins className="w-6 h-6" />,
                title: 'Loyalty Rewards',
                description: 'Built-in token rewards system that increases customer retention.',
                stats: '+40% retention'
              },
              {
                icon: <Network className="w-6 h-6" />,
                title: 'Blockchain Storage',
                description: 'Secure, immutable order history and menu versioning.',
                stats: '100% uptime'
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Analytics',
                description: 'Real-time insights and predictive analytics for better decisions.',
                stats: 'Live updates'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Security',
                description: 'Enterprise-grade security with multi-signature wallet protection.',
                stats: 'Bank-level'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-3 font-light">{feature.description}</p>
                <div className="text-sm text-orange-600 font-medium">{feature.stats}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section id="platform" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-light mb-8 text-gray-900">
                One platform,
                <br />
                <span className="font-medium">infinite possibilities</span>
              </h2>
              
              <div className="space-y-8">
                {[
                  {
                    title: 'Smart Conversations',
                    description: 'AI that understands your customers and suggests the perfect menu items.'
                  },
                  {
                    title: 'Instant Payments',
                    description: 'Accept crypto and traditional payments with zero processing delays.'
                  },
                  {
                    title: 'Real-time Kitchen',
                    description: 'Orders flow directly to your kitchen with smart timing and prep alerts.'
                  },
                  {
                    title: 'Deep Analytics',
                    description: 'Understand your business with actionable insights and forecasting.'
                  }
                ].map((item, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-6">
                    <h3 className="text-lg font-medium mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 font-light leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3"
                  onClick={() => setLocation('/dashboard')}
                >
                  Explore Platform
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right side - Product showcase */}
            <div className="relative">
              <div className="bg-gray-50 rounded-3xl p-8">
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  {/* Mobile interface mockup */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-900 font-medium">AI Assistant</div>
                          <div className="text-xs text-gray-500">What would you like to order today?</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-2xl p-4 ml-8">
                      <div className="text-sm text-gray-900">I'd like a margherita pizza with extra cheese</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-900 font-medium">Perfect choice!</div>
                          <div className="text-xs text-gray-500">Added to cart • $18.99</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Powered by GPT-4o</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">Live</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specs Section */}
      <section id="specs" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-900">
              Technical specifications
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light">
              Built on cutting-edge technology for maximum performance and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                category: 'AI Engine',
                specs: [
                  { label: 'Model', value: 'GPT-4o' },
                  { label: 'Response time', value: '<200ms' },
                  { label: 'Accuracy', value: '99.7%' },
                  { label: 'Languages', value: '25+' }
                ]
              },
              {
                category: 'Blockchain',
                specs: [
                  { label: 'Network', value: 'Base L2' },
                  { label: 'Token standard', value: 'ERC-20' },
                  { label: 'Transaction cost', value: '<$0.01' },
                  { label: 'Settlement', value: 'Instant' }
                ]
              },
              {
                category: 'Performance',
                specs: [
                  { label: 'Uptime', value: '99.99%' },
                  { label: 'Concurrent users', value: '10,000+' },
                  { label: 'Orders/second', value: '1,000+' },
                  { label: 'Global CDN', value: '150+ nodes' }
                ]
              },
              {
                category: 'Security',
                specs: [
                  { label: 'Encryption', value: 'AES-256' },
                  { label: 'Authentication', value: 'Multi-factor' },
                  { label: 'Compliance', value: 'SOC 2 Type II' },
                  { label: 'Backup', value: 'Real-time' }
                ]
              }
            ].map((section, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-6 text-gray-900">{section.category}</h3>
                <div className="space-y-4">
                  {section.specs.map((spec, specIndex) => (
                    <div key={specIndex} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{spec.label}</span>
                      <span className="text-sm font-medium text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-900">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light">
              Start free, scale as you grow. No hidden fees, no long-term contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="text-xl font-medium mb-2 text-gray-900">Starter</h3>
              <p className="text-gray-600 mb-6">Perfect for small restaurants</p>
              <div className="mb-8">
                <span className="text-4xl font-light text-gray-900">Free</span>
                <span className="text-gray-500 ml-2">forever</span>
              </div>
              <div className="space-y-4 mb-8">
                {[
                  'Up to 100 orders/month',
                  'Basic AI assistant',
                  'Standard analytics',
                  'Email support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900">
                Get Started
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-orange-500 rounded-3xl p-8 text-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-white text-orange-500 font-medium">Most Popular</Badge>
              </div>
              <h3 className="text-xl font-medium mb-2">Pro</h3>
              <p className="text-orange-100 mb-6">For growing restaurants</p>
              <div className="mb-8">
                <span className="text-4xl font-light">$99</span>
                <span className="text-orange-200 ml-2">/month</span>
              </div>
              <div className="space-y-4 mb-8">
                {[
                  'Unlimited orders',
                  'Advanced AI with voice',
                  'Real-time analytics',
                  'Crypto payments',
                  'Priority support',
                  'Custom integrations'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-white" />
                    <span className="text-orange-100 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-white hover:bg-gray-100 text-orange-500">
                Start Free Trial
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="text-xl font-medium mb-2 text-gray-900">Enterprise</h3>
              <p className="text-gray-600 mb-6">For restaurant chains</p>
              <div className="mb-8">
                <span className="text-4xl font-light text-gray-900">Custom</span>
              </div>
              <div className="space-y-4 mb-8">
                {[
                  'Multi-location support',
                  'Custom AI training',
                  'Advanced analytics',
                  'White-label solution',
                  'Dedicated support',
                  'SLA guarantees'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full border-gray-300 text-gray-900 hover:bg-gray-100">
                Contact Sales
              </Button>
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-500 mb-4">All plans include our core features</p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <span>• 99.99% uptime SLA</span>
              <span>• SOC 2 compliance</span>
              <span>• 24/7 monitoring</span>
              <span>• Data encryption</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-gray-900">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-light">
            Join thousands of restaurants already using OrderFi to streamline operations and increase revenue.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-4 h-auto text-lg"
              onClick={() => setLocation('/dashboard')}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8 py-4 h-auto text-lg"
              onClick={() => scrollToSection('features')}
            >
              Schedule Demo
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            No setup fees • Cancel anytime • 30-day free trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                </div>
                <span className="text-xl font-medium text-gray-900">OrderFi</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                The future of restaurant technology. AI-powered ordering, crypto payments, and smart analytics.
              </p>
            </div>

            {/* Product */}
            <div className="col-span-1">
              <h4 className="font-medium text-gray-900 mb-4">Product</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div>Features</div>
                <div>Pricing</div>
                <div>API Docs</div>
                <div>Integrations</div>
              </div>
            </div>

            {/* Company */}
            <div className="col-span-1">
              <h4 className="font-medium text-gray-900 mb-4">Company</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>

            {/* Support */}
            <div className="col-span-1">
              <h4 className="font-medium text-gray-900 mb-4">Support</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div>Help Center</div>
                <div>Community</div>
                <div>System Status</div>
                <div>Security</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2025 OrderFi Inc. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <button className="hover:text-gray-900 transition-colors">Privacy Policy</button>
              <button className="hover:text-gray-900 transition-colors">Terms of Service</button>
              <button className="hover:text-gray-900 transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}