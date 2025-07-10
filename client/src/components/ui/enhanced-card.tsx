import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EnhancedCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  value?: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down';
    color?: 'green' | 'red' | 'orange';
  };
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
  }[];
  badges?: {
    label: string;
    variant?: 'default' | 'secondary' | 'outline';
  }[];
  className?: string;
  children?: React.ReactNode;
  hover?: boolean;
  gradient?: boolean;
}

export function EnhancedCard({
  title,
  description,
  icon: Icon,
  value,
  trend,
  actions,
  badges,
  className,
  children,
  hover = true,
  gradient = false
}: EnhancedCardProps) {
  return (
    <Card className={cn(
      "transition-all duration-200",
      hover && "hover:shadow-lg hover:shadow-orange-500/5",
      gradient && "bg-gradient-to-br from-background to-muted/20",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs">
              {description}
            </CardDescription>
          )}
        </div>
        {badges && badges.length > 0 && (
          <div className="flex gap-1">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant || 'default'}>
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {value && (
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <div className={cn(
                "flex items-center text-xs",
                trend.color === 'green' && "text-green-500",
                trend.color === 'red' && "text-red-500",
                trend.color === 'orange' && "text-orange-500",
                !trend.color && "text-muted-foreground"
              )}>
                <span className="mr-1">
                  {trend.direction === 'up' ? '↗' : '↘'}
                </span>
                {trend.value}
              </div>
            )}
          </div>
        )}
        
        {children}
        
        {actions && actions.length > 0 && (
          <div className="flex gap-2 mt-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant={action.variant || 'default'}
                onClick={action.onClick}
                className="flex-1"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Pre-built enhanced card variants
export function MetricCard({
  title,
  value,
  trend,
  icon,
  className
}: {
  title: string;
  value: string | number;
  trend?: EnhancedCardProps['trend'];
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <EnhancedCard
      title={title}
      value={value}
      trend={trend}
      icon={icon}
      className={className}
      gradient
    />
  );
}

export function ActionCard({
  title,
  description,
  actions,
  icon,
  className
}: {
  title: string;
  description?: string;
  actions: EnhancedCardProps['actions'];
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <EnhancedCard
      title={title}
      description={description}
      actions={actions}
      icon={icon}
      className={className}
    />
  );
}