import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { MenuManagementDashboard } from "@/components/admin/menu-management-dashboard";
import { AdminLayout } from "@/components/admin/admin-layout";

export default function AdminMenuPage() {
  return (
    <AdminLayout>
      {/* Mobile Layout - Vertical Stack */}
      <div className="lg:hidden">
        <DashboardSidebar />
        <div className="p-6">
          <MenuManagementDashboard />
        </div>
      </div>

      {/* Desktop Layout - Horizontal Flex */}
      <div className="hidden lg:flex h-full">
        {/* Sidebar - Fixed Height */}
        <div className="w-64 flex-shrink-0 h-full">
          <DashboardSidebar />
        </div>
        
        {/* Main Menu Content - Scrollable */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto">
          <div className="p-6">
            <MenuManagementDashboard />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}