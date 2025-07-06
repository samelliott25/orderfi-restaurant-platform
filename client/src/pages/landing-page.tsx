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
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Theme Toggle - Top Right */}
      <div className="fixed top-4 right-4 z-40">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Keyhole Reveal Transition */}
      {showTransition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background with keyhole reveal animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 animate-keyhole-reveal">
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30" />
          </div>
          
          {/* Center content - positioned exactly like home page */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg space-y-6">
            {/* OrderFi Logo - Same container as home page */}
            <div className="relative w-80 h-48 sm:w-88 sm:h-56 md:w-[26rem] md:h-72 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-bounce playwrite-font px-4 py-6 gentle-glow">
                  OrderFi
                </div>
              </div>
            </div>
            
            {/* Loading text below logo */}
            <div className="text-center">
              <div className="text-xl text-white animate-pulse">
                Launching AI Assistant...
              </div>
            </div>
          </div>
          
          {/* Morphing circles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20 animate-ping"
                style={{
                  width: `${(i + 1) * 100}px`,
                  height: `${(i + 1) * 100}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
      )}
      {/* Main Container - Only visible when not transitioning */}
      {!showTransition && (
        <div className="flex flex-col items-center justify-center w-full max-w-lg space-y-6">
          
          {/* OrderFi Logo - Animated SVG */}
          <div className="relative w-80 h-48 sm:w-88 sm:h-56 md:w-[26rem] md:h-72 flex items-center justify-center">
            <div className="text-center">
              <div className="text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse playwrite-font px-4 py-6 gentle-glow hover-float">
                OrderFi
              </div>
              
            </div>
          </div>
          
          {/* Logo spacing */}
          <div className="text-center space-y-2">
            <p className="text-xs sm:text-sm text-muted-foreground px-4">
              AI-Powered Restaurant Platform with Blockchain Rewards
            </p>
          </div>
          
          {/* Single DApp Entry Button */}
          <div className="w-full max-w-xs space-y-2">
            <Button
              onClick={handleDAppClick}
              className={`
                relative overflow-hidden w-full py-4 sm:py-6 text-lg sm:text-xl font-bold text-white 
                shadow-xl transition-all duration-300 transform rounded-xl
                bg-gradient-to-r from-orange-500 via-red-500 to-pink-500
                hover:from-orange-600 hover:via-red-600 hover:to-pink-600
                hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50
                active:scale-95 active:shadow-lg
                dark-mode-button
                ${isClicked ? 'animate-pulse scale-95' : ''}
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                before:via-white/20 before:to-transparent before:-translate-x-full 
                hover:before:translate-x-full before:transition-transform before:duration-700
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg 
                  className="w-4 h-4 ai-sparkle-1" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
                Enter DApp
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${isClicked ? 'translate-x-1' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              
              {/* Ripple effect */}
              <div className={`
                absolute inset-0 rounded-xl transition-opacity duration-300
                ${isClicked ? 'animate-ping bg-white/30' : 'opacity-0'}
              `} />
            </Button>
          </div>
          
        </div>
      )}
      </div>

      {/* Pitchdeck Sections */}
      {/* Problem Section */}
      <section className="py-24 bg-gradient-to-b from-background to-gray-50 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 playwrite-font bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              The Problem
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Traditional restaurant operations are broken, costing owners billions in fees and lost opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">💸</div>
              <h3 className="text-xl font-bold mb-4">High Payment Fees</h3>
              <p className="text-muted-foreground">Credit card processing fees eat 3-4% of every transaction, costing restaurants $50B+ annually</p>
            </div>
            
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-4">Manual Operations</h3>
              <p className="text-muted-foreground">Staff spend hours taking orders, managing inventory, and handling customer service instead of focusing on food</p>
            </div>
            
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-4">Poor Customer Experience</h3>
              <p className="text-muted-foreground">Long wait times, order errors, and no rewards for loyalty drive customers away</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 playwrite-font bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Our Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered restaurant platform with crypto payments and Bitcoin rewards
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">AI</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Conversational Ordering</h3>
                  <p className="text-muted-foreground">GPT-4 powered AI handles customer orders, recommendations, and support in natural language</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">₿</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Crypto Payments</h3>
                  <p className="text-muted-foreground">Accept USDC on Base blockchain with $0.01 fees instead of 3% credit card charges</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">🎁</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Bitcoin Rewards</h3>
                  <p className="text-muted-foreground">Customers and restaurants earn Bitcoin rewards on every transaction, building loyalty</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h4 className="text-lg font-bold mb-2">Live Demo</h4>
                <p className="text-sm text-muted-foreground">See how it works</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 ml-8">
                  <p className="text-sm">"I want something spicy for dinner"</p>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 mr-8">
                  <p className="text-sm mb-2">Perfect! Our Spicy Diavola Pizza is trending today.</p>
                  <div className="bg-white/20 rounded p-2 text-xs">
                    $18.99 • +0.001 BTC reward
                  </div>
                </div>
                
                <div className="bg-green-500 text-white rounded-lg p-3 text-center">
                  <p className="text-sm">✓ Order confirmed • Paid with USDC • Bitcoin earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Size Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 playwrite-font bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Market Opportunity
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Massive addressable market with clear growth trajectory
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                $899B
              </div>
              <p className="text-sm text-muted-foreground">Global restaurant market size</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
                $50B+
              </div>
              <p className="text-sm text-muted-foreground">Annual payment processing fees</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
                1.2M
              </div>
              <p className="text-sm text-muted-foreground">Restaurants in US alone</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                47%
              </div>
              <p className="text-sm text-muted-foreground">Growth in food delivery (2024)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 playwrite-font bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Business Model
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multiple revenue streams with high margins and recurring income
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">SaaS Subscriptions</h3>
              <div className="text-3xl font-bold text-orange-600 mb-2">$99/mo</div>
              <p className="text-muted-foreground mb-4">Per restaurant for AI platform access</p>
              <ul className="space-y-2 text-sm">
                <li>• Unlimited AI orders</li>
                <li>• Real-time analytics</li>
                <li>• Priority support</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Transaction Fees</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">0.5%</div>
              <p className="text-muted-foreground mb-4">On crypto payments (vs 3% cards)</p>
              <ul className="space-y-2 text-sm">
                <li>• Base network settlement</li>
                <li>• Instant confirmation</li>
                <li>• No chargebacks</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Token Economics</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">₿ Revenue</div>
              <p className="text-muted-foreground mb-4">From network growth and adoption</p>
              <ul className="space-y-2 text-sm">
                <li>• Token appreciation</li>
                <li>• Staking rewards</li>
                <li>• Network effects</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 playwrite-font bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experienced team with deep expertise in AI, blockchain, and restaurant technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                AI
              </div>
              <h3 className="text-xl font-bold mb-2">AI Engineering</h3>
              <p className="text-muted-foreground">Former OpenAI, Google AI researchers building next-gen conversational systems</p>
            </div>

            <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                ₿
              </div>
              <h3 className="text-xl font-bold mb-2">Blockchain Experts</h3>
              <p className="text-muted-foreground">Core contributors to Base, Ethereum scaling solutions, and DeFi protocols</p>
            </div>

            <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                🍕
              </div>
              <h3 className="text-xl font-bold mb-2">Restaurant Veterans</h3>
              <p className="text-muted-foreground">15+ years experience scaling restaurant chains and understanding operator needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white playwrite-font">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Be part of the first AI-powered, Bitcoin-rewarding restaurant ecosystem
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-6 h-auto text-xl"
              onClick={() => setLocation('/dashboard')}
            >
              Launch Restaurant
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10 font-bold px-8 py-6 h-auto text-xl"
              onClick={() => setLocation('/customer')}
            >
              Start Ordering
            </Button>
          </div>
          
          <div className="mt-8 text-white/80 text-sm">
            Join 500+ restaurants already earning Bitcoin • Start free today
          </div>
        </div>
      </section>
    </div>
  );
}