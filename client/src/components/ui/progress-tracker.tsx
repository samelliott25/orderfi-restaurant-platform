import { Check, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function ProgressTracker({ 
  steps, 
  currentStep, 
  className,
  orientation = 'horizontal'
}: ProgressTrackerProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const getStepStatus = (index: number): 'completed' | 'current' | 'upcoming' => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (status: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-white" />;
      case 'current':
        return <Clock className="h-4 w-4 text-white" />;
      case 'upcoming':
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStepStyles = (status: 'completed' | 'current' | 'upcoming') => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500 text-white';
      case 'current':
        return 'bg-gradient-to-r from-orange-500 to-pink-500 border-orange-500 text-white animate-pulse';
      case 'upcoming':
        return 'bg-background border-muted-foreground text-muted-foreground';
    }
  };

  if (orientation === 'vertical') {
    return (
      <div className={cn("space-y-4", className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="relative">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  getStepStyles(status)
                )}>
                  {getStepIcon(status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "text-sm font-medium",
                    status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'
                  )}>
                    {step.title}
                  </h4>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              {!isLast && (
                <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                getStepStyles(status)
              )}>
                {getStepIcon(status)}
              </div>
              <div className="text-center mt-2">
                <h4 className={cn(
                  "text-xs font-medium",
                  status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'
                )}>
                  {step.title}
                </h4>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            {!isLast && (
              <div className={cn(
                "flex-1 h-px mx-4 transition-colors duration-200",
                index < currentStepIndex ? 'bg-green-500' : 'bg-border'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}