import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface OfflineOrder {
  id: string;
  orderId: number;
  status: string;
  timestamp: number;
  action: 'status-update' | 'new-order';
  data: any;
}

export const useOfflineMode = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineOrder[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Load offline queue from localStorage
    const savedQueue = localStorage.getItem('kds-offline-queue');
    if (savedQueue) {
      try {
        setOfflineQueue(JSON.parse(savedQueue));
      } catch (error) {
        console.error('Error loading offline queue:', error);
      }
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      console.log('KDS back online - syncing offline data');
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('KDS offline mode activated');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Save offline queue to localStorage whenever it changes
    localStorage.setItem('kds-offline-queue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  const addToOfflineQueue = useCallback((order: Omit<OfflineOrder, 'id' | 'timestamp'>) => {
    const offlineOrder: OfflineOrder = {
      ...order,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    setOfflineQueue(prev => [...prev, offlineOrder]);
    console.log('Added to offline queue:', offlineOrder);
  }, []);

  const syncOfflineData = useCallback(async () => {
    if (!isOnline || offlineQueue.length === 0) return;

    console.log(`Syncing ${offlineQueue.length} offline actions...`);
    
    const syncPromises = offlineQueue.map(async (item) => {
      try {
        if (item.action === 'status-update') {
          const response = await fetch(`/api/kds/orders/${item.orderId}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: item.status })
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
        }
        
        return { success: true, id: item.id };
      } catch (error) {
        console.error(`Failed to sync offline action ${item.id}:`, error);
        return { success: false, id: item.id, error };
      }
    });

    const results = await Promise.all(syncPromises);
    
    // Remove successfully synced items from queue
    const successfulIds = results.filter(r => r.success).map(r => r.id);
    setOfflineQueue(prev => prev.filter(item => !successfulIds.includes(item.id)));
    
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['/api/kds/orders'] });
    
    console.log(`Sync complete: ${successfulIds.length} successful, ${results.length - successfulIds.length} failed`);
  }, [isOnline, offlineQueue, queryClient]);

  const updateOrderStatusOffline = useCallback((orderId: number, newStatus: string) => {
    if (isOnline) {
      // If online, proceed with normal update
      return false;
    }

    // Add to offline queue
    addToOfflineQueue({
      orderId,
      status: newStatus,
      action: 'status-update',
      data: { orderId, status: newStatus }
    });

    // Update local state optimistically
    queryClient.setQueryData(['/api/kds/orders'], (oldData: any) => {
      if (!oldData) return oldData;
      return oldData.map((order: any) => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
    });

    return true; // Indicate this was handled offline
  }, [isOnline, addToOfflineQueue, queryClient]);

  const cacheOrdersForOffline = useCallback((orders: any[]) => {
    if (!orders) return;
    
    // Cache orders in localStorage for offline access
    localStorage.setItem('kds-cached-orders', JSON.stringify({
      orders,
      timestamp: Date.now()
    }));
  }, []);

  const getCachedOrders = useCallback(() => {
    try {
      const cached = localStorage.getItem('kds-cached-orders');
      if (cached) {
        const { orders, timestamp } = JSON.parse(cached);
        // Return cached orders if they're less than 5 minutes old
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          return orders;
        }
      }
    } catch (error) {
      console.error('Error reading cached orders:', error);
    }
    return null;
  }, []);

  return {
    isOnline,
    offlineQueue,
    queueLength: offlineQueue.length,
    addToOfflineQueue,
    updateOrderStatusOffline,
    syncOfflineData,
    cacheOrdersForOffline,
    getCachedOrders
  };
};