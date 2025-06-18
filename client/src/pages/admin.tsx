import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { LiveSalesDashboard } from "@/components/admin/live-sales-dashboard";
import { OperationsAiChat } from "@/components/admin/operations-ai-chat";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-[#f5f1e8]">
      <DashboardSidebar />
      
      <div className="flex flex-1 lg:pl-64">
        <div className="flex-1">
          <LiveSalesDashboard />
        </div>
        <OperationsAiChat />
      </div>
    </div>
  );
}
