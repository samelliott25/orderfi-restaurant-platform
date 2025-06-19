import { useState } from "react";
import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { LiveSalesDashboard } from "@/components/admin/live-sales-dashboard";
import { OperationsAiChat } from "@/components/admin/operations-ai-chat";
import { ProcessedData } from "@/services/dataProcessor";

export default function AdminPage() {
  const [dashboardData, setDashboardData] = useState<ProcessedData | null>(null);

  const handleDataUpdate = (data: ProcessedData) => {
    setDashboardData(data);
  };
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffe6b0' }}>
      {/* Mobile Layout - Vertical Stack */}
      <div className="lg:hidden">
        <DashboardSidebar />
        {/* Operations AI Chat - Always visible on mobile at top */}
        <div className="h-80 border-b border-border overflow-hidden flex flex-col">
          <OperationsAiChat onDataUpdate={handleDataUpdate} />
        </div>
        {/* Main Dashboard Content - Below chat on mobile */}
        <div className="overflow-auto">
          <LiveSalesDashboard uploadedData={dashboardData} />
        </div>
      </div>

      {/* Desktop Layout - Horizontal Flex */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar - Fixed Height */}
        <div className="w-64 flex-shrink-0 h-full">
          <DashboardSidebar />
        </div>
        
        {/* Main Dashboard Content - Scrollable */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto">
          <LiveSalesDashboard uploadedData={dashboardData} />
        </div>
        
        {/* Operations AI Chat - Fixed Height */}
        <div className="w-80 flex-shrink-0 h-full relative z-10">
          <OperationsAiChat onDataUpdate={handleDataUpdate} />
        </div>
      </div>
    </div>
  );
}
