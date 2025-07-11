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
      <h3 className="neubrutalist-heading lg text-center mb-6">{title}</h3>
      <div className="neubrutalist-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`neubrutalist-item ${card.accent === 'primary' ? 'large' : card.accent === 'secondary' ? 'tall' : ''}`}
          >
            <div className="neubrutalist-heading md mb-4">
              {card.title}
            </div>
            <p className="text-black font-black text-sm uppercase tracking-wide mb-4">
              {card.content}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-black">
                CARD {index + 1}
              </span>
              <div className="neubrutalist-button secondary text-xs">
                LAYER {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}