import { AdminLayout } from "@/components/admin/admin-layout";

export default function AdminOrdersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#654321' }}>
            Orders Management
          </h1>
          <p className="text-sm" style={{ color: '#8b795e' }}>
            View active orders, history, and kitchen routing
          </p>
        </div>
        
        <div className="rounded-lg border p-8 text-center" style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
          <h3 className="text-lg font-medium mb-2" style={{ color: '#654321' }}>
            Coming Soon
          </h3>
          <p className="text-sm" style={{ color: '#8b795e' }}>
            Order management features will be available in the next release.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}