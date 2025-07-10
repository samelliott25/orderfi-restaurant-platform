import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Navigation, 
  Hand, 
  Mic, 
  Vibrate,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface GestureEnhancedDashboardProps {
  children: React.ReactNode;
  onViewChange: (view: string) => void;
  currentView: string;
  views: string[];
}

interface GestureEvent {
  type: 'swipe' | 'voice' | 'touch';
  direction?: 'left' | 'right' | 'up' | 'down';
  command?: string;
  timestamp: number;
}

export function GestureEnhancedDashboard({ 
  children, 
  onViewChange, 
  currentView, 
  views 
}: GestureEnhancedDashboardProps) {
  const [isListening, setIsListening] = useState(false);
  const [gestureEvents, setGestureEvents] = useState<GestureEvent[]>([]);
  const [showGestureHints, setShowGestureHints] = useState(true);
  const gestureAreaRef = useRef<HTMLDivElement>(null);
  const startTouch = useRef<{ x: number; y: number } | null>(null);

  // Voice recognition setup
  const initVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(command);
      };

      return recognition;
    }
    return null;
  };

  const recognition = useRef(initVoiceRecognition());

  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    const gestureEvent: GestureEvent = {
      type: 'voice',
      command,
      timestamp: Date.now()
    };

    setGestureEvents(prev => [...prev.slice(-4), gestureEvent]);

    // Haptic feedback for voice recognition
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Process voice commands
    if (command.includes('executive') || command.includes('summary')) {
      onViewChange('executive');
    } else if (command.includes('operations') || command.includes('alerts')) {
      onViewChange('operations');
    } else if (command.includes('orders') || command.includes('kitchen')) {
      onViewChange('orders');
    } else if (command.includes('analytics') || command.includes('reports')) {
      onViewChange('analytics');
    }
  };

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startTouch.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startTouch.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startTouch.current.x;
    const deltaY = touch.clientY - startTouch.current.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      // Horizontal swipe
      const direction = deltaX > 0 ? 'right' : 'left';
      handleSwipe(direction);
    } else if (Math.abs(deltaY) > minSwipeDistance) {
      // Vertical swipe
      const direction = deltaY > 0 ? 'down' : 'up';
      handleSwipe(direction);
    }

    startTouch.current = null;
  };

  // Handle swipe gestures
  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    const gestureEvent: GestureEvent = {
      type: 'swipe',
      direction,
      timestamp: Date.now()
    };

    setGestureEvents(prev => [...prev.slice(-4), gestureEvent]);

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }

    const currentIndex = views.indexOf(currentView);
    
    if (direction === 'left' && currentIndex < views.length - 1) {
      onViewChange(views[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      onViewChange(views[currentIndex - 1]);
    }
  };

  // Start voice recognition
  const startVoiceRecognition = () => {
    if (recognition.current) {
      recognition.current.start();
    }
  };

  // Auto-hide gesture hints after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGestureHints(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  // Clear old gesture events
  useEffect(() => {
    const interval = setInterval(() => {
      setGestureEvents(prev => 
        prev.filter(event => Date.now() - event.timestamp < 5000)
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Gesture Area */}
      <div
        ref={gestureAreaRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="touch-none"
      >
        {children}
      </div>

      {/* Gesture Controls */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {/* Voice Control */}
        <Button
          variant={isListening ? "default" : "outline"}
          size="sm"
          onClick={startVoiceRecognition}
          className={`h-10 w-10 p-0 transition-all duration-200 ${
            isListening 
              ? 'bg-orange-500 text-white animate-pulse' 
              : 'bg-background/80 backdrop-blur-sm'
          }`}
        >
          <Mic className="w-4 h-4" />
        </Button>

        {/* Gesture Hints Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowGestureHints(!showGestureHints)}
          className="h-10 w-10 p-0 bg-background/80 backdrop-blur-sm"
        >
          <Hand className="w-4 h-4" />
        </Button>
      </div>

      {/* Gesture Hints */}
      {showGestureHints && (
        <Card className="fixed top-4 right-4 z-40 w-64 bg-background/95 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Gesture Navigation</span>
            </div>
            
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-3 h-3" />
                <span>Swipe right: Previous view</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3" />
                <span>Swipe left: Next view</span>
              </div>
              <div className="flex items-center gap-2">
                <Mic className="w-3 h-3" />
                <span>Voice: "Show operations"</span>
              </div>
              <div className="flex items-center gap-2">
                <Vibrate className="w-3 h-3" />
                <span>Haptic feedback enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gesture Event Indicators */}
      {gestureEvents.length > 0 && (
        <Card className="fixed top-4 left-4 z-40 bg-background/95 backdrop-blur-sm border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Hand className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Recent Gestures</span>
            </div>
            
            <div className="space-y-1">
              {gestureEvents.slice(-3).map((event, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-xs">
                    {event.type}
                  </Badge>
                  <span className="text-muted-foreground">
                    {event.direction || event.command || 'recognized'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Recognition Status */}
      {isListening && (
        <Card className="fixed bottom-20 right-4 z-40 bg-orange-500/10 border-orange-500/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-sm text-orange-700 dark:text-orange-300">
                Listening...
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}