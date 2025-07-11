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
      <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">{title}</h3>
      <div className="card-stack relative h-96 max-w-lg mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="absolute w-full p-6 cursor-pointer rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 border-0"
            style={{
              background: card.accent === 'primary' 
                ? 'linear-gradient(135deg, #f97316, #ea580c)'
                : card.accent === 'secondary'
                ? 'linear-gradient(135deg, #ec4899, #db2777)'
                : card.accent === 'accent'
                ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                : 'linear-gradient(135deg, #ffffff, #f8fafc)',
              transform: `translateY(${index * 12}px) translateX(${index * 8}px) rotate(${index * 1.5}deg)`,
              zIndex: cards.length - index,
              top: `${index * 16}px`,
              left: `${index * 8}px`
            }}
          >
            <CardHeader className="p-0 pb-4">
              <CardTitle className={`text-xl font-bold ${card.accent ? 'text-white' : 'text-gray-900'}`}>
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className={`text-sm leading-relaxed ${card.accent ? 'text-white/90' : 'text-gray-600'}`}>
                {card.content}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`text-xs ${card.accent ? 'text-white/75' : 'text-gray-400'}`}>
                  Card {index + 1}
                </span>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${card.accent ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  Layer {index + 1}
                </div>
              </div>
            </CardContent>
          </div>
        ))}
      </div>
    </div>
  );
}