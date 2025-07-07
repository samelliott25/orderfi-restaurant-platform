import { AdminLayout } from "@/components/admin/admin-layout";

export default function AdminSecurityPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl carter-one-font" style={{ color: '#8b795e' }}>Security & Audit</h1>
          <p className="text-sm" style={{ color: '#8b795e' }}>Security logs, access control, sessions, and audit trails</p>
        </div>
        
        <div className="bg-white rounded-lg border p-8 text-center">
          <h3 className="text-lg carter-one-font mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">Security and audit features will be available in the next release.</p>
        </div>
      </div>
    </AdminLayout>
  );
}