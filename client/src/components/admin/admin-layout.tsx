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

  // Handle scroll position preservation
  useEffect(() => {
    if (!location.startsWith('/admin')) return;

    // Save scroll position when leaving a page
    if (previousLocationRef.current && previousLocationRef.current !== location) {
      if (scrollContainerRef.current) {
        scrollPositions.current[previousLocationRef.current] = scrollContainerRef.current.scrollTop;
      }
    }

    // Restore scroll position after navigation
    const restoreScroll = () => {
      if (scrollContainerRef.current) {
        const savedPosition = scrollPositions.current[location] || 0;
        scrollContainerRef.current.scrollTop = savedPosition;
      }
    };

    // Use multiple attempts to ensure scroll restoration works
    const timeouts = [
      setTimeout(restoreScroll, 0),
      setTimeout(restoreScroll, 10),
      setTimeout(restoreScroll, 100)
    ];

    previousLocationRef.current = location;

    return () => {
      timeouts.forEach(clearTimeout);
    };
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
          className="flex-1 min-w-0 h-full overflow-y-auto admin-scroll-container"
          onScroll={(e) => {
            if (location.startsWith('/admin')) {
              scrollPositions.current[location] = e.currentTarget.scrollTop;
            }
          }}
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