/**
 * OrderFi Design System - Consistent UI Components
 * Ensures brand consistency across all pages
 */

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';

// OrderFi Brand Colors
export const OrderFiColors = {
  primary: 'hsl(25, 95%, 53%)', // Orange
  secondary: 'hsl(340, 82%, 52%)', // Pink
  accent: 'hsl(215, 28%, 17%)', // Slate Blue
  success: 'hsl(142, 76%, 36%)', // Green
  warning: 'hsl(48, 96%, 53%)', // Yellow
  error: 'hsl(0, 84%, 60%)', // Red
  muted: 'hsl(210, 40%, 98%)', // Light gray
  gradient: 'linear-gradient(135deg, hsl(25, 95%, 53%) 0%, hsl(340, 82%, 52%) 100%)'
};

// Typography Components
export const OrderFiHeading = ({ 
  level = 1, 
  children, 
  className = '' 
}: {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}) => {
  const baseClasses = 'orderfi-heading bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent';
  
  const sizeClasses = {
    1: 'text-2xl',
    2: 'text-xl',
    3: 'text-lg',
    4: 'text-base'
  };

  const combinedClasses = cn(baseClasses, sizeClasses[level], className);

  if (level === 1) {
    return <h1 className={combinedClasses}>{children}</h1>;
  } else if (level === 2) {
    return <h2 className={combinedClasses}>{children}</h2>;
  } else if (level === 3) {
    return <h3 className={combinedClasses}>{children}</h3>;
  } else {
    return <h4 className={combinedClasses}>{children}</h4>;
  }
};

export const OrderFiSubtitle = ({ 
  children, 
  className = '' 
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={cn('text-xs sm:text-sm text-muted-foreground mt-2', className)}>
    {children}
  </p>
);

// Branded Components
export const OrderFiCard = ({ 
  title, 
  subtitle, 
  children, 
  className = '',
  headerClassName = ''
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}) => (
  <Card className={cn('border-2 border-border/50 shadow-sm', className)}>
    {title && (
      <CardHeader className={cn('pb-3', headerClassName)}>
        <CardTitle className="font-semibold text-lg playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          {title}
        </CardTitle>
        {subtitle && (
          <OrderFiSubtitle className="mt-1">{subtitle}</OrderFiSubtitle>
        )}
      </CardHeader>
    )}
    <CardContent className={title ? 'pt-0' : undefined}>
      {children}
    </CardContent>
  </Card>
);

export const OrderFiButton = ({ 
  variant = 'default',
  size = 'default',
  gradient = false,
  children,
  className = '',
  ...props
}: {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  gradient?: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  const gradientClasses = gradient 
    ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-none'
    : '';

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(gradientClasses, className)}
      {...props}
    >
      {children}
    </Button>
  );
};

export const OrderFiBadge = ({ 
  variant = 'default',
  status,
  children,
  className = ''
}: {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  status?: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
}) => {
  const statusClasses = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <Badge 
      variant={variant}
      className={cn(
        status ? statusClasses[status] : '',
        className
      )}
    >
      {children}
    </Badge>
  );
};

// Layout Components
export const OrderFiPageHeader = ({ 
  title, 
  subtitle, 
  actions,
  className = ''
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('mb-6 px-4 sm:px-6 pt-4 sm:pt-6', className)}>
    <BreadcrumbNav />
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <OrderFiHeading level={1}>{title}</OrderFiHeading>
        {subtitle && <OrderFiSubtitle>{subtitle}</OrderFiSubtitle>}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  </div>
);

export const OrderFiMetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  variant = 'default'
}: {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'revenue' | 'orders' | 'customers';
}) => {
  const variantClasses = {
    default: 'border-l-4 border-l-gray-300',
    revenue: 'border-l-4 border-l-orange-500',
    orders: 'border-l-4 border-l-blue-500',
    customers: 'border-l-4 border-l-pink-500'
  };

  return (
    <OrderFiCard className={cn('p-4', variantClasses[variant])}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-xl font-bold mt-1">{value}</p>
          {change && (
            <OrderFiBadge 
              status={change.startsWith('+') ? 'success' : 'error'}
              className="mt-1"
            >
              {change}
            </OrderFiBadge>
          )}
        </div>
        {Icon && (
          <Icon className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
    </OrderFiCard>
  );
};

// Standard spacing and sizing
export const OrderFiSpacing = {
  page: 'px-4 sm:px-6 pb-4 sm:pb-6',
  section: 'space-y-6',
  cardPadding: 'p-4 sm:p-6',
  buttonSize: 'h-10 px-4',
  iconSize: 'h-5 w-5'
};