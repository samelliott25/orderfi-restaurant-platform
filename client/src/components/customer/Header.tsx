import { useState } from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  venueName?: string;
  tableNumber?: string;
  cartItemCount?: number;
  onSearchChange?: (query: string) => void;
  onCartClick?: () => void;
  onMenuClick?: () => void;
}

export function Header({ 
  venueName = "OrderFi Restaurant", 
  tableNumber = "Table 12", 
  cartItemCount = 0,
  onSearchChange,
  onCartClick,
  onMenuClick
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-b border-orange-200/50 dark:border-orange-700/50 shadow-lg shadow-orange-500/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Venue info */}
        <div className="flex items-center space-x-4">
          
          <div className="flex flex-col">
            <h1 className="font-semibold text-sm playwrite-font orderfi-gradient-text">
              {venueName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{tableNumber}</p>
          </div>
        </div>

        {/* Right: Search and cart */}
        <div className="flex items-center space-x-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search delicious items..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-12 w-72 h-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-400 rounded-xl text-base"
            />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onCartClick}
            className="relative p-3 h-12 w-12 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <ShoppingCart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            {cartItemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-sm kleurvorm-secondary font-bold animate-pulse"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="px-6 pb-4 sm:hidden">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search delicious items..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-12 w-full h-12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-orange-500 dark:focus:border-orange-400 rounded-xl text-base"
          />
        </div>
      </div>
    </header>
  );
}