import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { LiveSalesDashboard } from "@/components/admin/live-sales-dashboard";
import { OperationsAiChat } from "@/components/admin/operations-ai-chat";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <DashboardSidebar />
      
      <div className="lg:pl-64 pr-80 relative">
        <LiveSalesDashboard />
        <div className="fixed top-0 right-0 h-full">
          <OperationsAiChat />
        </div>
      </div>
    </div>
  );
}
