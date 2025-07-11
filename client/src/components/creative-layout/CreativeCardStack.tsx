import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreativeCardStackProps {
  title: string;
  cards: Array<{
    title: string;
    content: string;
    accent?: 'primary' | 'secondary' | 'accent';
  }>;
  className?: string;
}

export function CreativeCardStack({ title, cards, className = '' }: CreativeCardStackProps) {
  return (
    <div className={`creative-card-stack ${className}`}>
      <h3 className="text-xl font-semibold mb-6 text-center text-gray-800">{title}</h3>
      <div className="space-y-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white/90 backdrop-blur-md rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-gray-600 leading-relaxed">
                {card.content}
              </p>
            </CardContent>
          </div>
        ))}
      </div>
    </div>
  );
}