import { DashboardSidebar } from "@/components/admin/dashboard-sidebar";

export default function AdminSettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 lg:pl-64">
        <main className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings & Configuration</h1>
              <p className="text-muted-foreground">Restaurant settings, hours, branding, and system configuration</p>
            </div>
            
            <div className="bg-white rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">Settings management features will be available in the next release.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}