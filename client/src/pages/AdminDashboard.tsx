import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { Plus, Store, TrendingUp, Users, DollarSign } from 'lucide-react';

interface RestaurantWithStats {
  id: number;
  name: string;
  slug: string;
  cuisine: string;
  isActive: boolean;
  contactEmail: string;
  createdAt: string;
  analytics: {
    totalOrders: number;
    totalRevenue: string;
    averageOrderValue: string;
    ordersToday: number;
  };
}

export default function AdminDashboard() {
  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['/api/admin/restaurants'],
    queryFn: async () => {
      const response = await fetch('/api/admin/restaurants');
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      return response.json() as RestaurantWithStats[];
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  const totalRestaurants = restaurants?.length || 0;
  const activeRestaurants = restaurants?.filter(r => r.isActive).length || 0;
  const totalRevenue = restaurants?.reduce((sum, r) => sum + parseFloat(r.analytics.totalRevenue), 0) || 0;
  const totalOrders = restaurants?.reduce((sum, r) => sum + r.analytics.totalOrders, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mimi Waitress Admin</h1>
              <p className="text-gray-600">Manage restaurants and platform analytics</p>
            </div>
            <Link href="/onboard">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Restaurant
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Restaurants</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRestaurants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Restaurants</p>
                  <p className="text-2xl font-bold text-gray-900">{activeRestaurants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Restaurants List */}
        <Card>
          <CardHeader>
            <CardTitle>All Restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            {restaurants?.length === 0 ? (
              <div className="text-center py-12">
                <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants yet</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first restaurant to the platform.</p>
                <Link href="/onboard">
                  <Button>Add Restaurant</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {restaurants?.map((restaurant) => (
                  <div key={restaurant.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {restaurant.name}
                          </h3>
                          <Badge variant={restaurant.isActive ? "default" : "secondary"}>
                            {restaurant.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {restaurant.cuisine && (
                            <Badge variant="outline">{restaurant.cuisine}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Slug: /{restaurant.slug} • Contact: {restaurant.contactEmail}
                        </p>
                        <p className="text-xs text-gray-500">
                          Added: {new Date(restaurant.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{restaurant.analytics.ordersToday}</p>
                          <p className="text-gray-600">Today</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{restaurant.analytics.totalOrders}</p>
                          <p className="text-gray-600">Total Orders</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">${restaurant.analytics.totalRevenue}</p>
                          <p className="text-gray-600">Revenue</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">${restaurant.analytics.averageOrderValue}</p>
                          <p className="text-gray-600">Avg Order</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-6">
                        <Link href={`/${restaurant.slug}`}>
                          <Button variant="outline" size="sm">
                            View Site
                          </Button>
                        </Link>
                        <Link href={`/dashboard/${restaurant.slug}`}>
                          <Button size="sm">
                            Dashboard
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}