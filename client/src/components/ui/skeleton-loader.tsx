import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'circular' | 'table';
  lines?: number;
  height?: string;
  width?: string;
}

export function Skeleton({ 
  className, 
  variant = 'default',
  lines = 1,
  height,
  width,
  ...props 
}: SkeletonProps) {
  const baseClass = "animate-pulse bg-muted rounded-md";
  
  switch (variant) {
    case 'card':
      return (
        <div className={cn("space-y-3", className)}>
          <div className={cn(baseClass, "h-40 w-full")} />
          <div className="space-y-2">
            <div className={cn(baseClass, "h-4 w-3/4")} />
            <div className={cn(baseClass, "h-4 w-1/2")} />
          </div>
        </div>
      );
    
    case 'text':
      return (
        <div className={cn("space-y-2", className)}>
          {Array.from({ length: lines }).map((_, i) => (
            <div 
              key={i}
              className={cn(baseClass, "h-4", i === lines - 1 ? "w-3/4" : "w-full")}
            />
          ))}
        </div>
      );
    
    case 'circular':
      return (
        <div className={cn(baseClass, "rounded-full w-10 h-10", className)} />
      );
    
    case 'table':
      return (
        <div className={cn("space-y-2", className)}>
          <div className={cn(baseClass, "h-8 w-full")} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className={cn(baseClass, "h-6 w-1/4")} />
              <div className={cn(baseClass, "h-6 w-1/4")} />
              <div className={cn(baseClass, "h-6 w-1/4")} />
              <div className={cn(baseClass, "h-6 w-1/4")} />
            </div>
          ))}
        </div>
      );
    
    default:
      return (
        <div 
          className={cn(baseClass, className)}
          style={{ height, width }}
          {...props}
        />
      );
  }
}

// Pre-built skeleton components for common use cases
export function MenuGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  );
}

export function PaymentTableSkeleton() {
  return <Skeleton variant="table" />;
}

export function DashboardCardsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton variant="circular" className="w-4 h-4" />
          </div>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}