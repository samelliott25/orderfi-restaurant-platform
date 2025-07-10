import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Hand, Zap, Target, Settings } from 'lucide-react';

interface GestureZonesProps {
  onGestureRecognized?: (gesture: GestureEvent) => void;
  onQuickAction?: (action: string) => void;
  enableHaptics?: boolean;
  sensitivity?: number;
  className?: string;
  'data-testid'?: string;
}

interface GestureEvent {
  type: 'swipe' | 'pinch' | 'tap' | 'long-press' | 'double-tap';
  direction?: 'up' | 'down' | 'left' | 'right';
  velocity?: number;
  position: { x: number; y: number };
  timestamp: number;
}

interface GestureZone {
  id: string;
  name: string;
  area: { x: number; y: number; width: number; height: number };
  color: string;
  action: string;
  icon: React.ReactNode;
  active: boolean;
}

const defaultGestureZones: GestureZone[] = [
  {
    id: 'quick-add',
    name: 'Quick Add',
    area: { x: 0, y: 0, width: 25, height: 100 },
    color: 'bg-green-500/20 border-green-500/50',
    action: 'quick-add-to-cart',
    icon: <Zap className="w-4 h-4" />,
    active: true
  },
  {
    id: 'favorites',
    name: 'Favorites',
    area: { x: 75, y: 0, width: 25, height: 100 },
    color: 'bg-yellow-500/20 border-yellow-500/50',
    action: 'add-to-favorites',
    icon: <Target className="w-4 h-4" />,
    active: true
  },
  {
    id: 'details',
    name: 'View Details',
    area: { x: 25, y: 0, width: 50, height: 30 },
    color: 'bg-blue-500/20 border-blue-500/50',
    action: 'view-details',
    icon: <Settings className="w-4 h-4" />,
    active: true
  }
];

export const GestureZones: React.FC<GestureZonesProps> = ({
  onGestureRecognized,
  onQuickAction,
  enableHaptics = true,
  sensitivity = 0.5,
  className = '',
  'data-testid': testId = 'gesture-zones'
}) => {
  const [zones, setZones] = useState<GestureZone[]>(defaultGestureZones);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [recentGestures, setRecentGestures] = useState<GestureEvent[]>([]);
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerHapticFeedback = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (!enableHaptics) return;
    
    if ('vibrate' in navigator) {
      const patterns = {
        light: [25],
        medium: [50],
        heavy: [100, 50, 100]
      };
      navigator.vibrate(patterns[intensity]);
    }
  }, [enableHaptics]);

  const addGestureEvent = useCallback((gesture: GestureEvent) => {
    setRecentGestures(prev => [gesture, ...prev.slice(0, 9)]);
    onGestureRecognized?.(gesture);
  }, [onGestureRecognized]);

  const getZoneAtPosition = useCallback((x: number, y: number): GestureZone | null => {
    if (!containerRef.current) return null;
    
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = ((x - rect.left) / rect.width) * 100;
    const relativeY = ((y - rect.top) / rect.height) * 100;
    
    return zones.find(zone => {
      const { area } = zone;
      return (
        relativeX >= area.x &&
        relativeX <= area.x + area.width &&
        relativeY >= area.y &&
        relativeY <= area.y + area.height &&
        zone.active
      );
    }) || null;
  }, [zones]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    
    const zone = getZoneAtPosition(touch.clientX, touch.clientY);
    if (zone) {
      setActiveZone(zone.id);
      triggerHapticFeedback('light');
    }
    
    // Set up long press detection
    longPressTimeoutRef.current = setTimeout(() => {
      if (touchStartRef.current) {
        const gesture: GestureEvent = {
          type: 'long-press',
          position: { x: touch.clientX, y: touch.clientY },
          timestamp: Date.now()
        };
        addGestureEvent(gesture);
        triggerHapticFeedback('heavy');
      }
    }, 500);
  }, [getZoneAtPosition, addGestureEvent, triggerHapticFeedback]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;
    
    const zone = getZoneAtPosition(touchStartRef.current.x, touchStartRef.current.y);
    
    // Detect swipe gestures
    if (distance > 50 && deltaTime < 300) {
      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
      const direction = isHorizontal 
        ? (deltaX > 0 ? 'right' : 'left')
        : (deltaY > 0 ? 'down' : 'up');
      
      const gesture: GestureEvent = {
        type: 'swipe',
        direction,
        velocity,
        position: { x: touchStartRef.current.x, y: touchStartRef.current.y },
        timestamp: Date.now()
      };
      
      addGestureEvent(gesture);
      triggerHapticFeedback('medium');
    }
    // Detect tap gestures
    else if (distance < 20 && deltaTime < 300) {
      const gesture: GestureEvent = {
        type: 'tap',
        position: { x: touchStartRef.current.x, y: touchStartRef.current.y },
        timestamp: Date.now()
      };
      
      addGestureEvent(gesture);
      
      if (zone) {
        onQuickAction?.(zone.action);
        triggerHapticFeedback('light');
      }
    }
    
    setActiveZone(null);
    touchStartRef.current = null;
  }, [getZoneAtPosition, addGestureEvent, onQuickAction, triggerHapticFeedback]);

  const handlePanEnd = useCallback((event: any, info: PanInfo) => {
    const { velocity, offset } = info;
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    
    if (speed > 500) {
      const isHorizontal = Math.abs(velocity.x) > Math.abs(velocity.y);
      const direction = isHorizontal 
        ? (velocity.x > 0 ? 'right' : 'left')
        : (velocity.y > 0 ? 'down' : 'up');
      
      const gesture: GestureEvent = {
        type: 'swipe',
        direction,
        velocity: speed,
        position: { x: offset.x, y: offset.y },
        timestamp: Date.now()
      };
      
      addGestureEvent(gesture);
      triggerHapticFeedback('medium');
    }
  }, [addGestureEvent, triggerHapticFeedback]);

  return (
    <div className={`relative ${className}`} data-testid={testId}>
      <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Hand className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Smart Gesture Zones</h3>
            </div>
            
            <div className="flex gap-2">
              <Badge 
                variant={isLearningMode ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setIsLearningMode(!isLearningMode)}
              >
                {isLearningMode ? 'Learning' : 'Static'}
              </Badge>
              
              <Badge 
                variant={debugMode ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setDebugMode(!debugMode)}
              >
                Debug
              </Badge>
            </div>
          </div>
          
          {/* Gesture Zone Visualization */}
          <motion.div
            ref={containerRef}
            className="relative h-48 bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onPanEnd={handlePanEnd}
          >
            {zones.map((zone) => (
              <motion.div
                key={zone.id}
                className={`absolute border-2 rounded-lg ${zone.color} ${
                  activeZone === zone.id ? 'border-white/50' : ''
                } transition-all duration-200`}
                style={{
                  left: `${zone.area.x}%`,
                  top: `${zone.area.y}%`,
                  width: `${zone.area.width}%`,
                  height: `${zone.area.height}%`,
                }}
                animate={{
                  scale: activeZone === zone.id ? 1.05 : 1,
                  opacity: zone.active ? 1 : 0.3
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/70">
                    {zone.icon}
                    <div className="text-xs mt-1 font-medium">{zone.name}</div>
                  </div>
                </div>
                
                {activeZone === zone.id && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-white/50"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  />
                )}
              </motion.div>
            ))}
            
            {/* Debug overlay */}
            {debugMode && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="text-white text-xs text-center">
                  <div>Zones: {zones.filter(z => z.active).length}</div>
                  <div>Sensitivity: {sensitivity}</div>
                  <div>Haptics: {enableHaptics ? 'On' : 'Off'}</div>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Recent Gestures */}
          {recentGestures.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-slate-300">Recent Gestures</h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {recentGestures.map((gesture, index) => (
                  <motion.div
                    key={gesture.timestamp}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between text-xs bg-slate-800/30 rounded px-2 py-1"
                  >
                    <span className="text-slate-300">
                      {gesture.type} {gesture.direction && `(${gesture.direction})`}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {gesture.velocity ? `${Math.round(gesture.velocity)}px/ms` : 'Static'}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          
          {/* Zone Configuration */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Zone Configuration</h4>
            <div className="grid grid-cols-2 gap-2">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    zone.active 
                      ? 'bg-slate-800/30 border-slate-600/50' 
                      : 'bg-slate-800/10 border-slate-700/30'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {zone.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-white truncate">{zone.name}</div>
                    <div className="text-xs text-slate-400">{zone.action}</div>
                  </div>
                  <button
                    className={`ml-auto w-3 h-3 rounded-full border-2 ${
                      zone.active 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-slate-500'
                    }`}
                    onClick={() => {
                      setZones(prev => prev.map(z => 
                        z.id === zone.id ? { ...z, active: !z.active } : z
                      ));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestureZones;