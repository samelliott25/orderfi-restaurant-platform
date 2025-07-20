import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Leaf, Wheat } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image_url?: string;
  category: string;
  voice_aliases?: string[];
  aliases?: string[];
  modifiers?: Modifier[];
}

interface Modifier {
  id: number;
  name: string;
  price_delta: number;
  required?: boolean;
}

interface ItemCardProps {
  item: MenuItem;
  onAddClick: () => void;
  formatPrice: (price: number | string) => string;
}

export function ItemCard({ item, onAddClick, formatPrice }: ItemCardProps) {
  // Mock dietary info for demo
  const isVegetarian = item.name.toLowerCase().includes('vegan') || 
                      item.name.toLowerCase().includes('salad') ||
                      item.description.toLowerCase().includes('vegan');
  
  const isGlutenFree = item.description.toLowerCase().includes('gluten') ||
                       item.name.toLowerCase().includes('gf');

  return (
    <div className="liquid-glass-card group cursor-pointer min-h-[320px] hover:scale-105 transition-all duration-300" data-testid={`item-card-${item.id}`}>
      <div onClick={onAddClick} className="relative">
        {/* Image placeholder with liquid glass effect */}
        <div className="aspect-[4/3] bg-gradient-to-br from-orderfi-start/20 to-orderfi-end/20 flex items-center justify-center relative overflow-hidden rounded-t-2xl">
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">🍽️</div>
          )}
          
          {/* Liquid glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        {/* Enhanced quick add button overlay with liquid glass */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddClick();
            }}
            className="liquid-glass-nav-item-active px-4 py-2 rounded-xl text-sm font-medium text-white transform scale-90 group-hover:scale-100 transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-1" />
            Quick Add
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-base leading-tight line-clamp-2 text-foreground group-hover:orderfi-gradient-text transition-all duration-300">
              {item.name}
            </h3>
            <div className="ml-3 flex-shrink-0">
              <span className="font-bold text-lg orderfi-gradient-text liquid-glass-nav-item px-3 py-1 rounded-full">
                {formatPrice(item.price)}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            {isVegetarian && (
              <div className="liquid-glass-nav-item text-xs px-3 py-1 text-green-600 dark:text-green-400 rounded-full flex items-center">
                <Leaf className="h-3 w-3 mr-1" />
                Vegan
              </div>
            )}
            {isGlutenFree && (
              <div className="liquid-glass-nav-item text-xs px-3 py-1 text-blue-600 dark:text-blue-400 rounded-full flex items-center">
                <Wheat className="h-3 w-3 mr-1" />
                GF
              </div>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddClick();
            }}
            className="liquid-glass-nav-item-active h-10 w-10 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}