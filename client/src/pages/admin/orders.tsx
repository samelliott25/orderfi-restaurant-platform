import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";
import { AdminLayout } from "@/components/admin/admin-layout";

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <DashboardSidebar />
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Orders Management</h1>
              <p className="text-muted-foreground">View active orders, history, and kitchen routing</p>
            </div>
            
            <div className="bg-white rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">Order management features will be available in the next release.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        <div className="w-64 flex-shrink-0 h-full">
          <DashboardSidebar />
        </div>
        
        <div className="flex-1 min-w-0 h-full overflow-y-auto">
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Orders Management</h1>
                <p className="text-muted-foreground">View active orders, history, and kitchen routing</p>
              </div>
              
              <div className="bg-white rounded-lg border p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">Order management features will be available in the next release.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}