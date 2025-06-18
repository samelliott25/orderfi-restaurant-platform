import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { LiveSalesDashboard } from "@/components/admin/live-sales-dashboard";
import { OperationsAiChat } from "@/components/admin/operations-ai-chat";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-[#f5f1e8]">
      <DashboardSidebar />
      
      {/* Main Content Area - takes remaining space */}
      <div className="flex-1 lg:pl-64">
        <div className="flex h-screen">
          <div className="flex-1 overflow-auto">
            <LiveSalesDashboard />
          </div>
          <div className="w-80 flex-shrink-0">
            <OperationsAiChat />
          </div>
        </div>
      </div>
    </div>
  );
}
