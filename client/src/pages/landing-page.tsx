import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  const [isClicked, setIsClicked] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [location, setLocation] = useLocation();

  const handleDAppClick = () => {
    setIsClicked(true);
    setShowTransition(true);
    
    // Immediate navigation backup for reliability
    setTimeout(() => {
      if (showTransition) {
        setLocation('/dashboard');
      }
    }, 2500);
  };

  // Simple navigation after animation
  useEffect(() => {
    if (showTransition) {
      const timer = setTimeout(() => {
        setLocation('/dashboard');
      }, 1500); // Wait for animation to complete
      
      return () => clearTimeout(timer);
    }
  }, [showTransition, setLocation]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-white playwrite-font">OrderFi</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#solution" className="text-gray-300 hover:text-orange-400 transition-colors">Solution</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-orange-400 transition-colors">How it works</a>
              <a href="#market" className="text-gray-300 hover:text-orange-400 transition-colors">Market</a>
              <a href="#team" className="text-gray-300 hover:text-orange-400 transition-colors">Team</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                onClick={() => setLocation('/customer')}
              >
                Start Ordering
              </Button>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setLocation('/dashboard')}
              >
                Launch App
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 via-black to-orange-900/5"></div>
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="url(#gradient)" strokeWidth="1"/>
            </pattern>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-orange-400/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
        {/* Main Headline */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-light mb-6 leading-none tracking-tight">
            <span className="block text-white/90">Discover the</span>
            <span className="block text-white/60">transformative power of</span>
            <span className="block bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent font-medium playwrite-font">AI ordering</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed mb-12">
            From Bitcoin to emerging altcoins, learn about the benefits, security features, and the potential for high returns that AI-powered restaurant ordering offers.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button 
            variant="outline"
            size="lg"
            className="border-orange-500 text-orange-400 hover:bg-orange-500/10 px-8 py-4 text-lg font-medium"
            onClick={() => setLocation('/customer')}
          >
            Learn More
          </Button>
          <Button 
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-medium"
            onClick={() => setLocation('/dashboard')}
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Dashboard Cards Preview */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 opacity-90">
          
          {/* Fear and Greed Index Card */}
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-orange-500/20">
            <div className="text-sm text-gray-400 mb-2">Order Confidence</div>
            <div className="text-orange-400 font-bold mb-1">Excellent: 89</div>
            <div className="w-16 h-16 mx-auto">
              <div className="relative w-full h-full">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" stroke="#374151" strokeWidth="2"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="89, 100"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-orange-400 font-bold">89</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bitcoin Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">₿</span>
              </div>
              <span className="text-sm opacity-75">+5.2%</span>
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold">BTC</div>
              <div className="text-sm opacity-75">Bitcoin</div>
            </div>
            <div className="text-lg font-bold">$67,892.10</div>
          </div>

          {/* Portfolio Balance */}
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-orange-500/20">
            <div className="text-sm text-gray-400 mb-2">Current Balance</div>
            <div className="text-2xl font-bold text-white mb-1">$44,578.12</div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-green-400">$26,856.31</span>
              <span className="text-red-400">$19,613.37</span>
            </div>
            <div className="mt-3 h-16">
              <svg className="w-full h-full" viewBox="0 0 100 40">
                <polyline points="0,35 20,30 40,15 60,20 80,10 100,5" 
                         fill="none" stroke="#f97316" strokeWidth="2"/>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                </linearGradient>
                <polygon points="0,35 20,30 40,15 60,20 80,10 100,5 100,40 0,40" 
                        fill="url(#chartGradient)"/>
              </svg>
            </div>
          </div>

          {/* Ethereum Surge */}
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-orange-500/20">
            <div className="text-sm text-orange-400 font-medium mb-2">OrderFi surges</div>
            <div className="text-lg font-bold text-white mb-1">to new all-time high</div>
            <div className="text-sm text-gray-400 mb-3">amidst growing institutional interest</div>
            <div className="text-xs text-gray-500">2 hours ago</div>
          </div>

          {/* Active Users */}
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-orange-500/20">
            <div className="text-sm text-gray-400 mb-2">Active Users</div>
            <div className="text-3xl font-bold text-white mb-1">47k</div>
            <div className="text-sm text-gray-400 mb-3">OrderFi's active restaurant count</div>
            <div className="h-8">
              <svg className="w-full h-full" viewBox="0 0 60 20">
                <polyline points="0,15 10,12 20,8 30,10 40,6 50,4 60,2" 
                         fill="none" stroke="#f97316" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>

        </div>
      </div>
      </div>

      {/* Pitchdeck Sections */}
      {/* Problem Section */}
      <section id="solution" className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
              The <span className="text-orange-400 playwrite-font">Problem</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Traditional restaurant operations are fundamentally broken, costing the industry billions in fees and lost opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">High Payment Fees</h3>
              <p className="text-gray-400 leading-relaxed mb-6">Credit card processing fees consume 3-4% of every transaction, costing restaurants over $50B annually in pure overhead.</p>
              <div className="text-3xl font-bold text-red-400">$50B+</div>
              <div className="text-sm text-gray-500">Annual processing fees</div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 6V4L7 9L12 14V12C15.31 12 18 14.69 18 18C18 18.35 17.97 18.69 17.92 19.02L19.34 20.44C19.78 19.67 20 18.86 20 18C20 13.58 16.42 10 12 10Z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Manual Operations</h3>
              <p className="text-gray-400 leading-relaxed mb-6">Staff waste countless hours on repetitive tasks like order taking and inventory management instead of focusing on food quality.</p>
              <div className="text-3xl font-bold text-yellow-400">65%</div>
              <div className="text-sm text-gray-500">Time spent on manual tasks</div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Poor Experience</h3>
              <p className="text-gray-400 leading-relaxed mb-6">Long wait times, frequent order errors, and zero loyalty rewards drive customers to competitors with superior digital experiences.</p>
              <div className="text-3xl font-bold text-blue-400">47%</div>
              <div className="text-sm text-gray-500">Customer churn rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="how-it-works" className="py-32 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
              Our <span className="text-orange-400 playwrite-font">Solution</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Revolutionary AI-powered restaurant platform combining crypto payments with Bitcoin rewards
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">AI Conversational Ordering</h3>
                  <p className="text-gray-400 leading-relaxed">Advanced GPT-4 powered AI handles customer orders, recommendations, and support through natural language conversations, reducing wait times by 80%.</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <span className="text-orange-400 font-bold">80% faster</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500">24/7 availability</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl font-bold">₿</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Base Blockchain Payments</h3>
                  <p className="text-gray-400 leading-relaxed">Accept USDC payments on Base network with $0.01 transaction fees instead of 3% credit card charges, saving restaurants thousands monthly.</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <span className="text-blue-400 font-bold">$0.01 fees</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500">Instant settlement</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.8 10.9C11.8 10.9 12.4 8.1 15.1 8.1C17.8 8.1 18.2 10.5 18.2 10.9H20.7C20.7 9.2 19.6 5.6 15.1 5.6C10.6 5.6 9.3 9.2 9.3 10.9C9.3 14.8 13.1 16.4 13.1 18.9H15.1C15.1 16.4 18.2 14.8 18.2 10.9H11.8Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Bitcoin Rewards Program</h3>
                  <p className="text-gray-400 leading-relaxed">Revolutionary loyalty system where customers and restaurants earn Bitcoin rewards on every transaction, creating unprecedented engagement and retention.</p>
                  <div className="flex items-center mt-4 space-x-4">
                    <span className="text-green-400 font-bold">+0.001 BTC</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500">Per order</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-gray-800">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-white mb-2">Live Transaction Flow</h4>
                <p className="text-gray-400">Watch OrderFi in action</p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-2xl p-6 ml-8 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">C</span>
                    </div>
                    <span className="text-gray-400 text-sm">Customer</span>
                  </div>
                  <p className="text-white">"I want something spicy for dinner, under $20"</p>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 mr-8 text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm">OrderFi AI</span>
                  </div>
                  <p className="mb-4">Perfect! Our Spicy Diavola Pizza is trending today - $18.99</p>
                  <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-sm">
                      <span>Payment: USDC</span>
                      <span className="font-bold text-yellow-300">+₿0.001 reward</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"/>
                      </svg>
                    </div>
                    <span className="text-green-400 font-bold">Transaction Complete</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-green-400 font-bold">✓ Paid</div>
                      <div className="text-gray-400">USDC</div>
                    </div>
                    <div>
                      <div className="text-green-400 font-bold">✓ Earned</div>
                      <div className="text-gray-400">Bitcoin</div>
                    </div>
                    <div>
                      <div className="text-green-400 font-bold">✓ Ordered</div>
                      <div className="text-gray-400">Kitchen</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Analytics Section */}
      <section id="market" className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
              Market <span className="text-orange-400 playwrite-font">Analytics</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Comprehensive market intelligence revealing massive addressable opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Market Metrics Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
                <div className="text-4xl font-bold text-orange-400 mb-2">$899B</div>
                <div className="text-gray-400 text-sm mb-4">Global restaurant market</div>
                <div className="h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    <polyline points="0,35 25,25 50,15 75,20 100,10" fill="none" stroke="#f97316" strokeWidth="2"/>
                    <linearGradient id="marketGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                    </linearGradient>
                    <polygon points="0,35 25,25 50,15 75,20 100,10 100,40 0,40" fill="url(#marketGradient1)"/>
                  </svg>
                </div>
                <div className="text-green-400 text-sm font-medium">+12.3% YoY</div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
                <div className="text-4xl font-bold text-blue-400 mb-2">$50B</div>
                <div className="text-gray-400 text-sm mb-4">Payment processing fees</div>
                <div className="h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    <polyline points="0,30 25,35 50,25 75,30 100,20" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                    <linearGradient id="marketGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                    </linearGradient>
                    <polygon points="0,30 25,35 50,25 75,30 100,20 100,40 0,40" fill="url(#marketGradient2)"/>
                  </svg>
                </div>
                <div className="text-red-400 text-sm font-medium">Wasted annually</div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
                <div className="text-4xl font-bold text-green-400 mb-2">1.2M</div>
                <div className="text-gray-400 text-sm mb-4">US restaurants</div>
                <div className="h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    <polyline points="0,25 25,22 50,18 75,15 100,12" fill="none" stroke="#22c55e" strokeWidth="2"/>
                    <linearGradient id="marketGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                    </linearGradient>
                    <polygon points="0,25 25,22 50,18 75,15 100,12 100,40 0,40" fill="url(#marketGradient3)"/>
                  </svg>
                </div>
                <div className="text-green-400 text-sm font-medium">Target market</div>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-gray-800 hover:border-orange-500/30 transition-all duration-300">
                <div className="text-4xl font-bold text-purple-400 mb-2">47%</div>
                <div className="text-gray-400 text-sm mb-4">Digital delivery growth</div>
                <div className="h-16">
                  <svg className="w-full h-full" viewBox="0 0 100 40">
                    <polyline points="0,38 25,32 50,20 75,15 100,8" fill="none" stroke="#a855f7" strokeWidth="2"/>
                    <linearGradient id="marketGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
                    </linearGradient>
                    <polygon points="0,38 25,32 50,20 75,15 100,8 100,40 0,40" fill="url(#marketGradient4)"/>
                  </svg>
                </div>
                <div className="text-purple-400 text-sm font-medium">2024 growth</div>
              </div>
            </div>

            {/* Market Analysis Dashboard */}
            <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-6">Market Penetration Analysis</h3>
              
              <div className="space-y-6">
                {/* Total Addressable Market */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Total Addressable Market</span>
                    <span className="text-orange-400 font-bold">$899B</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                {/* Serviceable Market */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Serviceable Market (AI Ready)</span>
                    <span className="text-blue-400 font-bold">$180B</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                {/* Crypto Adoption */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Crypto Payment Ready</span>
                    <span className="text-green-400 font-bold">$45B</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                {/* Current Capture */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">OrderFi Market Capture</span>
                    <span className="text-purple-400 font-bold">$2.1B</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 7L11 12H15L12 17L14 12H10L13 7Z"/>
                    </svg>
                  </div>
                  <span className="text-orange-400 font-bold">Market Opportunity</span>
                </div>
                <p className="text-gray-300 text-sm">
                  With only 2.5% of restaurants currently using AI ordering and 0.8% accepting crypto payments, 
                  OrderFi is positioned to capture a significant portion of this rapidly expanding market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team & CTA Section */}
      <section id="team" className="py-32 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
              Ready to <span className="text-orange-400 playwrite-font">Transform</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Join the future of restaurant technology with AI ordering and Bitcoin rewards
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Call to Action */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white">Start earning Bitcoin on every order</h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Transform your restaurant operations with AI-powered ordering, eliminate payment processing fees, 
                  and reward customers with Bitcoin on every transaction.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">80% reduction in payment fees</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">24/7 AI customer service</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Bitcoin rewards for loyalty</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"/>
                    </svg>
                  </div>
                  <span className="text-gray-300">Instant Base network settlement</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-medium flex-1"
                  onClick={() => setLocation('/dashboard')}
                >
                  Launch Restaurant Platform
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-orange-500 text-orange-400 hover:bg-orange-500/10 px-8 py-4 text-lg font-medium flex-1"
                  onClick={() => setLocation('/customer')}
                >
                  Try AI Ordering
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">47k+</div>
                  <div className="text-sm text-gray-500">Active restaurants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">$12M</div>
                  <div className="text-sm text-gray-500">Bitcoin earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">2.1M</div>
                  <div className="text-sm text-gray-500">Orders processed</div>
                </div>
              </div>
            </div>

            {/* Live Stats Dashboard */}
            <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-gray-800">
              <h3 className="text-2xl font-bold text-white mb-6">Live Network Activity</h3>
              
              <div className="space-y-6">
                {/* Live Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-2xl p-4">
                    <div className="text-orange-400 text-2xl font-bold">$892k</div>
                    <div className="text-gray-400 text-sm">24h Volume</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">+12.3%</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-2xl p-4">
                    <div className="text-blue-400 text-2xl font-bold">1,247</div>
                    <div className="text-gray-400 text-sm">Active Orders</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-blue-400 text-xs">Live</span>
                    </div>
                  </div>
                </div>

                {/* Transaction Feed */}
                <div className="bg-gray-800/30 rounded-2xl p-4">
                  <div className="text-white font-medium mb-3">Recent Transactions</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-gray-300">Spicy Pizza Order</span>
                      </div>
                      <span className="text-orange-400">+₿0.0012</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300">Burger Combo</span>
                      </div>
                      <span className="text-green-400">+₿0.0008</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300">Sushi Set</span>
                      </div>
                      <span className="text-blue-400">+₿0.0015</span>
                    </div>
                  </div>
                </div>

                {/* Network Stats */}
                <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    <span className="text-orange-400 font-bold">Network Status</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-white font-bold">99.9%</div>
                      <div className="text-gray-400">Uptime</div>
                    </div>
                    <div>
                      <div className="text-white font-bold">0.8s</div>
                      <div className="text-gray-400">Avg Response</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}