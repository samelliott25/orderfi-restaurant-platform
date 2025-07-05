import { StandardLayout } from "@/components/StandardLayout";

export default function AdminStockPage() {
  return (
    <StandardLayout title="Stock Management" subtitle="Inventory tracking, stock levels, and supply chain management">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">Stock management features will be available in the next release.</p>
        </div>
      </div>
    </StandardLayout>
  );
}