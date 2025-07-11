import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { performance } from 'perf_hooks';

interface RealTimeEvent {
  id: string;
  type: 'order_update' | 'inventory_change' | 'payment_processed' | 'kitchen_update' | 'staff_notification';
  data: any;
  timestamp: Date;
  source: string;
}

interface ConnectedClient {
  id: string;
  role: 'owner' | 'manager' | 'staff' | 'kitchen' | 'customer';
  location: string;
  connectedAt: Date;
  lastActivity: Date;
}

class WebSocketManager {
  private io: Server;
  private clients: Map<string, ConnectedClient> = new Map();
  private eventHistory: RealTimeEvent[] = [];
  private readonly MAX_HISTORY = 1000;

  constructor(server: HTTPServer) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000
    });

    this.setupEventHandlers();
    this.startHeartbeat();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);
      
      // Register client
      const client: ConnectedClient = {
        id: socket.id,
        role: 'manager', // Default role
        location: 'admin',
        connectedAt: new Date(),
        lastActivity: new Date()
      };
      
      this.clients.set(socket.id, client);
      
      // Send recent events to new client
      socket.emit('event_history', this.eventHistory.slice(-10));
      
      // Handle client registration
      socket.on('register', (data: { role: string; location: string }) => {
        const client = this.clients.get(socket.id);
        if (client) {
          client.role = data.role as any;
          client.location = data.location;
          client.lastActivity = new Date();
          this.clients.set(socket.id, client);
        }
        console.log(`📝 Client registered: ${socket.id} as ${data.role} in ${data.location}`);
      });

      // Handle ping for latency monitoring
      socket.on('ping', (timestamp: number) => {
        socket.emit('pong', timestamp);
      });

      // Handle order updates
      socket.on('order_update', (data: any) => {
        const event: RealTimeEvent = {
          id: `order_${Date.now()}`,
          type: 'order_update',
          data,
          timestamp: new Date(),
          source: socket.id
        };
        
        this.broadcastEvent(event);
        this.addToHistory(event);
      });

      // Handle inventory changes
      socket.on('inventory_change', (data: any) => {
        const event: RealTimeEvent = {
          id: `inventory_${Date.now()}`,
          type: 'inventory_change',
          data,
          timestamp: new Date(),
          source: socket.id
        };
        
        this.broadcastEvent(event);
        this.addToHistory(event);
      });

      // Handle payment processing
      socket.on('payment_processed', (data: any) => {
        const event: RealTimeEvent = {
          id: `payment_${Date.now()}`,
          type: 'payment_processed',
          data,
          timestamp: new Date(),
          source: socket.id
        };
        
        this.broadcastEvent(event);
        this.addToHistory(event);
      });

      // Handle kitchen updates
      socket.on('kitchen_update', (data: any) => {
        const event: RealTimeEvent = {
          id: `kitchen_${Date.now()}`,
          type: 'kitchen_update',
          data,
          timestamp: new Date(),
          source: socket.id
        };
        
        this.broadcastEvent(event);
        this.addToHistory(event);
      });

      // Handle staff notifications
      socket.on('staff_notification', (data: any) => {
        const event: RealTimeEvent = {
          id: `staff_${Date.now()}`,
          type: 'staff_notification',
          data,
          timestamp: new Date(),
          source: socket.id
        };
        
        this.broadcastEvent(event);
        this.addToHistory(event);
      });

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        console.log(`🔌 Client disconnected: ${socket.id} (${reason})`);
        this.clients.delete(socket.id);
      });

      // Update activity timestamp on any event
      socket.onAny(() => {
        const client = this.clients.get(socket.id);
        if (client) {
          client.lastActivity = new Date();
          this.clients.set(socket.id, client);
        }
      });
    });
  }

  private broadcastEvent(event: RealTimeEvent) {
    // Broadcast to all connected clients
    this.io.emit(event.type, event.data);
    
    // Also emit a generic 'realtime_event' for monitoring
    this.io.emit('realtime_event', event);
  }

  private addToHistory(event: RealTimeEvent) {
    this.eventHistory.push(event);
    
    // Keep only the last MAX_HISTORY events
    if (this.eventHistory.length > this.MAX_HISTORY) {
      this.eventHistory = this.eventHistory.slice(-this.MAX_HISTORY);
    }
  }

  private startHeartbeat() {
    // Send periodic status updates
    setInterval(() => {
      const status = {
        connectedClients: this.clients.size,
        timestamp: new Date(),
        systemHealth: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          performance: performance.now()
        }
      };
      
      this.io.emit('system_status', status);
    }, 30000); // Every 30 seconds
  }

  // Public methods for external use
  public notifyOrderUpdate(orderId: string, status: string, details: any) {
    const event: RealTimeEvent = {
      id: `order_${orderId}_${Date.now()}`,
      type: 'order_update',
      data: { orderId, status, details },
      timestamp: new Date(),
      source: 'server'
    };
    
    this.broadcastEvent(event);
    this.addToHistory(event);
  }

  public notifyInventoryChange(itemId: string, change: any) {
    const event: RealTimeEvent = {
      id: `inventory_${itemId}_${Date.now()}`,
      type: 'inventory_change',
      data: { itemId, change },
      timestamp: new Date(),
      source: 'server'
    };
    
    this.broadcastEvent(event);
    this.addToHistory(event);
  }

  public notifyPaymentProcessed(paymentId: string, amount: number, method: string) {
    const event: RealTimeEvent = {
      id: `payment_${paymentId}_${Date.now()}`,
      type: 'payment_processed',
      data: { paymentId, amount, method },
      timestamp: new Date(),
      source: 'server'
    };
    
    this.broadcastEvent(event);
    this.addToHistory(event);
  }

  public notifyKitchenUpdate(orderId: string, status: string, estimatedTime?: number) {
    const event: RealTimeEvent = {
      id: `kitchen_${orderId}_${Date.now()}`,
      type: 'kitchen_update',
      data: { orderId, status, estimatedTime },
      timestamp: new Date(),
      source: 'server'
    };
    
    this.broadcastEvent(event);
    this.addToHistory(event);
  }

  public notifyStaff(message: string, priority: 'low' | 'normal' | 'high' | 'urgent') {
    const event: RealTimeEvent = {
      id: `staff_${Date.now()}`,
      type: 'staff_notification',
      data: { message, priority },
      timestamp: new Date(),
      source: 'server'
    };
    
    this.broadcastEvent(event);
    this.addToHistory(event);
  }

  public getConnectedClients(): ConnectedClient[] {
    return Array.from(this.clients.values());
  }

  public getEventHistory(): RealTimeEvent[] {
    return this.eventHistory;
  }

  public getClientsByRole(role: string): ConnectedClient[] {
    return Array.from(this.clients.values()).filter(client => client.role === role);
  }
}

export default WebSocketManager;