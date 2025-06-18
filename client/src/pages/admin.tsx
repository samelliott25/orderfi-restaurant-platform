import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { LiveSalesDashboard } from "@/components/admin/live-sales-dashboard";
import { OperationsAiChat } from "@/components/admin/operations-ai-chat";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout - Vertical Stack */}
      <div className="lg:hidden">
        <DashboardSidebar />
        {/* Operations AI Chat - Always visible on mobile at top */}
        <div className="h-96 border-b border-border">
          <OperationsAiChat />
        </div>
        {/* Main Dashboard Content - Below chat on mobile */}
        <div className="overflow-auto">
          <LiveSalesDashboard />
        </div>
      </div>

      {/* Desktop Layout - Horizontal Flex */}
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <DashboardSidebar />
        </div>
        
        {/* Main Dashboard Content */}
        <div className="flex-1 min-w-0 overflow-auto">
          <LiveSalesDashboard />
        </div>
        
        {/* Operations AI Chat - Always visible */}
        <div className="w-80 flex-shrink-0">
          <OperationsAiChat />
        </div>
      </div>
    </div>
  );
}
