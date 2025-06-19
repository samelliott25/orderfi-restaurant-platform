import { useState, useRef, useEffect } from "react";
import { OperationsAiChat } from "@/components/admin/operations-ai-chat";
import { ProcessedData } from "@/services/dataProcessor";
import { useLocation } from "wouter";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [dashboardData, setDashboardData] = useState<ProcessedData | null>(null);
  const [location] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousLocationRef = useRef<string | null>(null);

  const handleDataUpdate = (data: ProcessedData) => {
    setDashboardData(data);
  };

  // Store scroll positions for each admin page
  const scrollPositions = useRef<{ [key: string]: number }>({});

  // Save scroll position when leaving a page
  useEffect(() => {
    const saveScrollPosition = () => {
      if (scrollContainerRef.current && previousLocationRef.current) {
        scrollPositions.current[previousLocationRef.current] = scrollContainerRef.current.scrollTop;
      }
    };

    // Save current scroll position before navigation
    if (previousLocationRef.current && previousLocationRef.current !== location) {
      saveScrollPosition();
    }

    // Restore scroll position for current page
    if (scrollContainerRef.current && location.startsWith('/admin')) {
      const savedPosition = scrollPositions.current[location] || 0;
      
      // Use setTimeout to ensure DOM is updated after navigation
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = savedPosition;
        }
      }, 0);
    }

    previousLocationRef.current = location;
  }, [location]);

  // Add scroll event listener to continuously save position
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current && location.startsWith('/admin')) {
        scrollPositions.current[location] = scrollContainerRef.current.scrollTop;
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [location]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffe6b0' }}>
      {/* Mobile Layout - Vertical Stack */}
      <div className="lg:hidden">
        {/* Operations AI Chat - Always visible on mobile at top */}
        <div className="h-80 border-b border-border overflow-hidden flex flex-col">
          <OperationsAiChat onDataUpdate={handleDataUpdate} />
        </div>
        {/* Main Content - Below chat on mobile */}
        <div className="overflow-auto">
          {children}
        </div>
      </div>

      {/* Desktop Layout - Horizontal Flex */}
      <div className="hidden lg:flex h-screen">
        {/* Main Content - Scrollable */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 min-w-0 h-full overflow-y-auto"
          style={{ scrollBehavior: 'auto' }}
        >
          {children}
        </div>
        
        {/* Operations AI Chat - Fixed Height, Always Visible */}
        <div className="w-80 flex-shrink-0 h-full relative z-10">
          <OperationsAiChat onDataUpdate={handleDataUpdate} />
        </div>
      </div>
    </div>
  );
}