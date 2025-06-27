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

  // Web3 Restaurant Tutorial Steps - Mimi's Friendly Guide
  const tutorialSteps: VoiceGuideStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Web3 Ordering',
      instruction: 'Hi there! I\'m Mimi, your friendly digital waitress! Welcome to our special Web3 restaurant where you can pay with cryptocurrency. I\'m so excited to help you place your first blockchain food order - it\'s going to be amazing!',
      duration: 5000
    },
    {
      id: 'wallet-intro',
      title: 'Wallet Connection',
      instruction: 'Alright sweetie, first things first - we need to connect your crypto wallet! Think of it like your digital purse that holds your cryptocurrency instead of regular money. Don\'t worry, I\'ll walk you through everything step by step!',
      highlight: '.wallet-section',
      duration: 5000
    },
    {
      id: 'wallet-connect',
      title: 'Connect Your Wallet',
      instruction: 'Go ahead and click on one of those wallet buttons, honey! MetaMask is super popular and easy to use. It\'s completely safe - you\'re in control of everything. Just like choosing which credit card to use, but way cooler!',
      highlight: '.wallet-buttons',
      waitForAction: true
    },
    {
      id: 'balance-explain',
      title: 'Understanding Your Balance',
      instruction: 'Fantastic! Your wallet is all connected now! See that USDC balance up there? That\'s your digital dollars - each USDC equals exactly one real dollar. This is what you\'ll use to pay for your delicious meal today!',
      highlight: '.wallet-info',
      duration: 5000
    },
    {
      id: 'menu-browse',
      title: 'Browse the Menu',
      instruction: 'Now comes the fun part - let\'s look at our amazing menu! Each dish shows the price and the MIMI tokens you\'ll earn. Those MIMI tokens are like loyalty points, but better - they\'re real cryptocurrency rewards just for eating here!',
      highlight: '.menu-section',
      duration: 5000
    },
    {
      id: 'add-items',
      title: 'Add Items to Cart',
      instruction: 'Go ahead and click the plus button on anything that looks good to you! Our chef makes everything fresh and delicious. Watch how your order total updates automatically - it\'s like magic, but with math!',
      highlight: '.menu-items',
      waitForAction: true
    },
    {
      id: 'order-summary',
      title: 'Review Order Summary',
      instruction: 'Perfect choices! Look at your order summary over there - you can see exactly what you\'re getting and what it costs. That tiny network fee? It\'s just 0.001 USDC - way cheaper than those sneaky credit card fees!',
      highlight: '.order-summary',
      duration: 5000
    },
    {
      id: 'fees-explanation',
      title: 'Understanding Web3 Fees',
      instruction: 'Here\'s something cool - regular restaurants pay 3% in credit card fees, but with our Web3 system, you only pay a tiny blockchain fee and 0.01% to us. That means more money stays with you and the restaurant. Everyone wins!',
      duration: 5000
    },
    {
      id: 'rewards-explanation',
      title: 'MIMI Token Rewards',
      instruction: 'See those green MIMI tokens you\'re earning? They automatically go into your wallet and you can use them for discounts, special menu items, or exclusive events! It\'s like getting paid to eat delicious food - how awesome is that?',
      highlight: '.rewards-section',
      duration: 5000
    },
    {
      id: 'place-order',
      title: 'Place Your Order',
      instruction: 'Alright honey, when you\'re ready to submit your order, just click that "Place Order" button! This sends your payment and order to the kitchen all at once through the blockchain. It\'s like magic, but with food!',
      highlight: '.place-order-button',
      waitForAction: true
    },
    {
      id: 'transaction-process',
      title: 'Transaction Processing',
      instruction: 'Your order is zipping through the blockchain right now! This usually takes just 1 to 3 seconds. You\'ll get a special transaction number that proves your order is locked in forever - pretty cool, right?',
      duration: 4000
    },
    {
      id: 'confirmation',
      title: 'Order Confirmed',
      instruction: 'Congratulations, you did it! Your order is officially confirmed on the blockchain! The kitchen has been notified automatically, and your MIMI tokens are already in your wallet. You\'re amazing!',
      duration: 4000
    },
    {
      id: 'benefits-recap',
      title: 'Web3 Benefits Recap',
      instruction: 'You just experienced the future of dining! Instant payments, super low fees, automatic rewards, and a permanent record of your order. No middlemen taking cuts, no hidden fees - just you, great food, and cutting-edge technology. Welcome to the future, and thanks for dining with us!',
      duration: 6000
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


    </>
  );
}