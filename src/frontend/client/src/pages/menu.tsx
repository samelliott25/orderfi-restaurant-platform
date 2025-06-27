import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { MenuManagement } from "@/components/menu-management";
import { AdminLayout } from "@/components/admin/admin-layout";

export default function MenuPage() {
  return (
    <AdminLayout>
      {/* Mobile Layout - Vertical Stack */}
      <div className="lg:hidden">
        <DashboardSidebar />
        <MenuManagement restaurantId={1} />
      </div>

      {/* Desktop Layout - Horizontal Flex */}
      <div className="hidden lg:flex h-full">
        {/* Sidebar - Fixed Height */}
        <div className="w-64 flex-shrink-0 h-full">
          <DashboardSidebar />
        </div>
        
        {/* Main Menu Content - Scrollable */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto">
          <MenuManagement restaurantId={1} />
        </div>
      </div>
    </AdminLayout>
  );
}