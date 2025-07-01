import { MenuManagement } from "@/components/menu-management";
import { StandardLayout } from "@/components/StandardLayout";

export default function AdminInventoryPage() {
  return (
    <StandardLayout title="Inventory Management" subtitle="Manage menu items and pricing">
      <MenuManagement restaurantId={1} />
    </StandardLayout>
  );
}