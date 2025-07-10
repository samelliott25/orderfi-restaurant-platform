import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Utensils, 
  Coffee, 
  Wine, 
  Sandwich, 
  IceCream, 
  Pizza,
  Salad,
  Soup,
  Leaf
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count?: number;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const defaultCategories: Category[] = [
  { id: 'all', name: 'All', icon: Utensils, count: 48 },
  { id: 'bar snacks', name: 'Bar Snacks', icon: Soup, count: 8 },
  { id: 'buffalo wings', name: 'Buffalo Wings', icon: Pizza, count: 12 },
  { id: 'burgers', name: 'Burgers', icon: Sandwich, count: 6 },
  { id: 'tacos', name: 'Tacos', icon: Salad, count: 4 },
  { id: 'plant powered', name: 'Plant Powered', icon: Leaf, count: 4 },
  { id: 'dawgs', name: 'Dawgs', icon: Coffee, count: 10 },
  { id: 'from our grill', name: 'From Our Grill', icon: IceCream, count: 6 }
];

export function CategoryTabs({ 
  categories = defaultCategories, 
  activeCategory = 'all',
  onCategoryChange 
}: CategoryTabsProps) {
  return (
    <div className="border-b border-orange-200/50 dark:border-orange-700/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-gray-900/50">
      <ScrollArea className="w-full" orientation="horizontal">
        <div className="flex space-x-2 p-4 w-max">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "flex-shrink-0 flex items-center space-x-3 px-6 py-3 rounded-2xl min-w-fit transition-all duration-300 hover:scale-105 hover:shadow-lg",
                  isActive 
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg shadow-orange-500/25" 
                    : "bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
                )}
              >
                <IconComponent className={cn("h-5 w-5", isActive ? "text-white" : "text-orange-600 dark:text-orange-400")} />
                <span className={cn("font-semibold text-sm", isActive ? "text-white" : "text-gray-700 dark:text-gray-300")}>{category.name}</span>
                {category.count && (
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full font-bold",
                    isActive 
                      ? "bg-white/25 text-white" 
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                  )}>
                    {category.count}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}