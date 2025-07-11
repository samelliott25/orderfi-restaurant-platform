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
      <h3 className="text-2xl font-bold mb-6 text-center">{title}</h3>
      <div className="card-stack relative h-80 max-w-md mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="card-stack-item p-6 cursor-pointer"
            style={{
              background: card.accent === 'primary' 
                ? 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))'
                : card.accent === 'secondary'
                ? 'linear-gradient(135deg, var(--color-secondary-500), var(--color-secondary-600))'
                : 'var(--color-bg-primary)'
            }}
          >
            <CardHeader className="p-0 pb-4">
              <CardTitle className={`text-lg ${card.accent ? 'text-white' : 'text-gray-900'}`}>
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className={`text-sm ${card.accent ? 'text-white/90' : 'text-gray-600'}`}>
                {card.content}
              </p>
            </CardContent>
          </div>
        ))}
      </div>
    </div>
  );
}