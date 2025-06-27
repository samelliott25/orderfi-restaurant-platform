import { MenuManagement } from "@/components/menu-management";
import { AdminLayout } from "@/components/admin/admin-layout";

export default function AdminMenuPage() {
  return (
    <AdminLayout>
      <MenuManagement restaurantId={1} />
    </AdminLayout>
  );
}