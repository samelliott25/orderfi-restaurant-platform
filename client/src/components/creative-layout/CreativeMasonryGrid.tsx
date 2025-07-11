import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MasonryItem {
  id: number;
  title: string;
  content: string;
  image?: string;
  height?: 'short' | 'medium' | 'tall';
  color?: 'primary' | 'secondary' | 'accent' | 'neutral';
}

interface CreativeMasonryGridProps {
  items: MasonryItem[];
  className?: string;
  onItemClick?: (item: MasonryItem) => void;
}

export function CreativeMasonryGrid({ items, className = '', onItemClick }: CreativeMasonryGridProps) {
  const getItemClasses = (item: MasonryItem) => {
    const heightClasses = {
      short: 'h-48',
      medium: 'h-64',
      tall: 'h-80'
    };
    const colorClasses = {
      primary: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg hover:shadow-xl',
      accent: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl',
      neutral: 'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border-2 border-gray-200'
    };
    
    return `${heightClasses[item.height || 'medium']} ${colorClasses[item.color || 'neutral']} transform hover:scale-105 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden`;
  };

  return (
    <div className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 ${className}`}>
      {items.map((item) => (
        <Card 
          key={item.id} 
          className={getItemClasses(item)}
          onClick={() => onItemClick?.(item)}
        >
          {item.image && (
            <div className="w-full h-32 bg-gray-200 mb-4 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90">{item.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}