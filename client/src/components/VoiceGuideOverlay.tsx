import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X,
  Mic,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useVoiceGuide, type VoiceGuideStep } from "@/hooks/useVoiceGuide";

interface VoiceGuideOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export function VoiceGuideOverlay({ isVisible, onClose }: VoiceGuideOverlayProps) {
  const {
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    isPlaying,
    isMuted,
    startTutorial,
    stopTutorial,
    nextStep,
    previousStep,
    toggleMute,
    skipToStep
  } = useVoiceGuide();

  const [highlightElement, setHighlightElement] = useState<string | null>(null);

  // Web3 Restaurant Tutorial Steps
  const tutorialSteps: VoiceGuideStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Web3 Ordering',
      instruction: 'Welcome to the Web3 restaurant ordering experience! This tutorial will guide you through placing your first blockchain-based food order. Let\'s start by understanding what makes this different from traditional ordering.',
      duration: 4000
    },
    {
      id: 'wallet-intro',
      title: 'Wallet Connection',
      instruction: 'First, you need to connect your Web3 wallet. This is like logging into a traditional app, but instead of a username and password, you use your cryptocurrency wallet. Your wallet stores your digital money and identity.',
      highlight: '.wallet-section',
      duration: 5000
    },
    {
      id: 'wallet-connect',
      title: 'Connect Your Wallet',
      instruction: 'Click on one of the wallet options to connect. MetaMask is the most popular choice. Don\'t worry - this is completely safe and you control what permissions to grant.',
      highlight: '.wallet-buttons',
      waitForAction: true
    },
    {
      id: 'balance-explain',
      title: 'Understanding Your Balance',
      instruction: 'Great! Your wallet is now connected. You can see your USDC balance in the top right. USDC is a stable cryptocurrency that equals one US dollar. This is what you\'ll use to pay for food.',
      highlight: '.wallet-info',
      duration: 5000
    },
    {
      id: 'menu-browse',
      title: 'Browse the Menu',
      instruction: 'Now let\'s browse the menu. Each item shows the price in dollars and the MIMI token rewards you\'ll earn. MIMI tokens are loyalty points that give you discounts on future orders.',
      highlight: '.menu-section',
      duration: 4000
    },
    {
      id: 'add-items',
      title: 'Add Items to Cart',
      instruction: 'Click the plus button to add items to your cart. Try adding a few items you\'d like to order. Notice how the order total updates automatically.',
      highlight: '.menu-items',
      waitForAction: true
    },
    {
      id: 'order-summary',
      title: 'Review Order Summary',
      instruction: 'Perfect! Look at your order summary on the right. You can see the subtotal, network fee, and protocol fee. The total network fee is just 0.001 USDC - much lower than credit card fees.',
      highlight: '.order-summary',
      duration: 5000
    },
    {
      id: 'fees-explanation',
      title: 'Understanding Web3 Fees',
      instruction: 'Traditional credit cards charge restaurants 3% in fees. With Web3, you only pay a tiny network fee and 0.01% protocol fee. This saves money for both you and the restaurant!',
      duration: 5000
    },
    {
      id: 'rewards-explanation',
      title: 'MIMI Token Rewards',
      instruction: 'Notice the MIMI tokens you\'ll earn. These are loyalty tokens that automatically accumulate in your wallet. Use them for discounts, special menu items, or exclusive restaurant events.',
      highlight: '.rewards-section',
      duration: 5000
    },
    {
      id: 'place-order',
      title: 'Place Your Order',
      instruction: 'When you\'re ready, click the Place Order button. This will create a blockchain transaction that processes your payment and sends your order to the kitchen simultaneously.',
      highlight: '.place-order-button',
      waitForAction: true
    },
    {
      id: 'transaction-process',
      title: 'Transaction Processing',
      instruction: 'Your transaction is now being processed on the blockchain. This usually takes 1-3 seconds. You\'ll get a transaction hash that proves your order is recorded permanently.',
      duration: 4000
    },
    {
      id: 'confirmation',
      title: 'Order Confirmed',
      instruction: 'Congratulations! Your order is confirmed on the blockchain. The kitchen has been automatically notified, and your MIMI tokens have been credited to your wallet.',
      duration: 4000
    },
    {
      id: 'benefits-recap',
      title: 'Web3 Benefits Recap',
      instruction: 'You just experienced the future of restaurant ordering: instant settlement, lower fees, automatic rewards, and permanent transaction records. No middlemen, no hidden fees, just pure efficiency.',
      duration: 5000
    }
  ];

  // Start tutorial when overlay becomes visible
  useEffect(() => {
    if (isVisible && !isActive) {
      startTutorial(tutorialSteps);
    } else if (!isVisible && isActive) {
      stopTutorial();
    }
  }, [isVisible]);

  // Handle highlighting
  useEffect(() => {
    if (currentStep?.highlight) {
      setHighlightElement(currentStep.highlight);
      
      // Add highlight class to element
      const element = document.querySelector(currentStep.highlight);
      if (element) {
        element.classList.add('tutorial-highlight');
      }
    } else {
      // Remove all highlights
      const highlighted = document.querySelectorAll('.tutorial-highlight');
      highlighted.forEach(el => el.classList.remove('tutorial-highlight'));
      setHighlightElement(null);
    }

    return () => {
      // Cleanup highlights
      const highlighted = document.querySelectorAll('.tutorial-highlight');
      highlighted.forEach(el => el.classList.remove('tutorial-highlight'));
    };
  }, [currentStep]);

  const handleClose = () => {
    stopTutorial();
    onClose();
  };

  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Tutorial control panel */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <Card className="bg-white shadow-2xl border-[#8b795e]/20">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#8b795e] to-[#a08d6b] rounded-full flex items-center justify-center">
                  <Mic className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#8b795e]">Voice Guide Tutorial</h3>
                  <p className="text-sm text-[#8b795e]/70">Learn Web3 restaurant ordering</p>
                </div>
              </div>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="sm"
                className="text-[#8b795e]/70 hover:text-[#8b795e]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-[#8b795e]/70 mb-2">
                <span>Step {currentStepIndex + 1} of {totalSteps}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-[#8b795e]/10"
              />
            </div>

            {/* Current step */}
            {currentStep && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-[#ffe6b0] text-[#8b795e]">
                    {currentStep.title}
                  </Badge>
                  {isPlaying && (
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-4 bg-green-500 animate-pulse rounded-full"></div>
                      <div className="w-1 h-3 bg-green-400 animate-pulse rounded-full delay-100"></div>
                      <div className="w-1 h-5 bg-green-600 animate-pulse rounded-full delay-200"></div>
                    </div>
                  )}
                </div>
                <p className="text-[#8b795e] leading-relaxed">
                  {currentStep.instruction}
                </p>
                {currentStep.waitForAction && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      Complete the action above, then click Next to continue.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={previousStep}
                  disabled={currentStepIndex === 0}
                  variant="outline"
                  size="sm"
                  className="border-[#8b795e]/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={toggleMute}
                  variant="outline"
                  size="sm"
                  className="border-[#8b795e]/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={nextStep}
                  disabled={currentStepIndex === totalSteps - 1}
                  className="gradient-bg text-white"
                  size="sm"
                >
                  {currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Step navigation dots */}
            <div className="flex items-center justify-center gap-1 mt-4">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => skipToStep(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStepIndex 
                      ? 'bg-[#8b795e]' 
                      : index < currentStepIndex 
                        ? 'bg-green-500' 
                        : 'bg-[#8b795e]/20'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highlight styles */}
      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 45;
        }
        
        .tutorial-highlight::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(45deg, #8b795e, #a08d6b);
          border-radius: 12px;
          z-index: -1;
          animation: pulse-highlight 2s ease-in-out infinite;
        }
        
        @keyframes pulse-highlight {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }
      `}</style>
    </>
  );
}