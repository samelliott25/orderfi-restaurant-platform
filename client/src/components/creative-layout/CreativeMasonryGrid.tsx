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
}

export function CreativeMasonryGrid({ items, className = '' }: CreativeMasonryGridProps) {
  const getItemClasses = (item: MasonryItem) => {
    const baseClasses = 'masonry-item';
    const heightClasses = {
      short: 'h-32',
      medium: 'h-48',
      tall: 'h-64'
    };
    const colorClasses = {
      primary: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
      secondary: 'bg-gradient-to-br from-pink-500 to-pink-600 text-white',
      accent: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
      neutral: 'bg-white dark:bg-gray-800'
    };
    
    return `${baseClasses} ${heightClasses[item.height || 'medium']} ${colorClasses[item.color || 'neutral']}`;
  };

  return (
    <div className={`masonry-grid ${className}`}>
      {items.map((item) => (
        <Card key={item.id} className={getItemClasses(item)}>
          {item.image && (
            <div className="w-full h-32 bg-gray-200 rounded-t-lg mb-4 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-90">{item.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}