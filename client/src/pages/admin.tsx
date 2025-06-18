import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { LiveSalesDashboard } from "@/components/admin/live-sales-dashboard";
import { OperationsAiChat } from "@/components/admin/operations-ai-chat";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar - Hidden on mobile, shown as overlay */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <DashboardSidebar />
        </div>
        
        {/* Main Dashboard Content - Full width on mobile, constrained on desktop */}
        <div className="flex-1 min-w-0 overflow-auto">
          <div className="lg:hidden">
            <DashboardSidebar />
          </div>
          <LiveSalesDashboard />
        </div>
        
        {/* Operations AI Chat - Hidden only on mobile */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <OperationsAiChat />
        </div>
      </div>
    </div>
  );
}
