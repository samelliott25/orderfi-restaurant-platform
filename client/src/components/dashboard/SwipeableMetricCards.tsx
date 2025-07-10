import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface SwipeableMetricCardsProps {
  metrics: MetricCard[];
  className?: string;
}

export function SwipeableMetricCards({ metrics, className = "" }: SwipeableMetricCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startScrollLeftRef = useRef<number>(0);

  // Touch/Mouse event handlers for swipe functionality
  const handleStart = (clientX: number) => {
    setIsScrolling(true);
    startXRef.current = clientX;
    startScrollLeftRef.current = scrollContainerRef.current?.scrollLeft || 0;
  };

  const handleMove = (clientX: number) => {
    if (!isScrolling || !scrollContainerRef.current) return;
    
    const deltaX = startXRef.current - clientX;
    scrollContainerRef.current.scrollLeft = startScrollLeftRef.current + deltaX;
  };

  const handleEnd = () => {
    setIsScrolling(false);
    
    if (!scrollContainerRef.current) return;
    
    // Snap to nearest card
    const cardWidth = scrollContainerRef.current.offsetWidth;
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / cardWidth);
    
    setCurrentIndex(Math.max(0, Math.min(newIndex, metrics.length - 1)));
    
    // Smooth scroll to the snapped position
    scrollContainerRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: 'smooth'
    });
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse events (for desktop testing)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScrolling) {
      e.preventDefault();
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (isScrolling) {
      handleEnd();
    }
  };

  // Navigation functions
  const goToNext = () => {
    if (currentIndex < metrics.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      
      if (scrollContainerRef.current) {
        const cardWidth = scrollContainerRef.current.offsetWidth;
        scrollContainerRef.current.scrollTo({
          left: newIndex * cardWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      
      if (scrollContainerRef.current) {
        const cardWidth = scrollContainerRef.current.offsetWidth;
        scrollContainerRef.current.scrollTo({
          left: newIndex * cardWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  const currentMetric = metrics[currentIndex];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mobile: Single Card with Swipe */}
      <div className="block md:hidden">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-hidden touch-pan-x"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${metrics.length * 100}%`
            }}
          >
            {metrics.map((metric, index) => (
              <div key={metric.id} className="w-full flex-shrink-0 px-2">
                <Card className="bg-card border-border h-32">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </div>
                      <div className={metric.color}>
                        {metric.icon}
                      </div>
                    </div>
                    <div className="text-2xl font-normal text-foreground mb-1">
                      {metric.value}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className={metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                      <span className="text-muted-foreground">vs yesterday</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {metrics.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-orange-500' 
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            disabled={currentIndex === metrics.length - 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Current Metric Description */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {currentMetric?.description}
          </p>
        </div>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="bg-card border-border hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={metric.color}>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-normal text-foreground mb-2">
                {metric.value}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className={metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="text-muted-foreground">vs yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}