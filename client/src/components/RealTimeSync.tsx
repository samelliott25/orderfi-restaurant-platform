import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Activity, AlertCircle } from 'lucide-react';

// Mock Socket.io interface for now
interface Socket {
  connected: boolean;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  onAny: (callback: (event: string, data: any) => void) => void;
  close: () => void;
}

interface RealTimeEvent {
  id: string;
  type: 'order_update' | 'inventory_change' | 'payment_processed' | 'kitchen_update' | 'staff_notification';
  data: any;
  timestamp: Date;
  source: string;
}

interface RealTimeContextType {
  socket: Socket | null;
  isConnected: boolean;
  events: RealTimeEvent[];
  subscribe: (eventType: string, callback: (data: any) => void) => void;
  unsubscribe: (eventType: string) => void;
  emit: (eventType: string, data: any) => void;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  latency: number;
}

const RealTimeContext = createContext<RealTimeContextType | null>(null);

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

interface RealTimeProviderProps {
  children: React.ReactNode;
  url?: string;
}

export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ 
  children, 
  url = 'http://localhost:5000' 
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');
  const [latency, setLatency] = useState(0);
  
  const subscribersRef = useRef<Map<string, ((data: any) => void)[]>>(new Map());
  const latencyCheckRef = useRef<number | null>(null);

  useEffect(() => {
    // Mock Socket.IO connection for now
    const newSocket: Socket = {
      connected: true,
      emit: (event: string, data?: any) => {
        console.log('Mock emit:', event, data);
      },
      on: (event: string, callback: (data: any) => void) => {
        console.log('Mock on:', event);
      },
      onAny: (callback: (event: string, data: any) => void) => {
        console.log('Mock onAny registered');
      },
      close: () => {
        console.log('Mock close');
      }
    };

    // Mock connection setup
    console.log('✅ Real-time connection established (mock)');
    setIsConnected(true);
    setSocket(newSocket);
    setConnectionQuality('excellent');
    setLatency(25);

    // Simulate periodic events for demonstration
    const simulateEvents = () => {
      const eventTypes = ['order_update', 'inventory_change', 'kitchen_update', 'payment_processed'];
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      const event: RealTimeEvent = {
        id: `${Date.now()}-${Math.random()}`,
        type: randomType as any,
        data: { message: `Simulated ${randomType}`, timestamp: new Date() },
        timestamp: new Date(),
        source: 'server'
      };
      
      setEvents(prev => [event, ...prev.slice(0, 99)]); // Keep last 100 events
      
      // Trigger subscribers
      const subscribers = subscribersRef.current.get(randomType) || [];
      subscribers.forEach(callback => callback(event.data));
    };

    // Simulate events every 10 seconds
    const eventInterval = setInterval(simulateEvents, 10000);

    // Cleanup
    return () => {
      clearInterval(eventInterval);
      newSocket.close();
    };

    setSocket(newSocket);
  }, [url]);

  const startLatencyCheck = (socket: Socket) => {
    const pingServer = () => {
      if (socket.connected) {
        socket.emit('ping', Date.now());
      }
    };
    
    // Ping every 5 seconds
    latencyCheckRef.current = window.setInterval(pingServer, 5000);
    pingServer(); // Initial ping
  };

  const stopLatencyCheck = () => {
    if (latencyCheckRef.current) {
      clearInterval(latencyCheckRef.current);
      latencyCheckRef.current = null;
    }
  };

  const subscribe = (eventType: string, callback: (data: any) => void) => {
    const current = subscribersRef.current.get(eventType) || [];
    subscribersRef.current.set(eventType, [...current, callback]);
  };

  const unsubscribe = (eventType: string) => {
    subscribersRef.current.delete(eventType);
  };

  const emit = (eventType: string, data: any) => {
    if (socket && socket.connected) {
      socket.emit(eventType, data);
    }
  };

  const contextValue: RealTimeContextType = {
    socket,
    isConnected,
    events,
    subscribe,
    unsubscribe,
    emit,
    connectionQuality,
    latency
  };

  return (
    <RealTimeContext.Provider value={contextValue}>
      {children}
    </RealTimeContext.Provider>
  );
};

// Real-time status indicator component
export const RealTimeStatusIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isConnected, connectionQuality, latency } = useRealTime();

  const getStatusColor = () => {
    if (!isConnected) return 'text-red-500';
    
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-orange-500';
      default: return 'text-red-500';
    }
  };

  const getStatusIcon = () => {
    if (!isConnected) return <WifiOff className="h-4 w-4" />;
    
    switch (connectionQuality) {
      case 'excellent':
      case 'good':
        return <Wifi className="h-4 w-4" />;
      case 'poor':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <WifiOff className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    if (!isConnected) return 'Disconnected';
    return `${connectionQuality} (${latency}ms)`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${getStatusColor()} ${isConnected ? 'animate-pulse' : ''}`}>
        {getStatusIcon()}
      </div>
      <Badge 
        variant={isConnected ? 'default' : 'destructive'}
        className="text-xs"
      >
        {getStatusText()}
      </Badge>
    </div>
  );
};

// Real-time events monitor component
export const RealTimeEventsMonitor: React.FC<{ maxEvents?: number }> = ({ maxEvents = 10 }) => {
  const { events } = useRealTime();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'order_update': return '🍽️';
      case 'inventory_change': return '📦';
      case 'payment_processed': return '💰';
      case 'kitchen_update': return '👨‍🍳';
      case 'staff_notification': return '👥';
      default: return '📡';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'order_update': return 'border-blue-200 bg-blue-50';
      case 'inventory_change': return 'border-yellow-200 bg-yellow-50';
      case 'payment_processed': return 'border-green-200 bg-green-50';
      case 'kitchen_update': return 'border-orange-200 bg-orange-50';
      case 'staff_notification': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No real-time events yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-orange-500" />
        <h3 className="font-semibold">Real-Time Events</h3>
        <Badge variant="outline">{events.length}</Badge>
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {events.slice(0, maxEvents).map((event) => (
          <div 
            key={event.id}
            className={`p-3 rounded-lg border ${getEventColor(event.type)} transition-all duration-200`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{getEventIcon(event.type)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm capitalize">
                    {event.type.replace('_', ' ')}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {event.source}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {typeof event.data === 'string' ? event.data : JSON.stringify(event.data)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {event.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Hook for specific event type subscriptions
export const useRealTimeEvent = (eventType: string, callback: (data: any) => void) => {
  const { subscribe, unsubscribe } = useRealTime();

  useEffect(() => {
    subscribe(eventType, callback);
    
    return () => {
      unsubscribe(eventType);
    };
  }, [eventType, callback, subscribe, unsubscribe]);
};

export default RealTimeProvider;