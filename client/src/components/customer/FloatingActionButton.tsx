import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ShoppingCart, 
  Heart, 
  Star, 
  Gift,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onCartClick: () => void;
  onFavoritesClick?: () => void;
  onRewardClick?: () => void;
  cartItemCount?: number;
}

export function FloatingActionButton({ 
  onCartClick, 
  onFavoritesClick, 
  onRewardClick,
  cartItemCount = 0 
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative">
        {/* Sub-actions */}
        <div className={cn(
          "absolute bottom-16 right-0 flex flex-col space-y-3 transition-all duration-300",
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}>
          {/* Cart Button */}
          <Button
            onClick={onCartClick}
            className="h-12 w-12 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 border border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative"
          >
            <ShoppingCart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            {cartItemCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                {cartItemCount}
              </div>
            )}
          </Button>

          {/* Favorites Button */}
          <Button
            onClick={onFavoritesClick}
            className="h-12 w-12 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 border border-pink-200 dark:border-pink-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
          </Button>

          {/* Rewards Button */}
          <Button
            onClick={onRewardClick}
            className="h-12 w-12 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 border border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </Button>
        </div>

        {/* Main FAB */}
        <Button
          onClick={toggleExpanded}
          className={cn(
            "h-16 w-16 rounded-full shadow-2xl transition-all duration-500 hover:scale-110",
            isExpanded
              ? "bg-red-500 hover:bg-red-600 shadow-red-500/30 rotate-45"
              : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-orange-500/30"
          )}
        >
          {isExpanded ? (
            <X className="h-7 w-7 text-white" />
          ) : (
            <Plus className="h-7 w-7 text-white" />
          )}
        </Button>

        {/* Ripple effect */}
        {isExpanded && (
          <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping"></div>
        )}
      </div>
    </div>
  );
}