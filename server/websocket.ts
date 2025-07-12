import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { storage } from './storage';

interface WebSocketMessage {
  type: string;
  payload?: any;
}

interface WebSocketClient {
  ws: any;
  id: string;
  subscriptions: Set<string>;
  lastPing: number;
}

export function setupWebSocket(server: Server, app: any) {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws',
    perMessageDeflate: false
  });

  const clients = new Map<string, WebSocketClient>();
  
  // Heartbeat mechanism
  const heartbeat = setInterval(() => {
    const now = Date.now();
    clients.forEach((client, id) => {
      if (now - client.lastPing > 30000) { // 30 second timeout
        client.ws.terminate();
        clients.delete(id);
      } else {
        client.ws.ping();
      }
    });
  }, 10000); // Check every 10 seconds

  wss.on('connection', (ws, req) => {
    const clientId = generateClientId();
    const client: WebSocketClient = {
      ws,
      id: clientId,
      subscriptions: new Set(),
      lastPing: Date.now()
    };
    
    clients.set(clientId, client);
    console.log(`KDS WebSocket client connected: ${clientId}`);
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connection-established',
      clientId,
      timestamp: new Date().toISOString()
    }));

    ws.on('message', async (data) => {
      try {
        const message: WebSocketMessage = JSON.parse(data.toString());
        await handleWebSocketMessage(client, message);
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });

    ws.on('pong', () => {
      client.lastPing = Date.now();
    });

    ws.on('close', () => {
      console.log(`KDS WebSocket client disconnected: ${clientId}`);
      clients.delete(clientId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
      clients.delete(clientId);
    });
  });

  // Broadcast function for HTTP endpoints
  const broadcast = (message: WebSocketMessage, subscription?: string) => {
    const messageStr = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.ws.readyState === 1) { // WebSocket.OPEN
        if (!subscription || client.subscriptions.has(subscription)) {
          client.ws.send(messageStr);
        }
      }
    });
  };

  // Store broadcast function for HTTP endpoints
  app.set('wsBroadcast', broadcast);
  app.set('wsClients', clients);
  
  console.log('Enhanced WebSocket server initialized for KDS real-time updates');
  
  // Cleanup on process exit
  process.on('SIGTERM', () => {
    clearInterval(heartbeat);
    wss.close();
  });
}

async function handleWebSocketMessage(client: WebSocketClient, message: WebSocketMessage) {
  const { ws, subscriptions } = client;
  
  switch (message.type) {
    case 'subscribe':
      if (message.payload?.channel) {
        subscriptions.add(message.payload.channel);
        ws.send(JSON.stringify({
          type: 'subscribed',
          channel: message.payload.channel,
          timestamp: new Date().toISOString()
        }));
      }
      break;
      
    case 'unsubscribe':
      if (message.payload?.channel) {
        subscriptions.delete(message.payload.channel);
        ws.send(JSON.stringify({
          type: 'unsubscribed',
          channel: message.payload.channel,
          timestamp: new Date().toISOString()
        }));
      }
      break;
      
    case 'ping':
      ws.send(JSON.stringify({
        type: 'pong',
        timestamp: new Date().toISOString()
      }));
      break;
      
    case 'get-active-orders':
      try {
        const orders = await storage.getActiveOrders();
        ws.send(JSON.stringify({
          type: 'active-orders',
          payload: orders,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Failed to fetch active orders'
        }));
      }
      break;
      
    default:
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Unknown message type'
      }));
  }
}

function generateClientId(): string {
  return `kds_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}