import { AdminLayout } from "@/components/admin/admin-layout";

export default function AdminIntegrationsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#8b795e' }}>Integrations</h1>
          <p className="text-sm" style={{ color: '#8b795e' }}>APIs, webhooks, and third-party synchronization</p>
        </div>
        
        <div className="bg-white rounded-lg border p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">Integration features will be available in the next release.</p>
        </div>
      </div>
    </AdminLayout>
  );
}