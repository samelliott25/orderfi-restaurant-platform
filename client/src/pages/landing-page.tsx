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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Minimal Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
              <span className="text-2xl font-light text-white">OrderFi</span>
            </div>

            {/* Single CTA */}
            <Button 
              className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-3 rounded-full"
              onClick={() => setLocation('/dashboard')}
            >
              Launch App
            </Button>
          </div>
        </div>
      </nav>

      {/* Innovative Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-blue-900/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Main Value Proposition */}
          <div className="mb-16">
            <h1 className="text-6xl md:text-8xl font-light mb-8 leading-none tracking-tight">
              <span className="block text-white/60">Order with</span>
              <span className="block bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent font-medium">AI</span>
              <span className="block text-white/60">Earn</span>
              <span className="block bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent font-medium">Bitcoin</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
              The restaurant revolution starts here. AI ordering meets Bitcoin rewards on Base blockchain.
            </p>
          </div>

          {/* Visual Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-medium text-white mb-3">Chat</h3>
              <p className="text-gray-400">"I want something spicy"</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-8 h-8 text-gray-600" />
            </div>

            {/* Step 2 */}
            <div className="group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Coins className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-medium text-white mb-3">Earn</h3>
              <p className="text-gray-400">+0.001 BTC reward</p>
            </div>
          </div>

          {/* Single CTA */}
          <div className="space-y-6">
            <Button 
              size="lg"
              className="bg-white text-black hover:bg-gray-100 font-medium px-12 py-6 h-auto text-xl rounded-full transition-all duration-300 hover:scale-105"
              onClick={() => setLocation('/dashboard')}
            >
              Start Now
            </Button>
            
            {/* Key stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <span>80% lower fees</span>
              <span>•</span>
              <span>$0.01 Base transactions</span>
              <span>•</span>
              <span>Bitcoin rewards</span>
            </div>
          </div>
        </div>
      </section>

      {/* Single Demo Section */}
      <section id="features" className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-12 text-white">
            Watch the magic happen
          </h2>
          
          {/* Live conversation flow */}
          <div className="bg-black/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-gray-800">
            <div className="space-y-6 max-w-lg mx-auto">
              
              {/* Customer message */}
              <div className="flex justify-end animate-slide-in">
                <div className="bg-white text-black rounded-2xl rounded-br-sm px-6 py-4 max-w-xs">
                  <p className="text-sm font-medium">"Something spicy please"</p>
                </div>
              </div>
              
              {/* AI response with Bitcoin reward */}
              <div className="flex justify-start animate-slide-in" style={{ animationDelay: '1s' }}>
                <div className="bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-2xl rounded-bl-sm px-6 py-4 max-w-sm">
                  <p className="text-sm mb-3">Perfect! Spicy Diavola Pizza</p>
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">$18.99</span>
                      <span className="text-sm font-bold text-yellow-300">+₿0.001</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Instant confirmation */}
              <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-4 animate-fade-in" style={{ animationDelay: '2s' }}>
                <div className="flex items-center justify-center space-x-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Paid • Earned • Delivered</span>
                </div>
              </div>
            </div>
            
            {/* Key benefits */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">80%</div>
                <div className="text-sm text-gray-400">Lower Fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">$0.01</div>
                <div className="text-sm text-gray-400">Base Network</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">₿</div>
                <div className="text-sm text-gray-400">Rewards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
              </svg>
            </div>
            <span className="text-xl font-light text-white">OrderFi</span>
          </div>
          
          <p className="text-gray-400 mb-8">
            AI ordering meets Bitcoin rewards on Base blockchain
          </p>
          
          <div className="flex justify-center space-x-8 text-sm text-gray-500 mb-8">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Support</button>
          </div>
          
          <div className="text-sm text-gray-600">
            © 2025 OrderFi. Built on Base Network.
          </div>
        </div>
      </footer>
    </div>
  );
}