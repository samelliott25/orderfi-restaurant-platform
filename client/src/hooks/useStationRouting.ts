import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface Station {
  id: string;
  name: string;
  color: string;
  categories: string[];
  enabled: boolean;
  displayOrder: number;
}

export interface StationAssignment {
  orderId: number;
  stationId: string;
  assignedAt: number;
  priority: number;
}

const DEFAULT_STATIONS: Station[] = [
  {
    id: 'grill',
    name: 'Grill Station',
    color: '#ef4444',
    categories: ['mains', 'burgers', 'steaks', 'grilled'],
    enabled: true,
    displayOrder: 1
  },
  {
    id: 'salad',
    name: 'Salad Station',
    color: '#10b981',
    categories: ['starters', 'salads', 'cold'],
    enabled: true,
    displayOrder: 2
  },
  {
    id: 'fry',
    name: 'Fry Station',
    color: '#f59e0b',
    categories: ['sides', 'fries', 'fried'],
    enabled: true,
    displayOrder: 3
  },
  {
    id: 'dessert',
    name: 'Dessert Station',
    color: '#8b5cf6',
    categories: ['desserts', 'sweets', 'pastry'],
    enabled: true,
    displayOrder: 4
  },
  {
    id: 'drinks',
    name: 'Beverage Station',
    color: '#06b6d4',
    categories: ['beverages', 'drinks', 'cocktails'],
    enabled: true,
    displayOrder: 5
  }
];

export const useStationRouting = () => {
  const [stations, setStations] = useState<Station[]>(DEFAULT_STATIONS);
  const [assignments, setAssignments] = useState<StationAssignment[]>([]);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Load stations from localStorage
    const savedStations = localStorage.getItem('kds-stations');
    if (savedStations) {
      try {
        setStations(JSON.parse(savedStations));
      } catch (error) {
        console.error('Error loading stations:', error);
      }
    }

    // Load assignments from localStorage
    const savedAssignments = localStorage.getItem('kds-assignments');
    if (savedAssignments) {
      try {
        setAssignments(JSON.parse(savedAssignments));
      } catch (error) {
        console.error('Error loading assignments:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save stations to localStorage
    localStorage.setItem('kds-stations', JSON.stringify(stations));
  }, [stations]);

  useEffect(() => {
    // Save assignments to localStorage
    localStorage.setItem('kds-assignments', JSON.stringify(assignments));
  }, [assignments]);

  const autoAssignOrderToStation = useCallback((order: any): string | null => {
    if (!order.items) return null;

    try {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      
      // Count items per station category
      const stationCounts: Record<string, number> = {};
      
      items.forEach((item: any) => {
        const itemName = item.name.toLowerCase();
        
        // Find best matching station
        for (const station of stations) {
          if (!station.enabled) continue;
          
          for (const category of station.categories) {
            if (itemName.includes(category)) {
              stationCounts[station.id] = (stationCounts[station.id] || 0) + item.quantity;
              break;
            }
          }
        }
      });

      // Return station with highest item count
      if (Object.keys(stationCounts).length > 0) {
        const bestStation = Object.entries(stationCounts)
          .sort(([,a], [,b]) => b - a)[0][0];
        return bestStation;
      }
    } catch (error) {
      console.error('Error auto-assigning order:', error);
    }

    return null;
  }, [stations]);

  const assignOrderToStation = useCallback((orderId: number, stationId: string, priority: number = 1) => {
    const assignment: StationAssignment = {
      orderId,
      stationId,
      assignedAt: Date.now(),
      priority
    };

    setAssignments(prev => {
      // Remove existing assignment for this order
      const filtered = prev.filter(a => a.orderId !== orderId);
      return [...filtered, assignment];
    });

    console.log(`Order ${orderId} assigned to station ${stationId}`);
  }, []);

  const removeStationAssignment = useCallback((orderId: number) => {
    setAssignments(prev => prev.filter(a => a.orderId !== orderId));
  }, []);

  const getOrderStation = useCallback((orderId: number): Station | null => {
    const assignment = assignments.find(a => a.orderId === orderId);
    if (!assignment) return null;
    
    return stations.find(s => s.id === assignment.stationId) || null;
  }, [assignments, stations]);

  const getStationOrders = useCallback((stationId: string, orders: any[]): any[] => {
    const stationOrderIds = assignments
      .filter(a => a.stationId === stationId)
      .map(a => a.orderId);
    
    return orders.filter(order => stationOrderIds.includes(order.id));
  }, [assignments]);

  const getUnassignedOrders = useCallback((orders: any[]): any[] => {
    const assignedOrderIds = assignments.map(a => a.orderId);
    return orders.filter(order => !assignedOrderIds.includes(order.id));
  }, [assignments]);

  const updateStation = useCallback((stationId: string, updates: Partial<Station>) => {
    setStations(prev => prev.map(station => 
      station.id === stationId ? { ...station, ...updates } : station
    ));
  }, []);

  const addStation = useCallback((station: Omit<Station, 'id'>) => {
    const newStation: Station = {
      ...station,
      id: `station_${Date.now()}`,
    };
    setStations(prev => [...prev, newStation].sort((a, b) => a.displayOrder - b.displayOrder));
  }, []);

  const removeStation = useCallback((stationId: string) => {
    setStations(prev => prev.filter(s => s.id !== stationId));
    // Remove assignments for this station
    setAssignments(prev => prev.filter(a => a.stationId !== stationId));
  }, []);

  const getStationStats = useCallback((stationId: string, orders: any[]) => {
    const stationOrders = getStationOrders(stationId, orders);
    const activeOrders = stationOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
    
    const statusCounts = activeOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgPrepTime = activeOrders.length > 0 
      ? activeOrders.reduce((sum, order) => {
          const age = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60);
          return sum + age;
        }, 0) / activeOrders.length
      : 0;

    return {
      totalOrders: stationOrders.length,
      activeOrders: activeOrders.length,
      statusCounts,
      avgPrepTime: Math.round(avgPrepTime)
    };
  }, [getStationOrders]);

  return {
    stations,
    assignments,
    selectedStation,
    setSelectedStation,
    autoAssignOrderToStation,
    assignOrderToStation,
    removeStationAssignment,
    getOrderStation,
    getStationOrders,
    getUnassignedOrders,
    updateStation,
    addStation,
    removeStation,
    getStationStats
  };
};