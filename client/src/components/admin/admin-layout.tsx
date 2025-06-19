import { useState } from "react";
import { OperationsAiChat } from "@/components/admin/operations-ai-chat";
import { ProcessedData } from "@/services/dataProcessor";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [dashboardData, setDashboardData] = useState<ProcessedData | null>(null);

  const handleDataUpdate = (data: ProcessedData) => {
    setDashboardData(data);
  };

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
        <div className="flex-1 min-w-0 h-full overflow-y-auto">
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