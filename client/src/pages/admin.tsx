import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { LiveSalesDashboard } from "@/components/admin/live-sales-dashboard";
import { OperationsAiChat } from "@/components/admin/operations-ai-chat";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <div className="flex">
        {/* Sidebar - Fixed width */}
        <div className="w-64 flex-shrink-0">
          <DashboardSidebar />
        </div>
        
        {/* Main Dashboard Content - Takes remaining space */}
        <div className="flex-1 min-w-0 overflow-auto">
          <LiveSalesDashboard />
        </div>
        
        {/* Operations AI Chat - Fixed width */}
        <div className="w-80 flex-shrink-0">
          <OperationsAiChat />
        </div>
      </div>
    </div>
  );
}
