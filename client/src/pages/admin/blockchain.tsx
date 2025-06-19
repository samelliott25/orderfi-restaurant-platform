import { AdminLayout } from "@/components/admin/admin-layout";
import { BlockchainDashboard } from "@/components/admin/blockchain-dashboard";

export default function AdminBlockchainPage() {
  return (
    <AdminLayout>
      <BlockchainDashboard restaurantId={1} />
    </AdminLayout>
  );
}