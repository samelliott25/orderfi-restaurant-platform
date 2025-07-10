import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  description?: string;
}

interface TouchOptimizedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function TouchOptimizedTabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = "" 
}: TouchOptimizedTabsProps) {
  const [pressedTab, setPressedTab] = useState<string | null>(null);

  const handleTabPress = (tabId: string) => {
    setPressedTab(tabId);
    onTabChange(tabId);
    
    // Haptic feedback simulation for touch devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    // Clear pressed state after animation
    setTimeout(() => setPressedTab(null), 150);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Mobile: Vertical Stack */}
      <div className="block sm:hidden space-y-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          const isPressed = pressedTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-lg transition-all duration-200",
                "min-h-[44px] touch-manipulation", // Ensure 44px minimum touch target
                "transform active:scale-95", // Press animation
                isActive
                  ? "bg-orange-500/20 border-2 border-orange-500 text-orange-500"
                  : "bg-card border-2 border-border text-muted-foreground hover:text-foreground hover:bg-secondary",
                isPressed && "scale-95"
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm">{tab.label}</div>
                  {tab.description && (
                    <div className="text-xs opacity-70 mt-1">{tab.description}</div>
                  )}
                </div>
              </div>
              {tab.badge && tab.badge > 0 && (
                <Badge variant="secondary" className="ml-2 bg-orange-500 text-white">
                  {tab.badge > 99 ? '99+' : tab.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop: Horizontal Tabs */}
      <div className="hidden sm:block">
        <div className="border-b border-border">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              const isPressed = pressedTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabPress(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap",
                    "border-b-2 transition-all duration-200 relative",
                    "min-h-[44px] min-w-[120px] touch-manipulation", // Touch optimization
                    "transform active:scale-95", // Press animation
                    isActive
                      ? "border-orange-500 text-orange-500 bg-orange-500/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                    isPressed && "scale-95"
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                  {tab.badge && tab.badge > 0 && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "ml-2 text-xs",
                        isActive ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Touch Gesture Hints for Mobile */}
      <div className="block sm:hidden text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Tap to switch views • Long press for descriptions
        </p>
      </div>
    </div>
  );
}