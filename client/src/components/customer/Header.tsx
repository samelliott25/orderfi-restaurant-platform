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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Venue info */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <h1 className="font-semibold text-lg playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              {venueName}
            </h1>
            <p className="text-sm text-muted-foreground">{tableNumber}</p>
          </div>
        </div>

        {/* Right: Search and cart */}
        <div className="flex items-center space-x-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 w-64"
            />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onCartClick}
            className="relative p-2 h-10 w-10"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="px-4 pb-3 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 w-full"
          />
        </div>
      </div>
    </header>
  );
}