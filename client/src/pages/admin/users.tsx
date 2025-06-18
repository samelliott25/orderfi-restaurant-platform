import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";

export default function AdminUsersPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 lg:pl-64">
        <main className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">User & Staff Management</h1>
              <p className="text-muted-foreground">Manage restaurant staff, roles, and permissions</p>
            </div>
            
            <div className="bg-white rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">Staff management features will be available in the next release.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}