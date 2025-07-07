import { AdminLayout } from "@/components/admin/admin-layout";

export default function AdminMarketingPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl rock-salt-font" style={{ color: '#8b795e' }}>Marketing & Loyalty</h1>
          <p className="text-sm" style={{ color: '#8b795e' }}>Promotions, campaigns, QR codes, and customer loyalty programs</p>
        </div>
        
        <div className="bg-white rounded-lg border p-8 text-center">
          <h3 className="text-lg rock-salt-font mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">Marketing and loyalty features will be available in the next release.</p>
        </div>
      </div>
    </AdminLayout>
  );
}