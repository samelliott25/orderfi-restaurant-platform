import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { MenuManagementDashboard } from "@/components/admin/menu-management-dashboard";

export default function AdminMenuPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 lg:pl-64">
        <main className="p-6">
          <MenuManagementDashboard />
        </main>
      </div>
    </div>
  );
}