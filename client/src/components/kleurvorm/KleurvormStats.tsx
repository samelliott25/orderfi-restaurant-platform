import React from 'react';
import { cn } from '@/lib/utils';

interface KleurvormStatsProps {
  stats: Array<{
    label: string;
    value: string;
    color: string;
  }>;
  className?: string;
}

export function KleurvormStats({ stats, className }: KleurvormStatsProps) {
  return (
    <div className={cn('grid grid-cols-3 gap-4', className)}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div 
            className="text-lg font-bold mb-1"
            style={{ color: stat.color }}
          >
            {stat.value}
          </div>
          <div className="kleurvorm-small text-center">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}