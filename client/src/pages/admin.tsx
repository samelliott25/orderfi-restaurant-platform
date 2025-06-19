import { useState } from "react";
import { LiveSalesDashboard } from "@/components/admin/live-sales-dashboard";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ProcessedData } from "@/services/dataProcessor";

export default function AdminPage() {
  const [dashboardData, setDashboardData] = useState<ProcessedData | null>(null);

  return (
    <AdminLayout>
      <LiveSalesDashboard uploadedData={dashboardData} />
    </AdminLayout>
  );
}
