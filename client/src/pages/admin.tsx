import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { LiveSalesDashboard } from "@/components/admin/live-sales-dashboard";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 lg:pl-64">
        <main className="p-6">
          <LiveSalesDashboard />
        </main>
      </div>
    </div>
  );
}
