import { MenuManagementDashboard } from "@/components/admin/menu-management-dashboard";
import { AdminLayout } from "@/components/admin/admin-layout";

export default function AdminMenuPage() {
  return (
    <AdminLayout>
      <MenuManagementDashboard />
    </AdminLayout>
  );
}