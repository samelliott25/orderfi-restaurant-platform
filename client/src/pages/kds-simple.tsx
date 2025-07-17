import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StandardLayout } from '../components/StandardLayout';
import ErrorBoundary from '../components/ErrorBoundary';

export default function KDSSimple() {
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <StandardLayout title="Kitchen Display System" subtitle="Loading orders...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </StandardLayout>
    );
  }

  if (error) {
    return (
      <StandardLayout title="Kitchen Display System" subtitle="Error loading orders">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load orders: {error.message}</p>
        </div>
      </StandardLayout>
    );
  }

  return (
    <ErrorBoundary>
      <StandardLayout title="Kitchen Display System" subtitle="Real-time order management">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Active Orders ({orders.length})</h3>
            
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active orders</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Order #{order.id}</h4>
                        <p className="text-sm text-gray-600">
                          {order.customerName || 'Guest'} • Table {order.tableNumber || 'N/A'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'ready' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Items:</strong>
                        <div className="mt-1">
                          {order.items ? (
                            typeof order.items === 'string' ? (
                              <span>{order.items}</span>
                            ) : (
                              Array.isArray(order.items) ? (
                                order.items.map((item: any, idx: number) => (
                                  <div key={idx} className="text-gray-600">
                                    {item.name || item} x{item.quantity || 1}
                                  </div>
                                ))
                              ) : (
                                <span>Invalid items format</span>
                              )
                            )
                          ) : (
                            <span>No items</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <strong>Total:</strong> ${order.total || '0.00'}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <strong>Ordered:</strong> {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 bg-orange-500 text-white text-sm py-2 px-3 rounded hover:bg-orange-600 transition-colors">
                        Update Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </StandardLayout>
    </ErrorBoundary>
  );
}