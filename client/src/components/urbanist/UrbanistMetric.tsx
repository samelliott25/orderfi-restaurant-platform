import React from 'react';
import { UrbanistCard, UrbanistCardContent, UrbanistCardHeader, UrbanistCardTitle } from './UrbanistCard';
import { cn } from '@/lib/utils';

interface UrbanistMetricProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'green' | 'yellow' | 'dark';
  className?: string;
}

export function UrbanistMetric({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon,
  variant = 'default',
  className 
}: UrbanistMetricProps) {
  return (
    <UrbanistCard variant={variant} className={cn("relative", className)}>
      <UrbanistCardHeader>
        <div className="flex items-center justify-between">
          <UrbanistCardTitle className="text-sm font-medium">
            {title}
          </UrbanistCardTitle>
          {icon && (
            <div className="h-4 w-4 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </UrbanistCardHeader>
      <UrbanistCardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
        {subtitle && (
          <p className="urbanist-small text-muted-foreground mb-2">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="flex items-center">
            <span className={cn(
              "urbanist-small font-medium",
              trend.isPositive ? "text-urbanist-green" : "text-red-500"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}
            </span>
          </div>
        )}
      </UrbanistCardContent>
    </UrbanistCard>
  );
}